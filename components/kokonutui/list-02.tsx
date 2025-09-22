"use client"

import { cn } from "@/lib/utils"
import { Home, Zap, ShoppingCart, UtensilsCrossed, Car, Heart, Gamepad2, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { expenseStore } from "@/lib/expense-store"
import Link from "next/link"

interface ExpenseTransaction {
  id: string // Updated to string for UUID
  name: string
  amount: number
  paidBy: string
  category: string
  date: string
  status: "paid" | "pending"
}

interface List02Props {
  className?: string
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "housing":
      return Home
    case "utilities":
      return Zap
    case "food":
    case "groceries":
    case "take out food":
      return UtensilsCrossed
    case "transportation":
      return Car
    case "healthcare":
      return Heart
    case "entertainment":
      return Gamepad2
    case "household":
    case "household utilities":
      return ShoppingCart
    default:
      return ShoppingCart
  }
}

export default function List02({ className }: List02Props) {
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([])

  useEffect(() => {
    const updateTransactions = async () => {
      const allExpenses = await expenseStore.getExpenses()
      const recentTransactions = allExpenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
      setTransactions(recentTransactions)
    }

    updateTransactions()
    const unsubscribe = expenseStore.subscribe(() => {
      updateTransactions()
    })
    return unsubscribe
  }, [])

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Expenses
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
              ({transactions.length} transactions)
            </span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">This Month</span>
        </div>

        <div className="space-y-1">
          {transactions.map((transaction) => {
            const IconComponent = getCategoryIcon(transaction.category)
            return (
              <div
                key={transaction.id}
                className={cn(
                  "group flex items-center gap-3",
                  "p-2 rounded-lg",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                  "transition-all duration-200",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    "bg-zinc-100 dark:bg-zinc-800",
                    "border border-zinc-200 dark:border-zinc-700",
                  )}
                >
                  <IconComponent className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                </div>

                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{transaction.name}</h3>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      Paid by {transaction.paidBy} •{" "}
                      {new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pl-3">
                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      ${transaction.amount.toFixed(2)}
                    </span>
                    <div
                      className={cn("w-2 h-2 rounded-full", {
                        "bg-emerald-500": transaction.paidBy === "Samarth",
                        "bg-purple-500": transaction.paidBy === "Prachi",
                      })}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <Link href="/transactions">
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-gradient-to-r from-zinc-900 to-zinc-800",
              "dark:from-zinc-50 dark:to-zinc-200",
              "text-zinc-50 dark:text-zinc-900",
              "hover:from-zinc-800 hover:to-zinc-700",
              "dark:hover:from-zinc-200 dark:hover:to-zinc-300",
              "shadow-sm hover:shadow",
              "transform transition-all duration-200",
              "hover:-translate-y-0.5",
              "active:translate-y-0",
              "focus:outline-none focus:ring-2",
              "focus:ring-zinc-500 dark:focus:ring-zinc-400",
              "focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
            )}
          >
            <span>View All Expenses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  )
}
