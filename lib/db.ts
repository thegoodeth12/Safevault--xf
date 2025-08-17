import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  timezone: string
  created_at: Date
  updated_at: Date
}

export interface Wallet {
  id: string
  user_id: string
  address: string
  asset_type: string
  balance: number
  private_key_encrypted: string
  created_at: Date
  updated_at: Date
}

export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  type: "sent" | "received" | "exchange"
  asset_type: string
  amount: number
  to_address?: string
  from_address?: string
  transaction_hash: string
  status: "pending" | "completed" | "failed"
  created_at: Date
  updated_at: Date
}

export interface SecurityAudit {
  id: string
  user_id: string
  score: number
  recommendations: string[]
  completed_at: Date
}

export { sql }
