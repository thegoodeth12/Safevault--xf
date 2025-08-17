import Safe, { EthersAdapter } from "@safe-global/protocol-kit"
import { ethers } from "ethers"

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
}

export interface SafeInfo {
  address: string
  owners: string[]
  threshold: number
  balance: string
  nonce: number
}

class SafeService {
  private safe: Safe | null = null
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Wallet | null = null

  constructor() {
    // Initialize with a default provider - in production, this would be configurable
    this.provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
    )
  }

  async initializeSafe(safeAddress: string, signerPrivateKey?: string) {
    try {
      if (signerPrivateKey) {
        this.signer = new ethers.Wallet(signerPrivateKey, this.provider)
      }

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: this.signer || this.provider,
      })

      this.safe = await Safe.create({
        ethAdapter,
        safeAddress,
      })

      return this.safe
    } catch (error) {
      console.error("Failed to initialize Safe:", error)
      throw error
    }
  }

  async getSafeInfo(): Promise<SafeInfo | null> {
    if (!this.safe) return null

    try {
      const owners = await this.safe.getOwners()
      const threshold = await this.safe.getThreshold()
      const balance = await this.safe.getBalance()
      const nonce = await this.safe.getNonce()

      return {
        address: await this.safe.getAddress(),
        owners,
        threshold,
        balance: ethers.formatEther(balance),
        nonce,
      }
    } catch (error) {
      console.error("Failed to get Safe info:", error)
      return null
    }
  }

  async getPendingTransactions(): Promise<SafeProposal[]> {
    // Mock data for now - in production, this would fetch from Safe Transaction Service
    return [
      {
        id: "1",
        title: "Transfer 1 ETH to Treasury",
        description: "Monthly treasury funding for operational expenses",
        to: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
        value: "1000000000000000000",
        data: "0x",
        status: "pending",
        confirmations: 2,
        requiredConfirmations: 3,
        submittedBy: "0x1234...5678",
        createdAt: new Date("2025-01-15T10:00:00Z"),
      },
      {
        id: "2",
        title: "Upgrade Safe Contract",
        description: "Upgrade to latest Safe contract version for enhanced security",
        to: "0x8Kbgi29cpjq2GjdwV6A214B1nFoxXeX5XhFubPMSKvX",
        value: "0",
        data: "0x1234abcd...",
        status: "approved",
        confirmations: 3,
        requiredConfirmations: 3,
        submittedBy: "0x5678...9abc",
        createdAt: new Date("2025-01-14T15:30:00Z"),
        executedAt: new Date("2025-01-15T09:15:00Z"),
      },
      {
        id: "3",
        title: "Add New Owner",
        description: "Add new team member as Safe owner",
        to: (await this.safe?.getAddress()) || "",
        value: "0",
        data: "0xaddOwner...",
        status: "pending",
        confirmations: 1,
        requiredConfirmations: 3,
        submittedBy: "0x9abc...def0",
        createdAt: new Date("2025-01-16T08:45:00Z"),
      },
    ]
  }

  async createTransaction(to: string, value: string, data = "0x") {
    if (!this.safe || !this.signer) {
      throw new Error("Safe not initialized or no signer available")
    }

    try {
      const safeTransaction = await this.safe.createTransaction({
        transactions: [
          {
            to,
            value,
            data,
          },
        ],
      })

      const signedTransaction = await this.safe.signTransaction(safeTransaction)
      return signedTransaction
    } catch (error) {
      console.error("Failed to create transaction:", error)
      throw error
    }
  }

  async approveTransaction(transactionId: string) {
    // Mock approval - in production, this would interact with the Safe Transaction Service
    console.log(`Approving transaction ${transactionId}`)
    return { success: true, transactionId }
  }

  async executeTransaction(transactionId: string) {
    // Mock execution - in production, this would execute the transaction on-chain
    console.log(`Executing transaction ${transactionId}`)
    return { success: true, transactionId, txHash: "0x1234...5678" }
  }
}

export const safeService = new SafeService()
