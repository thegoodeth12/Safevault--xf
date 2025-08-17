import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, BarChart3, Clock, DollarSign, Shield } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { AddFundsDialog } from "@/components/add-funds-dialog"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="h-5 w-5" />
            <span>SafeWallet</span>
          </div>
          <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-sm font-medium">
              Transactions
            </Link>
            <Link href="/security" className="text-sm font-medium">
              Security
            </Link>
            <Link href="/settings" className="text-sm font-medium">
              Settings
            </Link>
          </nav>
          <div className="ml-auto md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
              <AddFundsDialog />
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,345.67</div>
                  <p className="text-xs text-muted-foreground">+$123.45 (1.2%)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92/100</div>
                  <p className="text-xs text-muted-foreground">Excellent</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">BTC, ETH, SOL, USDC, USDT</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="assets" className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full min-w-[400px] grid-cols-3">
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="assets" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Assets</CardTitle>
                    <CardDescription>Overview of your cryptocurrency and digital assets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Bitcoin (BTC)</div>
                            <div className="text-sm text-muted-foreground">0.45 BTC</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$8,234.56</div>
                          <div className="text-sm text-green-500">+2.4%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Ethereum (ETH)</div>
                            <div className="text-sm text-muted-foreground">2.35 ETH</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$3,456.78</div>
                          <div className="text-sm text-green-500">+1.2%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Solana (SOL)</div>
                            <div className="text-sm text-muted-foreground">12.5 SOL</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$654.33</div>
                          <div className="text-sm text-red-500">-0.8%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Assets
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="recent" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <ArrowDown className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Received Bitcoin</div>
                            <div className="text-sm text-muted-foreground">From: 3FZbgi29...</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">+0.05 BTC</div>
                          <div className="text-sm text-muted-foreground">Apr 18, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-red-500/10 p-2">
                            <ArrowUp className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Sent Ethereum</div>
                            <div className="text-sm text-muted-foreground">To: 0x742d35...</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">-0.5 ETH</div>
                          <div className="text-sm text-muted-foreground">Apr 15, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <ArrowDown className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Received Solana</div>
                            <div className="text-sm text-muted-foreground">From: 8Kbgi2...</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">+2.5 SOL</div>
                          <div className="text-sm text-muted-foreground">Apr 12, 2025</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                    <CardDescription>Current security settings and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <Shield className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-muted-foreground">Enabled</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <Shield className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Biometric Authentication</div>
                            <div className="text-sm text-muted-foreground">Enabled</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-yellow-500/10 p-2">
                            <Clock className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div>
                            <div className="font-medium">Last Security Audit</div>
                            <div className="text-sm text-muted-foreground">30 days ago</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Run Audit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent">
                      Security Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
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
