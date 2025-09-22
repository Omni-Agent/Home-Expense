"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/kokonutui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit3, Trash2 } from "lucide-react"
import Link from "next/link"
import AddExpenseModal from "@/components/add-expense-modal"
import EditExpenseModal from "@/components/edit-expense-modal"
import { expenseStore, type Expense } from "@/lib/expense-store"

export default function SamarthPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totals, setTotals] = useState({
    totalExpenses: 0,
    shareAmount: 0,
    samarthTotal: 0,
    prachiTotal: 0,
    samarthBalance: 0,
    prachiBalance: 0,
  })
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const samarthExpenses = await expenseStore.getByPerson("Samarth")
        const totalsData = await expenseStore.getTotals()
        setExpenses(samarthExpenses)
        setTotals(totalsData)
      } catch (error) {
        console.error("Error loading data:", error)
        // Set default values to prevent toFixed errors
        setTotals({
          totalExpenses: 0,
          shareAmount: 0,
          samarthTotal: 0,
          prachiTotal: 0,
          samarthBalance: 0,
          prachiBalance: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const refreshData = async () => {
    try {
      const samarthExpenses = await expenseStore.getByPerson("Samarth")
      const totalsData = await expenseStore.getTotals()
      setExpenses(samarthExpenses)
      setTotals(totalsData)
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }

  const handleAddExpense = async (newExpense: {
    date: string
    name: string
    category: string
    amount: number
    paidBy: string
  }) => {
    await expenseStore.add(newExpense)
    await refreshData()
  }

  const handleDeleteExpense = async (id: string) => {
    await expenseStore.delete(id)
    await refreshData()
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setEditModalOpen(true)
  }

  const handleUpdateExpense = async (id: string, updates: Partial<Expense>) => {
    await expenseStore.update(id, updates)
    await refreshData()
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Samarth's Expenses</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Samarth's Expenses</h1>
          </div>
          <AddExpenseModal onAddExpense={handleAddExpense} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(totals.samarthTotal || 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Share Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(totals.shareAmount || 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${(totals.samarthBalance || 0) > 0 ? "text-green-600" : (totals.samarthBalance || 0) < 0 ? "text-red-600" : "text-gray-900 dark:text-white"}`}
              >
                {(totals.samarthBalance || 0) > 0 ? "+" : ""}${(totals.samarthBalance || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {(totals.samarthBalance || 0) > 0
                  ? "Prachi owes you"
                  : (totals.samarthBalance || 0) < 0
                    ? "You owe Prachi"
                    : "All settled"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{expense.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {expense.date} • {expense.category}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ${(expense.amount || 0).toFixed(2)}
                      </div>
                      <Badge variant={expense.status === "paid" ? "default" : "secondary"}>{expense.status}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditExpense(expense)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <EditExpenseModal
          expense={editingExpense}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onUpdateExpense={handleUpdateExpense}
        />
      </div>
    </Layout>
  )
}
