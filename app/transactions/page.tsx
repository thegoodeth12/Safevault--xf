import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, Download, Filter, Search, Shield } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function Transactions() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="h-5 w-5" />
            <span>SafeWallet</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-sm font-medium text-primary">
              Transactions
            </Link>
            <Link href="/security" className="text-sm font-medium">
              Security
            </Link>
            <Link href="/settings" className="text-sm font-medium">
              Settings
            </Link>
          </nav>
          <MobileNav />
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Transaction History</h1>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View and filter your transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Search transactions..." className="pl-8" />
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Asset Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Assets</SelectItem>
                          <SelectItem value="btc">Bitcoin</SelectItem>
                          <SelectItem value="eth">Ethereum</SelectItem>
                          <SelectItem value="sol">Solana</SelectItem>
                          <SelectItem value="usdc">USDC</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Transaction Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="exchange">Exchange</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="w-full sm:w-auto bg-transparent">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4 md:hidden">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-500/10 p-2">
                              <ArrowDown className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <div className="font-medium">Received Bitcoin</div>
                              <div className="text-sm text-muted-foreground">From: 3FZbgi29...</div>
                            </div>
                          </div>
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-green-500">+0.05 BTC</span>
                            <span className="ml-2 text-sm text-muted-foreground">($1,234.56)</span>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>Apr 18, 2025</div>
                            <div>10:23 AM</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-500/10 p-2">
                              <ArrowUp className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <div className="font-medium">Sent Ethereum</div>
                              <div className="text-sm text-muted-foreground">To: 0x742d35...</div>
                            </div>
                          </div>
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-red-500">-0.5 ETH</span>
                            <span className="ml-2 text-sm text-muted-foreground">($876.54)</span>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>Apr 15, 2025</div>
                            <div>3:45 PM</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden md:block rounded-md border">
                    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 font-medium">
                      <div>Transaction</div>
                      <div>Amount</div>
                      <div>Date</div>
                      <div className="text-right">Status</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <ArrowDown className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Received Bitcoin</div>
                            <div className="text-sm text-muted-foreground">From: 3FZbgi29...</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-green-500">+0.05 BTC</span>
                          <span className="ml-2 text-sm text-muted-foreground">($1,234.56)</span>
                        </div>
                        <div className="flex items-center">
                          <span>Apr 18, 2025</span>
                          <span className="ml-2 text-sm text-muted-foreground">10:23 AM</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-red-500/10 p-2">
                            <ArrowUp className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Sent Ethereum</div>
                            <div className="text-sm text-muted-foreground">To: 0x742d35...</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-red-500">-0.5 ETH</span>
                          <span className="ml-2 text-sm text-muted-foreground">($876.54)</span>
                        </div>
                        <div className="flex items-center">
                          <span>Apr 15, 2025</span>
                          <span className="ml-2 text-sm text-muted-foreground">3:45 PM</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <ArrowDown className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Received Solana</div>
                            <div className="text-sm text-muted-foreground">From: 8Kbgi2...</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-green-500">+2.5 SOL</span>
                          <span className="ml-2 text-sm text-muted-foreground">($123.45)</span>
                        </div>
                        <div className="flex items-center">
                          <span>Apr 12, 2025</span>
                          <span className="ml-2 text-sm text-muted-foreground">9:15 AM</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-red-500/10 p-2">
                            <ArrowUp className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <div className="font-medium">Sent Bitcoin</div>
                            <div className="text-sm text-muted-foreground">To: 1A1zP1...</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-red-500">-0.02 BTC</span>
                          <span className="ml-2 text-sm text-muted-foreground">($493.82)</span>
                        </div>
                        <div className="flex items-center">
                          <span>Apr 10, 2025</span>
                          <span className="ml-2 text-sm text-muted-foreground">2:30 PM</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-yellow-500/10 p-2">
                            <ArrowDown className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div>
                            <div className="font-medium">Exchange BTC to ETH</div>
                            <div className="text-sm text-muted-foreground">Internal</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-yellow-500">0.01 BTC → 0.15 ETH</span>
                          <span className="ml-2 text-sm text-muted-foreground">($246.91)</span>
                        </div>
                        <div className="flex items-center">
                          <span>Apr 8, 2025</span>
                          <span className="ml-2 text-sm text-muted-foreground">11:20 AM</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 bg-transparent">
                          1
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 bg-primary text-primary-foreground">
                          2
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 bg-transparent">
                          3
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
