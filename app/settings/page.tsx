import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BellRing, Globe, Mail, Moon, Shield, Sun, User } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function Settings() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MobileNav />
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-sm font-medium">
              Transactions
            </Link>
            <Link href="/security" className="text-sm font-medium">
              Security
            </Link>
            <Link href="/settings" className="text-sm font-medium text-primary">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
            </div>
            <Tabs defaultValue="profile" className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full min-w-[400px] grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="api">API Keys</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" defaultValue="John Doe" className="h-12" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        defaultValue="john@example.com"
                        className="h-12"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        defaultValue="+1 (555) 123-4567"
                        className="h-12"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc-8">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-12">UTC-12:00</SelectItem>
                          <SelectItem value="utc-11">UTC-11:00</SelectItem>
                          <SelectItem value="utc-10">UTC-10:00</SelectItem>
                          <SelectItem value="utc-9">UTC-09:00</SelectItem>
                          <SelectItem value="utc-8">UTC-08:00 (Pacific Time)</SelectItem>
                          <SelectItem value="utc-7">UTC-07:00 (Mountain Time)</SelectItem>
                          <SelectItem value="utc-6">UTC-06:00 (Central Time)</SelectItem>
                          <SelectItem value="utc-5">UTC-05:00 (Eastern Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Cancel
                    </Button>
                    <Button className="w-full sm:w-auto">Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="preferences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your wallet experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-4">
                        <Sun className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium leading-none">Theme</p>
                          <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4" />
                        <Switch />
                        <Moon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-4">
                        <Globe className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium leading-none">Language</p>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                      </div>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-4">
                        <User className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium leading-none">Currency Display</p>
                          <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
                        </div>
                      </div>
                      <Select defaultValue="usd">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                          <SelectItem value="cny">CNY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Reset to Defaults
                    </Button>
                    <Button className="w-full sm:w-auto">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-4">
                        <BellRing className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium leading-none">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium leading-none">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Notification Types</h3>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="transactions" className="flex items-center gap-2">
                            <span>Transactions</span>
                          </Label>
                          <Switch id="transactions" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="security" className="flex items-center gap-2">
                            <span>Security Alerts</span>
                          </Label>
                          <Switch id="security" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="price" className="flex items-center gap-2">
                            <span>Price Alerts</span>
                          </Label>
                          <Switch id="price" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="news" className="flex items-center gap-2">
                            <span>News & Updates</span>
                          </Label>
                          <Switch id="news" checked={false} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Reset to Defaults
                    </Button>
                    <Button className="w-full sm:w-auto">Save Notification Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="api" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for third-party integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Read-Only API Key</h3>
                          <p className="text-sm text-muted-foreground">
                            For applications that only need to read your wallet data
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Generate Key
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Trading API Key</h3>
                          <p className="text-sm text-muted-foreground">
                            For applications that need to execute trades on your behalf
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Generate Key
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Active API Keys</h3>
                            <p className="text-sm text-muted-foreground">Manage your existing API keys</p>
                          </div>
                        </div>
                        <div className="rounded-md bg-muted p-4">
                          <p className="text-center text-sm text-muted-foreground">No active API keys found</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      API keys provide access to your wallet. Never share your API keys with anyone.
                    </p>
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
