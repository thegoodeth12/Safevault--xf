"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/wallet-connection"

export function WalletConnection() {
  const { account, chainId, isConnected, connect, disconnect, switchChain } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet. Please make sure MetaMask is installed.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      await switchChain(targetChainId)
    } catch (error) {
      console.error("Failed to switch chain:", error)
      alert("Failed to switch network. Please try manually in your wallet.")
    }
  }

  const getChainName = (chainId: number | null) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet"
      case 5:
        return "Goerli Testnet"
      case 11155111:
        return "Sepolia Testnet"
      case 137:
        return "Polygon Mainnet"
      default:
        return "Unknown Network"
    }
  }

  const isCorrectChain = () => {
    const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID ? Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 1
    return chainId === expectedChainId
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to interact with Safe contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Wallet Connected
        </CardTitle>
        <CardDescription>Your wallet is connected and ready to use</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Account:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Network:</span>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isCorrectChain()
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
              }`}
            >
              {isCorrectChain() ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              {getChainName(chainId)}
            </span>
          </div>
        </div>

        {!isCorrectChain() && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 mb-2">Please switch to the correct network to use Safe features.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleSwitchChain(
                  process.env.NEXT_PUBLIC_CHAIN_ID ? Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 1,
                )
              }
            >
              Switch Network
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
