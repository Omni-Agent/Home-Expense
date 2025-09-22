"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Calendar, BarChart3, PieChart, LineChart } from "lucide-react"
import { expenseStore, type Expense } from "@/lib/expense-store"
import Layout from "@/components/kokonutui/layout"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts"

export default function ComparisonPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("2025")

  useEffect(() => {
    const updateData = async () => {
      const allExpenses = await expenseStore.getExpenses()
      setExpenses(allExpenses)
    }

    updateData()
    const unsubscribe = expenseStore.subscribe(() => {
      updateData()
    })
    return unsubscribe
  }, [])

  // Filter expenses based on selected month/year
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const expenseYear = expenseDate.getFullYear().toString()
    const expenseMonth = expenseDate.getMonth()

    if (selectedYear !== "all" && expenseYear !== selectedYear) return false
    if (selectedMonth !== "all" && expenseMonth !== Number.parseInt(selectedMonth)) return false

    return true
  })

  // Prepare data for charts
  const categoryData = filteredExpenses.reduce((acc: any, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const pieData = Object.entries(categoryData)
    .map(([category, amount]: [string, any]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value)

  // Monthly comparison data
  const monthlyData = expenses.reduce((acc: any, expense) => {
    const date = new Date(expense.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthName, Samarth: 0, Prachi: 0, total: 0 }
    }
    acc[monthKey][expense.paidBy] += expense.amount
    acc[monthKey].total += expense.amount
    return acc
  }, {})

  const lineData = Object.values(monthlyData).sort((a: any, b: any) => {
    const dateA = new Date(a.month)
    const dateB = new Date(b.month)
    return dateA.getTime() - dateB.getTime()
  })

  // Category comparison by person
  const categoryByPersonData = Object.keys(categoryData)
    .map((category) => {
      const samarthAmount = filteredExpenses
        .filter((e) => e.category === category && e.paidBy === "Samarth")
        .reduce((sum, e) => sum + e.amount, 0)
      const prachiAmount = filteredExpenses
        .filter((e) => e.category === category && e.paidBy === "Prachi")
        .reduce((sum, e) => sum + e.amount, 0)

      return {
        category,
        Samarth: samarthAmount,
        Prachi: prachiAmount,
        total: samarthAmount + prachiAmount,
      }
    })
    .sort((a, b) => b.total - a.total)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

  const totalFiltered = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const samarthFiltered = filteredExpenses.filter((e) => e.paidBy === "Samarth").reduce((sum, e) => sum + e.amount, 0)
  const prachiFiltered = filteredExpenses.filter((e) => e.paidBy === "Prachi").reduce((sum, e) => sum + e.amount, 0)

  const months = [
    { value: "all", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Comparison & History</h1>
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFiltered.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {selectedMonth === "all" ? "All time" : months.find((m) => m.value === selectedMonth)?.label}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Samarth's Share</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${samarthFiltered.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {totalFiltered > 0 ? ((samarthFiltered / totalFiltered) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prachi's Share</CardTitle>
              <TrendingDown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${prachiFiltered.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {totalFiltered > 0 ? ((prachiFiltered / totalFiltered) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
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
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Category Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryByPersonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
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

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Monthly Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="Samarth" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Prachi" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryByPersonData.map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total: ${item.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">Samarth: ${item.Samarth.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {item.total > 0 ? ((item.Samarth / item.total) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600">Prachi: ${item.Prachi.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {item.total > 0 ? ((item.Prachi / item.total) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
