"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Calendar, LucidePieChart, BarChart3 } from "lucide-react"
import { expenseStore, type Expense } from "@/lib/expense-store"
import Layout from "@/components/kokonutui/layout"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totals, setTotals] = useState({
    totalExpenses: 0,
    shareAmount: 0,
    samarthTotal: 0,
    prachiTotal: 0,
    userTotal: 0, // Added userTotal for new user category
    samarthBalance: 0,
    prachiBalance: 0,
  })

  useEffect(() => {
    const updateData = async () => {
      const allExpenses = await expenseStore.getExpenses()
      const totalsData = await expenseStore.getTotals()
      setExpenses(allExpenses)
      setTotals(totalsData)
    }

    updateData()
    const unsubscribe = expenseStore.subscribe(() => {
      updateData()
    })
    return unsubscribe
  }, [])

  const categoryData = expenses.reduce((acc: any, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const pieData = Object.entries(categoryData).map(([category, amount]: [string, any]) => ({
    name: category,
    value: amount,
  }))

  const monthlyData = expenses.reduce((acc: any, expense) => {
    const month = new Date(expense.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    if (!acc[month]) {
      acc[month] = { month, Samarth: 0, Prachi: 0 }
    }
    acc[month][expense.paidBy] += expense.amount
    return acc
  }, {})

  const barData = Object.values(monthlyData).sort(
    (a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime(),
  )

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals.totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Combined spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Samarth's Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totals.samarthTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {totals.totalExpenses > 0 ? ((totals.samarthTotal / totals.totalExpenses) * 100).toFixed(1) : 0}% of
                total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prachi's Total</CardTitle>
              <TrendingDown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${totals.prachiTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {totals.totalExpenses > 0 ? ((totals.prachiTotal / totals.totalExpenses) * 100).toFixed(1) : 0}% of
                total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Balance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${Math.abs(totals.samarthBalance) < 50 ? "text-green-600" : "text-orange-600"}`}
              >
                ${Math.abs(totals.samarthBalance).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.abs(totals.samarthBalance) < 50 ? "Nearly settled" : "Needs settlement"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucidePieChart className="h-5 w-5" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Spending Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, ""]} />
                    <Legend />
                    <Bar dataKey="Samarth" fill="#10B981" />
                    <Bar dataKey="Prachi" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${expense.paidBy === "Samarth" ? "bg-green-500" : "bg-purple-500"}`}
                      />
                      <div>
                        <p className="font-medium text-sm">{expense.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.date} • {expense.paidBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {expense.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryData)
                  .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                  .map(([category, amount]: [string, any], index) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-sm">{category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {totals.totalExpenses > 0 ? ((amount / totals.totalExpenses) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
