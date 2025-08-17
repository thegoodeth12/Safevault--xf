"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("demo@safewallet.com")
  const [password, setPassword] = useState("demo123")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock login - in production, this would validate credentials
      if (email === "demo@safewallet.com" && password === "demo123") {
        // Set session cookie (mock)
        document.cookie = "session-token=test-user-id-123; path=/; max-age=604800"
        router.push("/dashboard")
      } else {
        alert("Invalid credentials. Use demo@safewallet.com / demo123")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">SafeWallet</span>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your secure wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Credentials:</strong>
              <br />
              Email: demo@safewallet.com
              <br />
              Password: demo123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
