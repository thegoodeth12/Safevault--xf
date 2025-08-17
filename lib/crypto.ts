import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-secret-key-here"
const ALGORITHM = "aes-256-gcm"

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

export function decrypt(encryptedText: string): string {
  const textParts = encryptedText.split(":")
  const iv = Buffer.from(textParts.shift()!, "hex")
  const encrypted = textParts.join(":")
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

export function generateWalletAddress(assetType: string): string {
  const randomBytes = crypto.randomBytes(20)
  const prefix = assetType === "BTC" ? "1" : assetType === "ETH" ? "0x" : ""
  return prefix + randomBytes.toString("hex")
}

export function generatePrivateKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, "salt", 1000, 64, "sha512").toString("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  const hashVerify = crypto.pbkdf2Sync(password, "salt", 1000, 64, "sha512").toString("hex")
  return hash === hashVerify
}
