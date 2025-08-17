"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth"
import {
  getUserWallets,
  createWallet,
  updateWalletBalance,
  createTransaction,
  getCryptoPrices,
} from "@/lib/wallet-service"
import { sql } from "@/lib/db"

export async function addFunds(formData: FormData) {
  const user = await requireAuth()
  const amount = Number.parseFloat(formData.get("amount") as string)
  const assetType = formData.get("assetType") as string

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount")
  }

  try {
    // Get or create wallet for asset type
    const wallets = await getUserWallets(user.id)
    let wallet = wallets.find((w) => w.asset_type === assetType)

    if (!wallet) {
      wallet = await createWallet(user.id, assetType)
    }

    // Update balance
    const newBalance = wallet.balance + amount
    await updateWalletBalance(wallet.id, newBalance)

    // Create transaction record
    await createTransaction(user.id, wallet.id, "received", amount, undefined, "External Deposit")

    revalidatePath("/dashboard")
    return { success: true, message: "Funds added successfully" }
  } catch (error) {
    console.error("Error adding funds:", error)
    throw new Error("Failed to add funds")
  }
}

export async function sendFunds(formData: FormData) {
  const user = await requireAuth()
  const amount = Number.parseFloat(formData.get("amount") as string)
  const assetType = formData.get("assetType") as string
  const toAddress = formData.get("toAddress") as string

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount")
  }

  if (!toAddress) {
    throw new Error("Recipient address is required")
  }

  try {
    const wallets = await getUserWallets(user.id)
    const wallet = wallets.find((w) => w.asset_type === assetType)

    if (!wallet) {
      throw new Error("Wallet not found")
    }

    if (wallet.balance < amount) {
      throw new Error("Insufficient balance")
    }

    // Update balance
    const newBalance = wallet.balance - amount
    await updateWalletBalance(wallet.id, newBalance)

    // Create transaction record
    await createTransaction(user.id, wallet.id, "sent", amount, toAddress, wallet.address)

    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    return { success: true, message: "Funds sent successfully" }
  } catch (error) {
    console.error("Error sending funds:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to send funds")
  }
}

export async function exchangeAssets(formData: FormData) {
  const user = await requireAuth()
  const fromAsset = formData.get("fromAsset") as string
  const toAsset = formData.get("toAsset") as string
  const amount = Number.parseFloat(formData.get("amount") as string)

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount")
  }

  try {
    const wallets = await getUserWallets(user.id)
    const fromWallet = wallets.find((w) => w.asset_type === fromAsset)
    let toWallet = wallets.find((w) => w.asset_type === toAsset)

    if (!fromWallet) {
      throw new Error("Source wallet not found")
    }

    if (fromWallet.balance < amount) {
      throw new Error("Insufficient balance")
    }

    if (!toWallet) {
      toWallet = await createWallet(user.id, toAsset)
    }

    // Mock exchange rate calculation
    const prices = await getCryptoPrices()
    const fromPrice = prices.find((p) => p.symbol === fromAsset)?.price || 1
    const toPrice = prices.find((p) => p.symbol === toAsset)?.price || 1
    const exchangeRate = fromPrice / toPrice
    const receivedAmount = amount * exchangeRate

    // Update balances
    await updateWalletBalance(fromWallet.id, fromWallet.balance - amount)
    await updateWalletBalance(toWallet.id, toWallet.balance + receivedAmount)

    // Create transaction record
    await createTransaction(user.id, fromWallet.id, "exchange", amount, toWallet.address, fromWallet.address)

    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    return { success: true, message: "Assets exchanged successfully" }
  } catch (error) {
    console.error("Error exchanging assets:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to exchange assets")
  }
}

export async function runSecurityAudit() {
  const user = await requireAuth()

  try {
    // Mock security audit
    const score = Math.floor(Math.random() * 20) + 80 // Score between 80-100
    const recommendations = [
      "Enable two-factor authentication",
      "Update your password regularly",
      "Use a hardware wallet for large amounts",
      "Keep your recovery phrase secure",
    ]

    await sql`
      INSERT INTO security_audits (user_id, score, recommendations)
      VALUES (${user.id}, ${score}, ${JSON.stringify(recommendations)})
    `

    revalidatePath("/security")
    return { success: true, score, recommendations }
  } catch (error) {
    console.error("Error running security audit:", error)
    throw new Error("Failed to run security audit")
  }
}

export async function updateProfile(formData: FormData) {
  const user = await requireAuth()
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const timezone = formData.get("timezone") as string

  try {
    await sql`
      UPDATE users 
      SET name = ${name}, phone = ${phone}, timezone = ${timezone}, updated_at = NOW()
      WHERE id = ${user.id}
    `

    revalidatePath("/settings")
    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }
}
