import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Fingerprint, Key, Lock, Shield, Smartphone, UserCheck } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function Security() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MobileNav />
          <div className="flex items-center gap-2 font-bold">
            <Shield className="h-5 w-5" />
            <span>SafeWallet</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-sm font-medium">
              Transactions
            </Link>
            <Link href="/security" className="text-sm font-medium text-primary">
              Security
            </Link>
            <Link href="/settings" className="text-sm font-medium">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Security Settings</h1>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Shield className="mr-2 h-4 w-4" />
                Run Security Audit
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                  <CardDescription>Manage your authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Key className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium leading-none">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium leading-none">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Enabled via Authenticator App</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Fingerprint className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium leading-none">Biometric Authentication</p>
                        <p className="text-sm text-muted-foreground">Fingerprint or Face ID</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full bg-transparent">
                    Advanced Settings
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium leading-none">Login Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium leading-none">Transaction Confirmations</p>
                        <p className="text-sm text-muted-foreground">Require confirmation for all transactions</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium leading-none">Suspicious Activity Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified of suspicious activity</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Activity Log
                  </Button>
                </CardFooter>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>Improve your wallet security with these recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start">
                      <div className="rounded-full bg-yellow-500/10 p-2 self-start">
                        <Shield className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Backup Your Recovery Phrase</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your recovery phrase is the only way to recover your wallet if you lose access. Store it in a
                          secure, offline location.
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          View Recovery Phrase
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start">
                      <div className="rounded-full bg-green-500/10 p-2 self-start">
                        <Shield className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Security Audit Complete</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your last security audit was completed on April 15, 2025. Your security score is 92/100.
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          View Audit Results
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start">
                      <div className="rounded-full bg-blue-500/10 p-2 self-start">
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Enable Hardware Wallet Support</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          For maximum security, connect a hardware wallet to secure your high-value assets.
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          Connect Hardware Wallet
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5" />
            <span>SafeWallet</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 SafeWallet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
