"use client"

import { createClient } from "@/lib/supabase/client"
import { notificationStore } from "./notification-store"

export interface Expense {
  id: string
  date: string
  name: string
  category: string
  amount: number
  paidBy: string
  status: "paid" | "pending"
  created_at?: string
  updated_at?: string
}

class ExpenseStore {
  private listeners: (() => void)[] = []
  private supabase: ReturnType<typeof createClient> | null = null
  private initialized = false
  private tableExists = false

  private getSupabaseClient() {
    if (!this.supabase) {
      try {
        this.supabase = createClient()
        console.log("[v0] Supabase client created successfully")
      } catch (error) {
        console.error("[v0] Failed to create Supabase client:", error)
        throw error
      }
    }
    return this.supabase
  }

  async ensureInitialized() {
    if (this.initialized) return

    try {
      await this.checkTableExists()
      this.initialized = true

      if (this.tableExists) {
        await this.initializeDemoData()
      } else {
        console.log("[v0] Table doesn't exist. Please run the SQL script to create it.")
        this.initializeFallbackStorage()
      }
    } catch (error) {
      console.error("[v0] Error initializing expense store:", error)
      this.initializeFallbackStorage()
    }
  }

  private async checkTableExists() {
    try {
      const supabase = this.getSupabaseClient()
      // Simple check - try to select from the table
      const { error } = await supabase.from("expenses").select("id").limit(1)

      if (error) {
        if (error.message.includes("does not exist") || error.message.includes("schema cache")) {
          console.log("[v0] Expenses table does not exist")
          this.tableExists = false
        } else {
          console.error("[v0] Error checking table:", error)
          this.tableExists = false
        }
      } else {
        console.log("[v0] Expenses table exists")
        this.tableExists = true
      }
    } catch (error) {
      console.error("[v0] Error in checkTableExists:", error)
      this.tableExists = false
    }
  }

  private initializeFallbackStorage() {
    console.log("[v0] Using localStorage fallback since database table doesn't exist")

    // Initialize with demo data in localStorage if empty
    const existingData = localStorage.getItem("expenses")
    if (!existingData) {
      const demoExpenses = this.getDemoExpenses()
      localStorage.setItem("expenses", JSON.stringify(demoExpenses))
      console.log("[v0] Initialized localStorage with demo data")
    }
  }

  private getDemoExpenses(): Expense[] {
    return [
      // August 2025 entries
      {
        id: "1",
        date: "2025-08-01",
        name: "Rent",
        category: "Housing",
        amount: 1200,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "2",
        date: "2025-08-03",
        name: "Electricity Bill",
        category: "Housing",
        amount: 85,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "3",
        date: "2025-08-05",
        name: "WiFi Bill",
        category: "Housing",
        amount: 60,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "4",
        date: "2025-08-07",
        name: "Gas Bill",
        category: "Housing",
        amount: 45,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "5",
        date: "2025-08-10",
        name: "Groceries",
        category: "Groceries",
        amount: 120,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "6",
        date: "2025-08-12",
        name: "Pizza Night",
        category: "Take out food",
        amount: 35,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "7",
        date: "2025-08-15",
        name: "Cleaning Supplies",
        category: "Household utilities",
        amount: 25,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "8",
        date: "2025-08-18",
        name: "Uber Ride",
        category: "Transportation",
        amount: 18,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "9",
        date: "2025-08-20",
        name: "Movie Tickets",
        category: "Entertainment",
        amount: 28,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "10",
        date: "2025-08-22",
        name: "Groceries",
        category: "Groceries",
        amount: 95,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "11",
        date: "2025-08-25",
        name: "Chinese Takeout",
        category: "Take out food",
        amount: 42,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "12",
        date: "2025-08-28",
        name: "Laundry Detergent",
        category: "Household utilities",
        amount: 15,
        paidBy: "Prachi",
        status: "paid",
      },

      // September 2025 entries
      {
        id: "13",
        date: "2025-09-01",
        name: "Rent",
        category: "Housing",
        amount: 1200,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "14",
        date: "2025-09-03",
        name: "Electricity Bill",
        category: "Housing",
        amount: 92,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "15",
        date: "2025-09-05",
        name: "WiFi Bill",
        category: "Housing",
        amount: 60,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "16",
        date: "2025-09-08",
        name: "Gas Bill",
        category: "Housing",
        amount: 38,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "17",
        date: "2025-09-10",
        name: "Weekly Groceries",
        category: "Groceries",
        amount: 135,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "18",
        date: "2025-09-12",
        name: "Sushi Dinner",
        category: "Take out food",
        amount: 65,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "19",
        date: "2025-09-15",
        name: "Toilet Paper & Tissues",
        category: "Household utilities",
        amount: 22,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "20",
        date: "2025-09-17",
        name: "Gas Station",
        category: "Transportation",
        amount: 45,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "21",
        date: "2025-09-20",
        name: "Concert Tickets",
        category: "Entertainment",
        amount: 85,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "22",
        date: "2025-09-22",
        name: "Groceries",
        category: "Groceries",
        amount: 110,
        paidBy: "Samarth",
        status: "paid",
      },
      {
        id: "23",
        date: "2025-09-25",
        name: "Thai Food",
        category: "Take out food",
        amount: 38,
        paidBy: "Prachi",
        status: "paid",
      },
      {
        id: "24",
        date: "2025-09-28",
        name: "Dish Soap & Sponges",
        category: "Household utilities",
        amount: 12,
        paidBy: "Samarth",
        status: "paid",
      },
    ]
  }

  async initializeDemoData() {
    if (!this.tableExists) return

    try {
      const supabase = this.getSupabaseClient()
      const { data: existingExpenses } = await supabase.from("expenses").select("*").limit(1)

      // Only add demo data if table is empty
      if (!existingExpenses || existingExpenses.length === 0) {
        console.log("[v0] Initializing demo data...")
        const demoExpenses = [
          // August 2025 entries
          { date: "2025-08-01", name: "Rent", category: "Housing", amount: 1200, paid_by: "Samarth" },
          {
            date: "2025-08-03",
            name: "Electricity Bill",
            category: "Housing",
            amount: 85,
            paid_by: "Prachi",
          },
          { date: "2025-08-05", name: "WiFi Bill", category: "Housing", amount: 60, paid_by: "Samarth" },
          { date: "2025-08-07", name: "Gas Bill", category: "Housing", amount: 38, paid_by: "Prachi" },
          {
            date: "2025-08-10",
            name: "Groceries",
            category: "Groceries",
            amount: 120,
            paid_by: "Samarth",
          },
          {
            date: "2025-08-12",
            name: "Pizza Night",
            category: "Take out food",
            amount: 35,
            paid_by: "Prachi",
          },
          {
            date: "2025-08-15",
            name: "Cleaning Supplies",
            category: "Household utilities",
            amount: 25,
            paid_by: "Samarth",
          },
          {
            date: "2025-08-18",
            name: "Uber Ride",
            category: "Transportation",
            amount: 18,
            paid_by: "Prachi",
          },
          {
            date: "2025-08-20",
            name: "Movie Tickets",
            category: "Entertainment",
            amount: 28,
            paid_by: "Samarth",
          },
          { date: "2025-08-22", name: "Groceries", category: "Groceries", amount: 95, paid_by: "Prachi" },
          {
            date: "2025-08-25",
            name: "Chinese Takeout",
            category: "Take out food",
            amount: 42,
            paid_by: "Samarth",
          },
          {
            date: "2025-08-28",
            name: "Laundry Detergent",
            category: "Household utilities",
            amount: 15,
            paid_by: "Prachi",
          },

          // September 2025 entries
          { date: "2025-09-01", name: "Rent", category: "Housing", amount: 1200, paid_by: "Prachi" },
          {
            date: "2025-09-03",
            name: "Electricity Bill",
            category: "Housing",
            amount: 92,
            paid_by: "Samarth",
          },
          { date: "2025-09-05", name: "WiFi Bill", category: "Housing", amount: 60, paid_by: "Prachi" },
          { date: "2025-09-08", name: "Gas Bill", category: "Housing", amount: 38, paid_by: "Samarth" },
          {
            date: "2025-09-10",
            name: "Weekly Groceries",
            category: "Groceries",
            amount: 135,
            paid_by: "Prachi",
          },
          {
            date: "2025-09-12",
            name: "Sushi Dinner",
            category: "Take out food",
            amount: 65,
            paid_by: "Samarth",
          },
          {
            date: "2025-09-15",
            name: "Toilet Paper & Tissues",
            category: "Household utilities",
            amount: 22,
            paid_by: "Prachi",
          },
          { date: "2025-09-17", name: "Gas Station", category: "Transportation", amount: 45, paid_by: "Samarth" },
          {
            date: "2025-09-20",
            name: "Concert Tickets",
            category: "Entertainment",
            amount: 85,
            paid_by: "Prachi",
          },
          {
            date: "2025-09-22",
            name: "Groceries",
            category: "Groceries",
            amount: 110,
            paid_by: "Samarth",
          },
          {
            date: "2025-09-25",
            name: "Thai Food",
            category: "Take out food",
            amount: 38,
            paid_by: "Prachi",
          },
          {
            date: "2025-09-28",
            name: "Dish Soap & Sponges",
            category: "Household utilities",
            amount: 12,
            paid_by: "Samarth",
          },
        ]

        const { error } = await supabase.from("expenses").insert(demoExpenses)
        if (error) {
          console.error("[v0] Error inserting demo data:", error)
        } else {
          console.log("[v0] Demo data initialized successfully")
        }
      } else {
        console.log("[v0] Demo data already exists, skipping initialization")
      }
    } catch (error) {
      console.error("[v0] Demo data initialization failed:", error)
    }
  }

  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized()

    if (!this.tableExists) {
      const data = localStorage.getItem("expenses")
      if (data) {
        const expenses = JSON.parse(data) as Expense[]
        return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }
      return []
    }

    const supabase = this.getSupabaseClient()
    const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching expenses:", error)
      return []
    }

    return (
      data?.map((expense) => ({
        id: expense.id,
        date: expense.date,
        name: expense.name,
        category: expense.category,
        amount: Number.parseFloat(expense.amount),
        paidBy: expense.paid_by,
        status: expense.status || "paid",
        created_at: expense.created_at,
        updated_at: expense.updated_at,
      })) || []
    )
  }

  async getByPerson(person: string): Promise<Expense[]> {
    const expenses = await this.getExpenses()
    return expenses.filter((expense) => expense.paidBy === person)
  }

  async addExpense(expense: Omit<Expense, "id" | "status" | "created_at" | "updated_at">): Promise<Expense | null> {
    await this.ensureInitialized()

    if (!this.tableExists) {
      const data = localStorage.getItem("expenses")
      const expenses = data ? (JSON.parse(data) as Expense[]) : []

      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        status: "paid",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      expenses.push(newExpense)
      localStorage.setItem("expenses", JSON.stringify(expenses))

      notificationStore.add(
        `New expense "${newExpense.name}" ($${newExpense.amount.toFixed(2)}) added`,
        "expense_added",
      )
      this.notifyListeners()
      return newExpense
    }

    const supabase = this.getSupabaseClient()
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        paid_by: expense.paidBy,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding expense:", error)
      return null
    }

    const newExpense: Expense = {
      id: data.id,
      date: data.date,
      name: data.name,
      category: data.category,
      amount: Number.parseFloat(data.amount),
      paidBy: data.paid_by,
      status: data.status || "paid",
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    notificationStore.add(`New expense "${newExpense.name}" ($${newExpense.amount.toFixed(2)}) added`, "expense_added")
    this.notifyListeners()
    return newExpense
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense | null> {
    await this.ensureInitialized()

    if (!this.tableExists) {
      const data = localStorage.getItem("expenses")
      if (!data) return null

      const expenses = JSON.parse(data) as Expense[]
      const index = expenses.findIndex((e) => e.id === id)
      if (index === -1) return null

      expenses[index] = { ...expenses[index], ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem("expenses", JSON.stringify(expenses))

      notificationStore.add(
        `Expense "${expenses[index].name}" updated to $${expenses[index].amount.toFixed(2)}`,
        "expense_updated",
      )
      this.notifyListeners()
      return expenses[index]
    }

    const updateData: any = {}
    if (updates.name) updateData.name = updates.name
    if (updates.amount !== undefined) updateData.amount = updates.amount
    if (updates.category) updateData.category = updates.category
    if (updates.date) updateData.date = updates.date
    if (updates.paidBy) updateData.paid_by = updates.paidBy

    const supabase = this.getSupabaseClient()
    const { data, error } = await supabase.from("expenses").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating expense:", error)
      return null
    }

    const updatedExpense: Expense = {
      id: data.id,
      date: data.date,
      name: data.name,
      category: data.category,
      amount: Number.parseFloat(data.amount),
      paidBy: data.paid_by,
      status: data.status || "paid",
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    notificationStore.add(
      `Expense "${updatedExpense.name}" updated to $${updatedExpense.amount.toFixed(2)}`,
      "expense_updated",
    )
    this.notifyListeners()
    return updatedExpense
  }

  async deleteExpense(id: string): Promise<boolean> {
    await this.ensureInitialized()

    if (!this.tableExists) {
      const data = localStorage.getItem("expenses")
      if (!data) return false

      const expenses = JSON.parse(data) as Expense[]
      const index = expenses.findIndex((e) => e.id === id)
      if (index === -1) return false

      const deletedExpense = expenses[index]
      expenses.splice(index, 1)
      localStorage.setItem("expenses", JSON.stringify(expenses))

      notificationStore.add(
        `Expense "${deletedExpense.name}" ($${deletedExpense.amount.toFixed(2)}) deleted`,
        "expense_deleted",
      )
      this.notifyListeners()
      return true
    }

    const supabase = this.getSupabaseClient()
    const { error } = await supabase.from("expenses").delete().eq("id", id)

    if (error) {
      console.error("Error deleting expense:", error)
      return false
    }

    notificationStore.add(`Expense deleted successfully`, "expense_deleted")
    this.notifyListeners()
    return true
  }

  async getTotals() {
    console.log("[v0] Getting totals...")
    const expenses = await this.getExpenses()
    console.log("[v0] Expenses for totals calculation:", expenses.length)
    console.log("[v0] Sample expenses:", expenses.slice(0, 3))

    const samarthTotal = expenses
      .filter((expense) => expense.paidBy === "Samarth")
      .reduce((sum, expense) => sum + expense.amount, 0)

    const prachiTotal = expenses
      .filter((expense) => expense.paidBy === "Prachi")
      .reduce((sum, expense) => sum + expense.amount, 0)

    const userTotal = expenses
      .filter((expense) => expense.paidBy === "User")
      .reduce((sum, expense) => sum + expense.amount, 0)

    const totalExpenses = samarthTotal + prachiTotal + userTotal

    console.log("[v0] Totals calculation:", {
      samarthTotal,
      prachiTotal,
      userTotal,
      totalExpenses,
      shareAmount: totalExpenses / 2,
    })

    return {
      totalExpenses,
      shareAmount: totalExpenses / 2,
      samarthTotal,
      prachiTotal,
      userTotal,
      samarthBalance: samarthTotal - totalExpenses / 2,
      prachiBalance: prachiTotal - totalExpenses / 2,
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

  // Legacy method aliases for backward compatibility
  async add(expense: Omit<Expense, "id" | "status" | "created_at" | "updated_at">): Promise<Expense | null> {
    return this.addExpense(expense)
  }

  async update(id: string, updates: Partial<Expense>): Promise<Expense | null> {
    return this.updateExpense(id, updates)
  }

  async delete(id: string): Promise<boolean> {
    return this.deleteExpense(id)
  }
}

export const expenseStore = new ExpenseStore()
