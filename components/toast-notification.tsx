"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "@/lib/notification-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export function ToastNotifications() {
  const { notifications } = useNotifications()
  const [visibleToasts, setVisibleToasts] = useState<string[]>([])

  useEffect(() => {
    // Show new notifications as toasts
    const newNotifications = notifications.filter((n) => !n.read && !visibleToasts.includes(n.id)).slice(0, 3) // Limit to 3 toasts at once

    if (newNotifications.length > 0) {
      const newIds = newNotifications.map((n) => n.id)
      setVisibleToasts((prev) => [...prev, ...newIds])

      // Auto-hide toasts after 5 seconds
      newIds.forEach((id) => {
        setTimeout(() => {
          setVisibleToasts((prev) => prev.filter((toastId) => toastId !== id))
        }, 5000)
      })
    }
  }, [notifications, visibleToasts])

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getToastColors = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-200 bg-emerald-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const hideToast = (id: string) => {
    setVisibleToasts((prev) => prev.filter((toastId) => toastId !== id))
  }

  const visibleNotifications = notifications.filter((n) => visibleToasts.includes(n.id))

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2">
      {visibleNotifications.map((notification, index) => (
        <Card
          key={notification.id}
          className={`w-80 shadow-lg border-2 ${getToastColors(notification.type)} animate-in slide-in-from-right duration-300`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getToastIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => hideToast(notification.id)}
                className="h-6 w-6 p-0 hover:bg-background/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
