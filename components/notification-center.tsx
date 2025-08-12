"use client"

import { useState, useEffect } from "react"
import { useNotifications } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bell, X, Check, CheckCheck, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setHasPermission(true)
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          setHasPermission(permission === "granted")
        })
      }
    }
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "warning":
        return "⚠️"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-emerald-500 bg-emerald-50"
      case "error":
        return "border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-amber-500 bg-amber-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative p-2 hover:bg-primary/10">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Notification Panel */}
          <Card className="absolute right-0 top-full mt-3 w-96 max-h-96 overflow-hidden z-[55] shadow-xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {notifications.length > 0 && (
                <div className="flex items-center justify-between">
                  <CardDescription>
                    {unreadCount} unread of {notifications.length} total
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-sm">We'll notify you when something happens!</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-4 border-l-4 transition-colors hover:bg-muted/50 ${
                          !notification.read ? getNotificationColor(notification.type) : "border-l-gray-300 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg flex-shrink-0 mt-0.5">
                            {notification.icon || getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`font-medium text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6 p-0 hover:bg-primary/20"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeNotification(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p
                              className={`text-sm mt-1 ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {notification.message}
                            </p>
                            {notification.actionUrl && (
                              <Link href={notification.actionUrl} onClick={() => setIsOpen(false)}>
                                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs bg-transparent">
                                  {notification.actionLabel || "View"}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
