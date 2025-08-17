"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface CreateProposalDialogProps {
  onProposalCreated: () => void
}

export function CreateProposalDialog({ onProposalCreated }: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/safe/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          to: formData.get("to"),
          value: (Number.parseFloat(formData.get("value") as string) * 1e18).toString(),
          data: formData.get("data") || "0x",
        }),
      })

      if (response.ok) {
        setOpen(false)
        onProposalCreated()
      } else {
        throw new Error("Failed to create proposal")
      }
    } catch (error) {
      console.error("Error creating proposal:", error)
      alert("Failed to create proposal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Transaction Proposal</DialogTitle>
          <DialogDescription>
            Create a new multi-signature transaction proposal for Safe owners to review and approve.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g., Transfer funds to treasury" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the purpose of this transaction..."
                rows={3}
                required
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to">Recipient Address</Label>
              <Input id="to" name="to" placeholder="0x..." required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Amount (ETH)</Label>
              <Input id="value" name="value" type="number" step="0.000000001" min="0" placeholder="0.0" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data">Transaction Data (Optional)</Label>
              <Input id="data" name="data" placeholder="0x..." />
              <p className="text-xs text-muted-foreground">Leave empty for simple ETH transfers</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Proposal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
