"use client"

import { useState, useEffect } from "react"
import { expenseStore, type Expense } from "@/lib/expense-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { EditExpenseModal } from "@/components/edit-expense-modal"
import Layout from "@/components/kokonutui/layout"

export default function TransactionsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPerson, setSelectedPerson] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const categories = ["Housing", "Take out food", "Groceries", "Household utilities", "Transportation", "Entertainment"]

  useEffect(() => {
    const updateExpenses = async () => {
      const allExpenses = await expenseStore.getExpenses()
      setExpenses(allExpenses)
      setFilteredExpenses(allExpenses)
    }

    updateExpenses()
    const unsubscribe = expenseStore.subscribe(() => {
      updateExpenses()
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    let filtered = expenses

    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory)
    }

    if (selectedPerson !== "all") {
      filtered = filtered.filter((expense) => expense.paidBy === selectedPerson)
    }

    setFilteredExpenses(filtered)
  }, [expenses, searchTerm, selectedCategory, selectedPerson])

  const handleDeleteExpense = async (id: string) => {
    await expenseStore.deleteExpense(id)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Housing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Take out food": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Groceries: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Household utilities": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Transportation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Entertainment: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all your shared expenses</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>Find specific transactions quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All People</option>
                <option value="Samarth">Samarth</option>
                <option value="Prachi">Prachi</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({filteredExpenses.length})</CardTitle>
            <CardDescription>Complete list of shared expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No transactions found matching your criteria
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{expense.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(expense.date)}</p>
                      </div>
                      <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paid by {expense.paidBy}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingExpense(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <AddExpenseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

        {editingExpense && (
          <EditExpenseModal
            expense={editingExpense}
            isOpen={!!editingExpense}
            onClose={() => setEditingExpense(null)}
          />
        )}
      </div>
    </Layout>
  )
}
