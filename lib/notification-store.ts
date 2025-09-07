"use client"

export interface Notification {
  id: number
  message: string
  type: "expense_added" | "expense_updated" | "expense_deleted" | "bill_updated"
  timestamp: string
  read: boolean
}

class NotificationStore {
  private notifications: Notification[] = []
  private listeners: (() => void)[] = []
  private nextId = 1

  add(message: string, type: Notification["type"]) {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    }
    this.notifications.unshift(notification)
    this.notifyListeners()
  }

  markAsRead(id: number) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.notifyListeners()
  }

  getAll(): Notification[] {
    return [...this.notifications]
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
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

export const notificationStore = new NotificationStore()
