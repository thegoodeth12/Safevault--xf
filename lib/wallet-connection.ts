"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WalletContextType {
  account: string | null
  chainId: number | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnection()

    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum

      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("chainChanged", handleChainChanged)

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged)
        ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)

          const chainId = await (window as any).ethereum.request({
            method: "eth_chainId",
          })
          setChainId(Number.parseInt(chainId, 16))
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }

  const connect = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)

          const chainId = await (window as any).ethereum.request({
            method: "eth_chainId",
          })
          setChainId(Number.parseInt(chainId, 16))
        }
      } else {
        throw new Error("No wallet found. Please install MetaMask.")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    setIsConnected(false)
  }

  const switchChain = async (targetChainId: number) => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        })
      }
    } catch (error: any) {
      // Chain not added to wallet
      if (error.code === 4902) {
        await addChain(targetChainId)
      } else {
        throw error
      }
    }
  }

  const addChain = async (chainId: number) => {
    const chainData = getChainData(chainId)
    if (!chainData) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    try {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [chainData],
      })
    } catch (error) {
      console.error("Error adding chain:", error)
      throw error
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      setIsConnected(true)
    }
  }

  const handleChainChanged = (chainId: string) => {
    setChainId(Number.parseInt(chainId, 16))
  }

  const value: WalletContextType = {
    account,
    chainId,
    isConnected,
    connect,
    disconnect,
    switchChain,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

function getChainData(chainId: number) {
  const chains: Record<number, any> = {
    1: {
      chainId: "0x1",
      chainName: "Ethereum Mainnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      blockExplorerUrls: ["https://etherscan.io/"],
    },
    5: {
      chainId: "0x5",
      chainName: "Goerli Testnet",
      nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://goerli.infura.io/v3/"],
      blockExplorerUrls: ["https://goerli.etherscan.io/"],
    },
    11155111: {
      chainId: "0xaa36a7",
      chainName: "Sepolia Testnet",
      nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://sepolia.infura.io/v3/"],
      blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    },
    137: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
  }

  return chains[chainId]
}
