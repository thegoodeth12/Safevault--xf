"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Clock, CheckCircle, XCircle, ExternalLink, Wallet, ArrowRight, AlertCircle } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { CreateProposalDialog } from "@/components/create-proposal-dialog"
import { WalletConnection } from "@/components/wallet-connection"
import { useWallet } from "@/lib/wallet-connection"
import type { SafeProposal, SafeInfo } from "@/lib/safe-service"

export default function SafePage() {
  const { isConnected, account, chainId } = useWallet()
  const [proposals, setProposals] = useState<SafeProposal[]>([])
  const [safeInfo, setSafeInfo] = useState<SafeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [isOwner, setIsOwner] = useState(false)

  const fetchData = async () => {
    try {
      const [proposalsRes, safeInfoRes] = await Promise.all([fetch("/api/safe/proposals"), fetch("/api/safe/info")])

      if (proposalsRes.ok) {
        const proposalsData = await proposalsRes.json()
        setProposals(proposalsData)
      }

      if (safeInfoRes.ok) {
        const safeInfoData = await safeInfoRes.json()
        setSafeInfo(safeInfoData)

        // Check if connected account is an owner
        if (account && safeInfoData.owners) {
          setIsOwner(safeInfoData.owners.includes(account))
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      setLastRefresh(Date.now())
      fetchData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [account])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
      case "approved":
        return "bg-green-500/10 text-green-500 border border-green-500/20"
      case "executed":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "executed":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleApprove = async (proposalId: string) => {
    if (!isConnected || !isOwner) {
      alert("You must be connected as a Safe owner to approve transactions")
      return
    }

    try {
      const response = await fetch(`/api/safe/proposals/${proposalId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account }),
      })

      if (response.ok) {
        await fetchData() // Refresh data
      } else {
        throw new Error("Failed to approve proposal")
      }
    } catch (error) {
      console.error("Failed to approve proposal:", error)
      alert("Failed to approve proposal. Please try again.")
    }
  }

  const handleExecute = async (proposalId: string) => {
    if (!isConnected || !isOwner) {
      alert("You must be connected as a Safe owner to execute transactions")
      return
    }

    try {
      const response = await fetch(`/api/safe/proposals/${proposalId}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account }),
      })

      if (response.ok) {
        await fetchData() // Refresh data
      } else {
        throw new Error("Failed to execute proposal")
      }
    } catch (error) {
      console.error("Failed to execute proposal:", error)
      alert("Failed to execute proposal. Please try again.")
    }
  }

  const getExplorerUrl = (address: string) => {
    switch (chainId) {
      case 1:
        return `https://etherscan.io/address/${address}`
      case 5:
        return `https://goerli.etherscan.io/address/${address}`
      case 11155111:
        return `https://sepolia.etherscan.io/address/${address}`
      case 137:
        return `https://polygonscan.com/address/${address}`
      default:
        return `https://etherscan.io/address/${address}`
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading SafeVault...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="h-5 w-5" />
            <span>SafeVault</span>
          </div>
          <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-sm font-medium">
              Transactions
            </Link>
            <Link href="/safe" className="text-sm font-medium text-primary">
              Safe
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
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">SafeVault Dashboard</h1>
                <p className="text-muted-foreground">
                  Multi-signature wallet management • Last updated: {new Date(lastRefresh).toLocaleTimeString()}
                </p>
              </div>
              {isConnected && isOwner && <CreateProposalDialog onProposalCreated={fetchData} />}
            </div>

            {!isConnected && (
              <div className="grid gap-6 md:grid-cols-2">
                <WalletConnection />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      Connection Required
                    </CardTitle>
                    <CardDescription>
                      Connect your wallet to interact with Safe contracts and manage proposals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• View real-time Safe information</li>
                      <li>• Create and approve transaction proposals</li>
                      <li>• Execute multi-signature transactions</li>
                      <li>• Monitor Safe owner activities</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {isConnected && !isOwner && safeInfo && (
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="font-medium">Not a Safe Owner</h3>
                      <p className="text-sm text-muted-foreground">
                        Your connected account ({account?.slice(0, 6)}...{account?.slice(-4)}) is not an owner of this
                        Safe. You can view information but cannot create or approve transactions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {safeInfo && (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Safe Address</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-mono break-all">{safeInfo.address}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 p-0 h-auto"
                      onClick={() => window.open(getExplorerUrl(safeInfo.address), "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Explorer
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Owners</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{safeInfo.owners.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {safeInfo.threshold} of {safeInfo.owners.length} required
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Number.parseFloat(safeInfo.balance).toFixed(4)} ETH</div>
                    <p className="text-xs text-muted-foreground">
                      ≈ ${(Number.parseFloat(safeInfo.balance) * 2800).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Nonce</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{safeInfo.nonce}</div>
                    <p className="text-xs text-muted-foreground">Next transaction</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="proposals" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="owners">Owners</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="proposals" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Proposals</CardTitle>
                    <CardDescription>Manage multi-signature transaction proposals and approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {proposals.length === 0 ? (
                        <div className="text-center py-8">
                          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
                          <p className="text-muted-foreground mb-4">
                            {isConnected && isOwner
                              ? "Create your first transaction proposal to get started"
                              : "Connect as a Safe owner to create transaction proposals"}
                          </p>
                          {isConnected && isOwner && <CreateProposalDialog onProposalCreated={fetchData} />}
                        </div>
                      ) : (
                        proposals.map((proposal) => (
                          <Card key={proposal.id} className="border-l-4 border-l-primary/20">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold">{proposal.title}</h3>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(proposal.status)}`}
                                    >
                                      {getStatusIcon(proposal.status)}
                                      <span className="ml-1 capitalize">{proposal.status}</span>
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">To:</span>
                                      <div className="font-mono text-xs break-all">{proposal.to}</div>
                                    </div>
                                    <div>
                                      <span className="font-medium">Value:</span>
                                      <div>{Number.parseFloat(proposal.value) / 1e18} ETH</div>
                                    </div>
                                    <div>
                                      <span className="font-medium">Confirmations:</span>
                                      <div>
                                        {proposal.confirmations} of {proposal.requiredConfirmations}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium">Created:</span>
                                      <div>{new Date(proposal.createdAt).toLocaleDateString()}</div>
                                    </div>
                                  </div>
                                  {proposal.safeTxHash && (
                                    <div className="mt-2">
                                      <span className="font-medium text-xs">Safe Tx Hash:</span>
                                      <div className="font-mono text-xs text-muted-foreground break-all">
                                        {proposal.safeTxHash}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {proposal.status === "pending" && isConnected && isOwner && (
                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(proposal.id)}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  {proposal.confirmations >= proposal.requiredConfirmations && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleExecute(proposal.id)}
                                      className="flex-1 sm:flex-none"
                                    >
                                      <ArrowRight className="h-4 w-4 mr-2" />
                                      Execute
                                    </Button>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="owners" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Safe Owners</CardTitle>
                    <CardDescription>Manage the owners of this multi-signature wallet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {safeInfo && (
                      <div className="space-y-4">
                        {safeInfo.owners.map((owner, index) => (
                          <div key={owner} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium">Owner {index + 1}</div>
                                {account && owner.toLowerCase() === account.toLowerCase() && (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-sm text-muted-foreground">{owner}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(getExplorerUrl(owner), "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            <strong>Threshold:</strong> {safeInfo.threshold} of {safeInfo.owners.length} owners required
                            to execute transactions
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Version:</strong> {safeInfo.version}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Safe Settings</CardTitle>
                    <CardDescription>Configure your multi-signature wallet settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Transaction Notifications</h3>
                            <p className="text-sm text-muted-foreground">Get notified when new proposals are created</p>
                          </div>
                          <Button variant="outline" size="sm" disabled={!isConnected || !isOwner}>
                            Configure
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Spending Limits</h3>
                            <p className="text-sm text-muted-foreground">
                              Set daily spending limits for certain assets
                            </p>
                          </div>
                          <Button variant="outline" size="sm" disabled={!isConnected || !isOwner}>
                            Configure
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Recovery Settings</h3>
                            <p className="text-sm text-muted-foreground">Configure wallet recovery options</p>
                          </div>
                          <Button variant="outline" size="sm" disabled={!isConnected || !isOwner}>
                            Configure
                          </Button>
                        </div>
                      </div>

                      {!isConnected && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Connect your wallet to access Safe settings and management features.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
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
            <span>SafeVault</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 SafeVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
