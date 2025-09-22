"use client"

import { cn } from "@/lib/utils"
import { Users, CheckCircle, Clock, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { expenseStore } from "@/lib/expense-store"

interface ExpenseShare {
  id: string
  person: string
  share: string
  paid: boolean
  type: "samarth" | "prachi"
}

interface List01Props {
  className?: string
}

export default function List01({ className }: List01Props) {
  const [totals, setTotals] = useState({
    totalExpenses: 0,
    shareAmount: 0,
    samarthTotal: 0,
    prachiTotal: 0,
    userTotal: 0,
    samarthBalance: 0,
    prachiBalance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateTotals = async () => {
      try {
        setIsLoading(true)
        const totalsData = await expenseStore.getTotals()
        setTotals(totalsData)
      } catch (error) {
        console.error("Error fetching totals:", error)
        // Keep default values if error occurs
      } finally {
        setIsLoading(false)
      }
    }

    updateTotals()
    const unsubscribe = expenseStore.subscribe(() => {
      updateTotals()
    })
    return unsubscribe
  }, [])

  const shares: ExpenseShare[] = [
    {
      id: "1",
      person: "Samarth",
      share: `$${(totals?.shareAmount || 0).toFixed(2)}`,
      paid: (totals?.samarthBalance || 0) >= 0,
      type: "samarth",
    },
    {
      id: "2",
      person: "Prachi",
      share: `$${(totals?.shareAmount || 0).toFixed(2)}`,
      paid: (totals?.prachiBalance || 0) >= 0,
      type: "prachi",
    },
  ]

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full max-w-xl mx-auto",
          "bg-white dark:bg-zinc-900/70",
          "border border-zinc-100 dark:border-zinc-800",
          "rounded-xl shadow-sm backdrop-blur-xl",
          "animate-pulse",
          className,
        )}
      >
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
        <div className="p-3">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

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
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Shared Expenses (Monthly)</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          ${(totals?.totalExpenses || 0).toFixed(2)}
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          Each person's share: ${(totals?.shareAmount || 0).toFixed(2)}
        </p>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Payment Status</h2>
        </div>

        <div className="space-y-1">
          {shares.map((share) => (
            <div
              key={share.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg", {
                    "bg-emerald-100 dark:bg-emerald-900/30": share.type === "samarth",
                    "bg-purple-100 dark:bg-purple-900/30": share.type === "prachi",
                  })}
                >
                  <User
                    className={cn("w-3.5 h-3.5", {
                      "text-emerald-600 dark:text-emerald-400": share.type === "samarth",
                      "text-purple-600 dark:text-purple-400": share.type === "prachi",
                    })}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{share.person}'s Share</h3>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    {share.type === "samarth"
                      ? (totals?.samarthBalance || 0) >= 0
                        ? "Overpaid"
                        : "Owes money"
                      : (totals?.prachiBalance || 0) >= 0
                        ? "Overpaid"
                        : "Owes money"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{share.share}</span>
                {share.paid ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/samarth">
            <button
              type="button"
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-zinc-900 dark:bg-zinc-50",
                "text-zinc-50 dark:text-zinc-900",
                "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>View Samarth</span>
            </button>
          </Link>
          <Link href="/prachi">
            <button
              type="button"
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-zinc-900 dark:bg-zinc-50",
                "text-zinc-50 dark:text-zinc-900",
                "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>View Prachi</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
