import { sql } from "./db"
import { generateWalletAddress, generatePrivateKey, encrypt } from "./crypto"

export interface AssetPrice {
  symbol: string
  price: number
  change24h: number
}

// Mock crypto prices - in production, this would connect to a real API
export async function getCryptoPrices(): Promise<AssetPrice[]> {
  return [
    { symbol: "BTC", price: 45000, change24h: 2.4 },
    { symbol: "ETH", price: 2800, change24h: 1.2 },
    { symbol: "SOL", price: 95, change24h: -0.8 },
    { symbol: "USDC", price: 1, change24h: 0.0 },
    { symbol: "USDT", price: 1, change24h: 0.0 },
  ]
}

export async function getUserWallets(userId: string) {
  const wallets = await sql`
    SELECT * FROM wallets WHERE user_id = ${userId}
  `
  return wallets
}

export async function createWallet(userId: string, assetType: string) {
  const address = generateWalletAddress(assetType)
  const privateKey = generatePrivateKey()
  const encryptedPrivateKey = encrypt(privateKey)

  const result = await sql`
    INSERT INTO wallets (user_id, address, asset_type, balance, private_key_encrypted)
    VALUES (${userId}, ${address}, ${assetType}, 0, ${encryptedPrivateKey})
    RETURNING *
  `

  return result[0]
}

export async function getWalletBalance(walletId: string) {
  const result = await sql`
    SELECT balance FROM wallets WHERE id = ${walletId}
  `
  return result[0]?.balance || 0
}

export async function updateWalletBalance(walletId: string, newBalance: number) {
  await sql`
    UPDATE wallets SET balance = ${newBalance}, updated_at = NOW()
    WHERE id = ${walletId}
  `
}

export async function getUserTransactions(userId: string, limit = 10) {
  const transactions = await sql`
    SELECT t.*, w.asset_type, w.address as wallet_address
    FROM transactions t
    JOIN wallets w ON t.wallet_id = w.id
    WHERE t.user_id = ${userId}
    ORDER BY t.created_at DESC
    LIMIT ${limit}
  `
  return transactions
}

export async function createTransaction(
  userId: string,
  walletId: string,
  type: "sent" | "received" | "exchange",
  amount: number,
  toAddress?: string,
  fromAddress?: string,
) {
  const transactionHash = generatePrivateKey() // Mock transaction hash

  const result = await sql`
    INSERT INTO transactions (user_id, wallet_id, type, asset_type, amount, to_address, from_address, transaction_hash, status)
    SELECT ${userId}, ${walletId}, ${type}, w.asset_type, ${amount}, ${toAddress}, ${fromAddress}, ${transactionHash}, 'completed'
    FROM wallets w WHERE w.id = ${walletId}
    RETURNING *
  `

  return result[0]
}
