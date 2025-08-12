"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface Notification {
  id: string
  type: "success" | "info" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  icon?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Food Claimed Successfully",
    message: "Your claim for 'Fresh Bakery Items' has been confirmed. The donor will contact you soon.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: "/find-food",
    actionLabel: "View Details",
    icon: "🎉",
  },
  {
    id: "2",
    type: "info",
    title: "New Food Available Nearby",
    message: "Green Leaf Cafe just posted fresh vegetables 0.8km away from you.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    actionUrl: "/find-food",
    actionLabel: "View Listing",
    icon: "🥬",
  },
  {
    id: "3",
    type: "warning",
    title: "Food Expiring Soon",
    message: "Your reported 'Surplus Vegetables' will expire in 2 hours. Consider updating the listing.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: true,
    actionUrl: "/report-food",
    actionLabel: "Update Listing",
    icon: "⏰",
  },
  {
    id: "4",
    type: "success",
    title: "Partner Application Approved",
    message: "Congratulations! Your partner application has been approved. Welcome to our network!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    actionUrl: "/partners",
    actionLabel: "View Dashboard",
    icon: "🤝",
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notifications when user logs in
    if (user) {
      setNotifications(mockNotifications)

      // Simulate real-time notifications
      const interval = setInterval(() => {
        // Randomly add new notifications
        if (Math.random() < 0.3) {
          // 30% chance every 30 seconds
          const newNotifications = [
            {
              type: "info" as const,
              title: "New Food Available",
              message: `${getRandomDonor()} just posted fresh food in your area!`,
              icon: "🍎",
            },
            {
              type: "success" as const,
              title: "Food Claimed",
              message: "Someone claimed your food donation. Great job reducing waste!",
              icon: "✅",
            },
            {
              type: "info" as const,
              title: "Community Update",
              message: "Your neighborhood has saved 50+ meals this week!",
              icon: "🏘️",
            },
          ]

          const randomNotification = newNotifications[Math.floor(Math.random() * newNotifications.length)]
          addNotification(randomNotification)
        }
      }, 30000) // Every 30 seconds

      return () => clearInterval(interval)
    } else {
      setNotifications([])
    }
  }, [user])

  const getRandomDonor = () => {
    const donors = ["Green Leaf Cafe", "FreshMart Grocery", "Community Kitchen", "Local Bakery", "Farm Fresh Co"]
    return donors[Math.floor(Math.random() * donors.length)]
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show browser notification if permission granted
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
