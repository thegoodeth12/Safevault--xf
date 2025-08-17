// Safe SDK imports - these will be dynamically imported to avoid build issues
let Safe: any = null
let EthersAdapter: any = null
let SafeApiKit: any = null

export interface SafeProposal {
  id: string
  title: string
  description: string
  to: string
  value: string
  data: string
  status: "pending" | "approved" | "executed" | "rejected"
  confirmations: number
  requiredConfirmations: number
  submittedBy: string
  createdAt: Date
  executedAt?: Date
  safeTxHash?: string
  transactionHash?: string
  nonce?: number
}

export interface SafeInfo {
  address: string
  owners: string[]
  threshold: number
  balance: string
  nonce: number
  version: string
  modules: string[]
  guard?: string
}

export interface SafeTransaction {
  to: string
  value: string
  data: string
  operation?: number
  safeTxGas?: string
  baseGas?: string
  gasPrice?: string
  gasToken?: string
  refundReceiver?: string
  nonce?: number
}

class SafeService {
  private safe: any = null
  private provider: any = null
  private signer: any = null
  private safeApiKit: any = null
  private isInitialized = false
  private chainId = 1 // Default to mainnet

  constructor() {
    // Initialize based on environment
    if (typeof window !== "undefined") {
      this.initializeBrowser()
    }
  }

  private async initializeBrowser() {
    try {
      // Dynamic imports to avoid build issues
      const { ethers } = await import("ethers")

      // Check if we're in production and have RPC URL
      if (process.env.NEXT_PUBLIC_RPC_URL) {
        this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
      } else if (typeof window !== "undefined" && (window as any).ethereum) {
        // Use MetaMask or other injected provider
        this.provider = new ethers.BrowserProvider((window as any).ethereum)
      }

      // Set chain ID based on environment
      this.chainId = process.env.NEXT_PUBLIC_CHAIN_ID ? Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 1
    } catch (error) {
      console.warn("Failed to initialize browser provider:", error)
    }
  }

  private async loadSafeSDK() {
    if (Safe && EthersAdapter && SafeApiKit) return

    try {
      // Dynamic imports for Safe SDK
      const safeCore = await import("@safe-global/protocol-kit")
      const safeApiKitModule = await import("@safe-global/api-kit")

      Safe = safeCore.default
      SafeApiKit = safeApiKitModule.default

      // Create ethers adapter
      if (this.provider) {
        const { EthersAdapter: EthersAdapterClass } = await import("@safe-global/protocol-kit")
        EthersAdapter = EthersAdapterClass
      }
    } catch (error) {
      console.warn("Safe SDK not available, using mock data:", error)
      return false
    }
    return true
  }

  async initializeSafe(safeAddress: string, signerPrivateKey?: string) {
    try {
      const sdkLoaded = await this.loadSafeSDK()
      if (!sdkLoaded || !this.provider) {
        console.log("Using mock Safe service")
        return true
      }

      // Initialize signer if private key provided
      if (signerPrivateKey && this.provider) {
        const { ethers } = await import("ethers")
        this.signer = new ethers.Wallet(signerPrivateKey, this.provider)
      } else if (this.provider && typeof window !== "undefined") {
        // Request account access for browser
        try {
          await (window as any).ethereum?.request({ method: "eth_requestAccounts" })
          this.signer = await this.provider.getSigner()
        } catch (error) {
          console.warn("Failed to get signer:", error)
        }
      }

      // Create ethers adapter
      const ethAdapter = new EthersAdapter({
        ethers: await import("ethers"),
        signerOrProvider: this.signer || this.provider,
      })

      // Initialize Safe
      this.safe = await Safe.create({
        ethAdapter,
        safeAddress,
      })

      // Initialize Safe API Kit
      const txServiceUrl = this.getTxServiceUrl()
      if (txServiceUrl) {
        this.safeApiKit = new SafeApiKit({
          txServiceUrl,
          ethAdapter,
        })
      }

      this.isInitialized = true
      console.log("Safe initialized successfully:", safeAddress)
      return true
    } catch (error) {
      console.error("Failed to initialize Safe:", error)
      return false
    }
  }

  private getTxServiceUrl(): string | null {
    // Return transaction service URL based on chain ID
    switch (this.chainId) {
      case 1: // Mainnet
        return "https://safe-transaction-mainnet.safe.global"
      case 5: // Goerli
        return "https://safe-transaction-goerli.safe.global"
      case 11155111: // Sepolia
        return "https://safe-transaction-sepolia.safe.global"
      case 137: // Polygon
        return "https://safe-transaction-polygon.safe.global"
      case 56: // BSC
        return "https://safe-transaction-bsc.safe.global"
      case 100: // Gnosis Chain
        return "https://safe-transaction-gnosis-chain.safe.global"
      case 42161: // Arbitrum
        return "https://safe-transaction-arbitrum.safe.global"
      case 10: // Optimism
        return "https://safe-transaction-optimism.safe.global"
      default:
        return null
    }
  }

  async getSafeInfo(): Promise<SafeInfo | null> {
    try {
      if (!this.isInitialized || !this.safe) {
        return this.getMockSafeInfo()
      }

      const [owners, threshold, nonce, version, balance] = await Promise.all([
        this.safe.getOwners(),
        this.safe.getThreshold(),
        this.safe.getNonce(),
        this.safe.getContractVersion(),
        this.provider?.getBalance(await this.safe.getAddress()) || "0",
      ])

      const { ethers } = await import("ethers")

      return {
        address: await this.safe.getAddress(),
        owners,
        threshold,
        balance: ethers.formatEther(balance),
        nonce,
        version,
        modules: (await this.safe.getModules()) || [],
        guard: (await this.safe.getGuard()) || undefined,
      }
    } catch (error) {
      console.error("Error fetching Safe info:", error)
      return this.getMockSafeInfo()
    }
  }

  private getMockSafeInfo(): SafeInfo {
    return {
      address: process.env.NEXT_PUBLIC_SAFE_ADDRESS || "0x1234567890123456789012345678901234567890",
      owners: [
        "0x1234567890123456789012345678901234567890",
        "0x2345678901234567890123456789012345678901",
        "0x3456789012345678901234567890123456789012",
      ],
      threshold: 2,
      balance: "1.5",
      nonce: 42,
      version: "1.3.0",
      modules: [],
    }
  }

  async getPendingTransactions(): Promise<SafeProposal[]> {
    try {
      if (!this.isInitialized || !this.safeApiKit || !this.safe) {
        return this.getMockProposals()
      }

      const safeAddress = await this.safe.getAddress()
      const pendingTxs = await this.safeApiKit.getPendingTransactions(safeAddress)
      const threshold = await this.safe.getThreshold()

      return pendingTxs.results.map((tx: any) => ({
        id: tx.safeTxHash,
        title: tx.dataDecoded?.method || `Transfer ${tx.value} ETH`,
        description: this.generateDescription(tx),
        to: tx.to,
        value: tx.value,
        data: tx.data || "0x",
        status: tx.isExecuted ? "executed" : tx.confirmations?.length >= threshold ? "approved" : "pending",
        confirmations: tx.confirmations?.length || 0,
        requiredConfirmations: threshold,
        submittedBy: tx.proposer || "Unknown",
        createdAt: new Date(tx.submissionDate),
        executedAt: tx.executionDate ? new Date(tx.executionDate) : undefined,
        safeTxHash: tx.safeTxHash,
        transactionHash: tx.transactionHash,
        nonce: tx.nonce,
      }))
    } catch (error) {
      console.error("Error fetching pending transactions:", error)
      return this.getMockProposals()
    }
  }

  private generateDescription(tx: any): string {
    if (tx.dataDecoded) {
      return `${tx.dataDecoded.method} with ${tx.dataDecoded.parameters?.length || 0} parameters`
    }
    if (tx.value && tx.value !== "0") {
      return `Transfer ${tx.value} ETH to ${tx.to}`
    }
    return `Contract interaction with ${tx.to}`
  }

  private getMockProposals(): SafeProposal[] {
    return [
      {
        id: "1",
        title: "Transfer 1 ETH to Treasury",
        description: "Monthly treasury funding for operational expenses",
        to: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
        value: "1000000000000000000",
        data: "0x",
        status: "pending",
        confirmations: 1,
        requiredConfirmations: 2,
        submittedBy: "0x1234...5678",
        createdAt: new Date("2025-01-15T10:00:00Z"),
        safeTxHash: "0xabc123...",
        nonce: 42,
      },
      {
        id: "2",
        title: "Add New Owner",
        description: "Add new team member as Safe owner",
        to: process.env.NEXT_PUBLIC_SAFE_ADDRESS || "0x1234567890123456789012345678901234567890",
        value: "0",
        data: "0x0d582f13000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000000000000000000a",
        status: "pending",
        confirmations: 1,
        requiredConfirmations: 2,
        submittedBy: "0x9abc...def0",
        createdAt: new Date("2025-01-16T08:45:00Z"),
        safeTxHash: "0xdef456...",
        nonce: 43,
      },
    ]
  }

  async createTransaction(to: string, value: string, data = "0x", operation = 0): Promise<any> {
    try {
      if (!this.isInitialized || !this.safe || !this.signer) {
        console.log("Creating mock transaction")
        return {
          id: Date.now().toString(),
          to,
          value,
          data,
          status: "pending",
          safeTxHash: `0x${Date.now().toString(16)}`,
        }
      }

      // Create Safe transaction
      const safeTransactionData: SafeTransaction = {
        to,
        value,
        data,
        operation,
      }

      const safeTransaction = await this.safe.createTransaction({ safeTransactionData })
      const safeTxHash = await this.safe.getTransactionHash(safeTransaction)

      // Sign the transaction
      const signedTransaction = await this.safe.signTransaction(safeTransaction)

      // Propose transaction via API if available
      if (this.safeApiKit) {
        const safeAddress = await this.safe.getAddress()
        const senderAddress = await this.signer.getAddress()

        await this.safeApiKit.proposeTransaction({
          safeAddress,
          safeTransactionData: signedTransaction.data,
          safeTxHash,
          senderAddress,
          senderSignature: signedTransaction.signatures.get(senderAddress.toLowerCase())?.data || "",
        })
      }

      return {
        safeTxHash,
        transaction: safeTransaction,
        signatures: signedTransaction.signatures,
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  }

  async approveTransaction(safeTxHash: string): Promise<any> {
    try {
      if (!this.isInitialized || !this.safe || !this.signer || !this.safeApiKit) {
        console.log(`Mock approving transaction ${safeTxHash}`)
        return { success: true, safeTxHash }
      }

      const safeAddress = await this.safe.getAddress()
      const transaction = await this.safeApiKit.getTransaction(safeTxHash)

      // Create Safe transaction from API data
      const safeTransaction = await this.safe.createTransaction({
        safeTransactionData: {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data || "0x",
          operation: transaction.operation,
        },
      })

      // Sign the transaction
      const signedTransaction = await this.safe.signTransaction(safeTransaction)
      const senderAddress = await this.signer.getAddress()

      // Submit confirmation
      await this.safeApiKit.confirmTransaction(
        safeTxHash,
        signedTransaction.signatures.get(senderAddress.toLowerCase())?.data || "",
      )

      return {
        success: true,
        safeTxHash,
        signature: signedTransaction.signatures.get(senderAddress.toLowerCase())?.data,
      }
    } catch (error) {
      console.error("Error approving transaction:", error)
      throw error
    }
  }

  async executeTransaction(safeTxHash: string): Promise<any> {
    try {
      if (!this.isInitialized || !this.safe || !this.signer || !this.safeApiKit) {
        console.log(`Mock executing transaction ${safeTxHash}`)
        return { success: true, safeTxHash, txHash: `0x${Date.now().toString(16)}` }
      }

      const transaction = await this.safeApiKit.getTransaction(safeTxHash)

      // Create Safe transaction
      const safeTransaction = await this.safe.createTransaction({
        safeTransactionData: {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data || "0x",
          operation: transaction.operation,
        },
      })

      // Execute the transaction
      const executeTxResponse = await this.safe.executeTransaction(safeTransaction)
      const receipt = await executeTxResponse.transactionResponse?.wait()

      return {
        success: true,
        safeTxHash,
        txHash: receipt?.hash,
        blockNumber: receipt?.blockNumber,
      }
    } catch (error) {
      console.error("Error executing transaction:", error)
      throw error
    }
  }

  async getTransactionHistory(limit = 20): Promise<SafeProposal[]> {
    try {
      if (!this.isInitialized || !this.safeApiKit || !this.safe) {
        return []
      }

      const safeAddress = await this.safe.getAddress()
      const allTxs = await this.safeApiKit.getMultisigTransactions(safeAddress)
      const threshold = await this.safe.getThreshold()

      return allTxs.results.slice(0, limit).map((tx: any) => ({
        id: tx.safeTxHash,
        title: tx.dataDecoded?.method || `Transfer ${tx.value} ETH`,
        description: this.generateDescription(tx),
        to: tx.to,
        value: tx.value,
        data: tx.data || "0x",
        status: tx.isExecuted ? "executed" : tx.isSuccessful === false ? "rejected" : "approved",
        confirmations: tx.confirmations?.length || 0,
        requiredConfirmations: threshold,
        submittedBy: tx.proposer || "Unknown",
        createdAt: new Date(tx.submissionDate),
        executedAt: tx.executionDate ? new Date(tx.executionDate) : undefined,
        safeTxHash: tx.safeTxHash,
        transactionHash: tx.transactionHash,
        nonce: tx.nonce,
      }))
    } catch (error) {
      console.error("Error fetching transaction history:", error)
      return []
    }
  }

  // Utility methods
  async isOwner(address: string): Promise<boolean> {
    try {
      if (!this.safe) return false
      const owners = await this.safe.getOwners()
      return owners.includes(address)
    } catch (error) {
      console.error("Error checking owner status:", error)
      return false
    }
  }

  async getRequiredConfirmations(): Promise<number> {
    try {
      if (!this.safe) return 2
      return await this.safe.getThreshold()
    } catch (error) {
      console.error("Error getting threshold:", error)
      return 2
    }
  }

  // Connection status
  isConnected(): boolean {
    return this.isInitialized && !!this.safe
  }

  getChainId(): number {
    return this.chainId
  }
}

export const safeService = new SafeService()
