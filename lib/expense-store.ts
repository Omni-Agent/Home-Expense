"use client"

import { notificationStore } from "./notification-store"

export interface Expense {
  id: number
  date: string
  name: string
  category: string
  amount: number
  paidBy: string
  status: "paid" | "pending"
}

const expenses: Expense[] = [
  // August 2025 entries
  { id: 1, date: "2025-08-01", name: "Rent", category: "Housing", amount: 1200, paidBy: "Samarth", status: "paid" },
  {
    id: 2,
    date: "2025-08-03",
    name: "Electricity Bill",
    category: "Housing",
    amount: 85,
    paidBy: "Prachi",
    status: "paid",
  },
  { id: 3, date: "2025-08-05", name: "WiFi Bill", category: "Housing", amount: 60, paidBy: "Samarth", status: "paid" },
  { id: 4, date: "2025-08-07", name: "Gas Bill", category: "Housing", amount: 45, paidBy: "Prachi", status: "paid" },
  {
    id: 5,
    date: "2025-08-10",
    name: "Groceries",
    category: "Groceries",
    amount: 120,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 6,
    date: "2025-08-12",
    name: "Pizza Night",
    category: "Take out food",
    amount: 35,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 7,
    date: "2025-08-15",
    name: "Cleaning Supplies",
    category: "Household utilities",
    amount: 25,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 8,
    date: "2025-08-18",
    name: "Uber Ride",
    category: "Transportation",
    amount: 18,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 9,
    date: "2025-08-20",
    name: "Movie Tickets",
    category: "Entertainment",
    amount: 28,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 10,
    date: "2025-08-22",
    name: "Groceries",
    category: "Groceries",
    amount: 95,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 11,
    date: "2025-08-25",
    name: "Chinese Takeout",
    category: "Take out food",
    amount: 42,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 12,
    date: "2025-08-28",
    name: "Laundry Detergent",
    category: "Household utilities",
    amount: 15,
    paidBy: "Prachi",
    status: "paid",
  },

  // September 2025 entries
  { id: 13, date: "2025-09-01", name: "Rent", category: "Housing", amount: 1200, paidBy: "Prachi", status: "paid" },
  {
    id: 14,
    date: "2025-09-03",
    name: "Electricity Bill",
    category: "Housing",
    amount: 92,
    paidBy: "Samarth",
    status: "paid",
  },
  { id: 15, date: "2025-09-05", name: "WiFi Bill", category: "Housing", amount: 60, paidBy: "Prachi", status: "paid" },
  { id: 16, date: "2025-09-08", name: "Gas Bill", category: "Housing", amount: 38, paidBy: "Samarth", status: "paid" },
  {
    id: 17,
    date: "2025-09-10",
    name: "Weekly Groceries",
    category: "Groceries",
    amount: 135,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 18,
    date: "2025-09-12",
    name: "Sushi Dinner",
    category: "Take out food",
    amount: 65,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 19,
    date: "2025-09-15",
    name: "Toilet Paper & Tissues",
    category: "Household utilities",
    amount: 22,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 20,
    date: "2025-09-17",
    name: "Gas Station",
    category: "Transportation",
    amount: 45,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 21,
    date: "2025-09-20",
    name: "Concert Tickets",
    category: "Entertainment",
    amount: 85,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 22,
    date: "2025-09-22",
    name: "Groceries",
    category: "Groceries",
    amount: 110,
    paidBy: "Samarth",
    status: "paid",
  },
  {
    id: 23,
    date: "2025-09-25",
    name: "Thai Food",
    category: "Take out food",
    amount: 38,
    paidBy: "Prachi",
    status: "paid",
  },
  {
    id: 24,
    date: "2025-09-28",
    name: "Dish Soap & Sponges",
    category: "Household utilities",
    amount: 12,
    paidBy: "Samarth",
    status: "paid",
  },
]

let nextId = 25

class ExpenseStore {
  private listeners: (() => void)[] = []

  getExpenses(): Expense[] {
    return [...expenses]
  }

  getByPerson(person: string): Expense[] {
    return expenses.filter((expense) => expense.paidBy === person)
  }

  addExpense(expense: Omit<Expense, "id" | "status">): Expense {
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
    this.notifyListeners()
    return newExpense
  }

  updateExpense(id: number, updates: Partial<Expense>): Expense | null {
    const index = expenses.findIndex((expense) => expense.id === id)
    if (index === -1) return null

    const oldExpense = { ...expenses[index] }
    expenses[index] = { ...expenses[index], ...updates }

    notificationStore.add(
      `Expense "${expenses[index].name}" updated from $${oldExpense.amount.toFixed(2)} to $${expenses[index].amount.toFixed(2)}`,
      "expense_updated",
    )
    this.notifyListeners()
    return expenses[index]
  }

  deleteExpense(id: number): boolean {
    const index = expenses.findIndex((expense) => expense.id === id)
    if (index === -1) return false

    const deletedExpense = expenses[index]
    expenses.splice(index, 1)

    notificationStore.add(
      `Expense "${deletedExpense.name}" ($${deletedExpense.amount.toFixed(2)}) deleted`,
      "expense_deleted",
    )
    this.notifyListeners()
    return true
  }

  getTotals() {
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
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }
}

export const expenseStore = new ExpenseStore()
