"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Expense } from "@/lib/expense-store"

interface EditExpenseModalProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateExpense: (id: number, updates: Partial<Expense>) => void
}

export default function EditExpenseModal({ expense, open, onOpenChange, onUpdateExpense }: EditExpenseModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    category: "",
    amount: "",
    paidBy: "",
    status: "paid" as "paid" | "pending",
  })

  const categories = [
    "Housing",
    "Utilities",
    "Food",
    "Transportation",
    "Healthcare",
    "Entertainment",
    "Household",
    "Other",
  ]

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date,
        name: expense.name,
        category: expense.category,
        amount: expense.amount.toString(),
        paidBy: expense.paidBy,
        status: expense.status,
      })
    }
  }, [expense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!expense || !formData.name || !formData.category || !formData.amount || !formData.paidBy) {
      return
    }

    onUpdateExpense(expense.id, {
      date: formData.date,
      name: formData.name,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      paidBy: formData.paidBy,
      status: formData.status,
    })

    onOpenChange(false)
  }

  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Expense Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Rent, Groceries, Utilities"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount ($)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-paidBy">Paid By</Label>
            <Select value={formData.paidBy} onValueChange={(value) => setFormData({ ...formData, paidBy: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Samarth">Samarth</SelectItem>
                <SelectItem value="Prachi">Prachi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "paid" | "pending") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Expense</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
