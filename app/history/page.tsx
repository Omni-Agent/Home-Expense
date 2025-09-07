"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, Filter, Calendar, Edit3, Trash2, Plus } from "lucide-react"
import { notificationStore, type Notification } from "@/lib/notification-store"

export default function HistoryPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    const updateNotifications = () => {
      const allNotifications = notificationStore.getAll()
      setNotifications(allNotifications)
    }

    updateNotifications()
    const unsubscribe = notificationStore.subscribe(updateNotifications)

    return unsubscribe
  }, [])

  useEffect(() => {
    let filtered = [...notifications]

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((notification) => notification.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((notification) =>
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, filterType, sortOrder])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "expense_added":
        return <Plus className="h-4 w-4 text-green-600" />
      case "expense_updated":
        return <Edit3 className="h-4 w-4 text-blue-600" />
      case "expense_deleted":
        return <Trash2 className="h-4 w-4 text-red-600" />
      case "bill_updated":
        return <Calendar className="h-4 w-4 text-purple-600" />
      default:
        return <History className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationBadgeColor = (type: Notification["type"]) => {
    switch (type) {
      case "expense_added":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "expense_updated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "expense_deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "bill_updated":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      full: date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const getTypeDisplayName = (type: Notification["type"]) => {
    switch (type) {
      case "expense_added":
        return "Expense Added"
      case "expense_updated":
        return "Expense Updated"
      case "expense_deleted":
        return "Expense Deleted"
      case "bill_updated":
        return "Bill Updated"
      default:
        return "Unknown"
    }
  }

  const groupedNotifications = filteredNotifications.reduce(
    (groups: { [key: string]: Notification[] }, notification) => {
      const date = formatTimestamp(notification.timestamp).date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(notification)
      return groups
    },
    {},
  )

  const typeStats = notifications.reduce((stats: { [key: string]: number }, notification) => {
    stats[notification.type] = (stats[notification.type] || 0) + 1
    return stats
  }, {})

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Complete history of all changes and activities</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses Added</CardTitle>
              <Plus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{typeStats.expense_added || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses Updated</CardTitle>
              <Edit3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{typeStats.expense_updated || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills Updated</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{typeStats.bill_updated || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense_added">Expense Added</SelectItem>
                  <SelectItem value="expense_updated">Expense Updated</SelectItem>
                  <SelectItem value="expense_deleted">Expense Deleted</SelectItem>
                  <SelectItem value="bill_updated">Bill Updated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <div className="space-y-6">
          {Object.keys(groupedNotifications).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activities found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start adding expenses to see activity history here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dayNotifications.map((notification) => {
                      const timestamp = formatTimestamp(notification.timestamp)
                      return (
                        <div
                          key={notification.id}
                          className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timestamp.time}</p>
                              </div>
                              <Badge className={`text-xs ${getNotificationBadgeColor(notification.type)}`}>
                                {getTypeDisplayName(notification.type)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
