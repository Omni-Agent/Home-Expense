"use client"

import { notificationStore } from "./notification-store"

interface Expense {
  id: number
  date: string
  name: string
  category: string
  amount: number
  paidBy: string
  status: "paid" | "pending"
}

const expenses: Expense[] = [
  { id: 1, date: "2024-01-15", name: "Rent", category: "Housing", amount: 1200, paidBy: "Samarth", status: "paid" },
  { id: 2, date: "2024-01-12", name: "Gas Bill", category: "Utilities", amount: 45, paidBy: "Prachi", status: "paid" },
  {
    id: 3,
    date: "2024-01-10",
    name: "Electricity Bill",
    category: "Utilities",
    amount: 85,
    paidBy: "Samarth",
    status: "paid",
  },
  { id: 4, date: "2024-01-09", name: "Groceries", category: "Food", amount: 95, paidBy: "Prachi", status: "paid" },
  { id: 5, date: "2024-01-08", name: "Groceries", category: "Food", amount: 120, paidBy: "Samarth", status: "paid" },
  {
    id: 6,
    date: "2024-01-07",
    name: "Water Bill",
    category: "Utilities",
    amount: 35,
    paidBy: "Prachi",
    status: "paid",
  },
  { id: 7, date: "2024-01-05", name: "Internet", category: "Utilities", amount: 60, paidBy: "Samarth", status: "paid" },
  {
    id: 8,
    date: "2024-01-03",
    name: "Cleaning Supplies",
    category: "Household",
    amount: 25,
    paidBy: "Prachi",
    status: "paid",
  },
]

let nextId = 9

export const expenseStore = {
  getAll: (): Expense[] => [...expenses],

  getByPerson: (person: string): Expense[] => expenses.filter((expense) => expense.paidBy === person),

  add: (expense: Omit<Expense, "id" | "status">): Expense => {
    const newExpense: Expense = {
      ...expense,
      id: nextId++,
      status: "paid",
    }
    expenses.push(newExpense)
    notificationStore.add(
      `New expense "${newExpense.name}" ($${newExpense.amount.toFixed(2)}) added by ${newExpense.paidBy}`,
      "expense_added",
    )
    return newExpense
  },

  update: (id: number, updates: Partial<Expense>): Expense | null => {
    const index = expenses.findIndex((expense) => expense.id === id)
    if (index === -1) return null

    const oldExpense = { ...expenses[index] }
    expenses[index] = { ...expenses[index], ...updates }

    notificationStore.add(
      `Expense "${expenses[index].name}" updated from $${oldExpense.amount.toFixed(2)} to $${expenses[index].amount.toFixed(2)}`,
      "expense_updated",
    )
    return expenses[index]
  },

  delete: (id: number): boolean => {
    const index = expenses.findIndex((expense) => expense.id === id)
    if (index === -1) return false

    const deletedExpense = expenses[index]
    expenses.splice(index, 1)

    notificationStore.add(
      `Expense "${deletedExpense.name}" ($${deletedExpense.amount.toFixed(2)}) deleted`,
      "expense_deleted",
    )
    return true
  },

  getTotals: () => {
    const samarthTotal = expenses
      .filter((expense) => expense.paidBy === "Samarth")
      .reduce((sum, expense) => sum + expense.amount, 0)

    const prachiTotal = expenses
      .filter((expense) => expense.paidBy === "Prachi")
      .reduce((sum, expense) => sum + expense.amount, 0)

    const totalExpenses = samarthTotal + prachiTotal
    const shareAmount = totalExpenses / 2

    return {
      totalExpenses,
      shareAmount,
      samarthTotal,
      prachiTotal,
      samarthBalance: samarthTotal - shareAmount,
      prachiBalance: prachiTotal - shareAmount,
    }
  },
}

export type { Expense }
