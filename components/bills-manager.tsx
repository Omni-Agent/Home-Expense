"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Calendar,
  type LucideIcon,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  Home,
  Zap,
  Wifi,
  ShoppingCart,
  Edit3,
} from "lucide-react"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { notificationStore } from "@/lib/notification-store"

interface BillItem {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  iconStyle: string
  dueDate: string
  amount: number
  status: "pending" | "due-soon" | "paid"
  daysUntilDue?: number
}

interface BillsManagerProps {
  className?: string
}

const iconStyles = {
  housing: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  utilities: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  food: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
}

const statusConfig = {
  pending: {
    icon: Timer,
    class: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800",
  },
  "due-soon": {
    icon: AlertCircle,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  paid: {
    icon: CheckCircle2,
    class: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
}

export default function BillsManager({ className }: BillsManagerProps) {
  const [bills, setBills] = useState<BillItem[]>([
    {
      id: "1",
      title: "Rent Payment",
      subtitle: "Monthly apartment rent",
      icon: Home,
      iconStyle: "housing",
      dueDate: "Jan 1, 2025",
      amount: 1845.0,
      status: "due-soon",
      daysUntilDue: 3,
    },
    {
      id: "2",
      title: "Electricity + Gas",
      subtitle: "Monthly utility bill",
      icon: Zap,
      iconStyle: "utilities",
      dueDate: "Jan 5, 2025",
      amount: 100.0,
      status: "pending",
      daysUntilDue: 7,
    },
    {
      id: "3",
      title: "Wi-Fi Internet",
      subtitle: "Monthly internet service",
      icon: Wifi,
      iconStyle: "utilities",
      dueDate: "Jan 3, 2025",
      amount: 30.0,
      status: "pending",
      daysUntilDue: 5,
    },
    {
      id: "4",
      title: "Groceries Budget",
      subtitle: "Weekly grocery shopping",
      icon: ShoppingCart,
      iconStyle: "food",
      dueDate: "Weekly",
      amount: 100.0,
      status: "pending",
    },
  ])

  const [editingBill, setEditingBill] = useState<BillItem | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editAmount, setEditAmount] = useState("")

  const handleMarkAsPaid = (billId: string) => {
    const bill = bills.find((b) => b.id === billId)
    setBills(bills.map((bill) => (bill.id === billId ? { ...bill, status: "paid" as const } : bill)))

    if (bill) {
      notificationStore.add(`Bill "${bill.title}" ($${bill.amount.toFixed(2)}) marked as paid`, "bill_updated")
    }
  }

  const handleEditBill = (bill: BillItem) => {
    setEditingBill(bill)
    setEditAmount(bill.amount.toString())
    setEditModalOpen(true)
  }

  const handleUpdateAmount = () => {
    if (editingBill && editAmount) {
      const oldAmount = editingBill.amount
      const newAmount = Number.parseFloat(editAmount)

      setBills(bills.map((bill) => (bill.id === editingBill.id ? { ...bill, amount: newAmount } : bill)))

      notificationStore.add(
        `Bill "${editingBill.title}" amount updated from $${oldAmount.toFixed(2)} to $${newAmount.toFixed(2)}`,
        "bill_updated",
      )

      setEditModalOpen(false)
      setEditingBill(null)
      setEditAmount("")
    }
  }

  return (
    <>
      <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
        <div className="flex gap-3 min-w-full p-1">
          {bills.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-col",
                "w-[280px] shrink-0",
                "bg-white dark:bg-zinc-900/70",
                "rounded-xl",
                "border border-zinc-100 dark:border-zinc-800",
                "hover:border-zinc-200 dark:hover:border-zinc-700",
                "transition-all duration-200",
                "shadow-sm backdrop-blur-xl",
              )}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2 rounded-lg", iconStyles[item.iconStyle as keyof typeof iconStyles])}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                      statusConfig[item.status].bg,
                      statusConfig[item.status].class,
                    )}
                  >
                    {React.createElement(statusConfig[item.status].icon, { className: "w-3.5 h-3.5" })}
                    {item.status === "due-soon"
                      ? "Due Soon"
                      : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{item.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.subtitle}</p>
                </div>

                {item.daysUntilDue && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Due in</span>
                      <span
                        className={cn("font-medium", {
                          "text-amber-600 dark:text-amber-400": item.daysUntilDue <= 5,
                          "text-zinc-900 dark:text-zinc-100": item.daysUntilDue > 5,
                        })}
                      >
                        {item.daysUntilDue} days
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", {
                          "bg-amber-500": item.daysUntilDue <= 5,
                          "bg-zinc-900 dark:bg-zinc-100": item.daysUntilDue > 5,
                        })}
                        style={{ width: `${Math.max(10, 100 - item.daysUntilDue * 10)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">amount</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditBill(item)} className="h-6 w-6 p-0">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  <span>Due: {item.dueDate}</span>
                </div>
              </div>

              <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => handleMarkAsPaid(item.id)}
                  disabled={item.status === "paid"}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "py-2.5 px-3",
                    "text-xs font-medium",
                    "transition-colors duration-200",
                    item.status === "paid"
                      ? "text-emerald-600 dark:text-emerald-400 cursor-not-allowed"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                  )}
                >
                  {item.status === "paid" ? "Paid" : "Mark as Paid"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Bill Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAmount}>Update Amount</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
