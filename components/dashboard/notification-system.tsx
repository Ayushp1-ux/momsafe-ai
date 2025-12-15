"use client"

import { useEffect, useState } from "react"
import { X, AlertCircle, Info, AlertTriangle, Activity, UserCheck } from "lucide-react"

interface Notification {
  id: string
  type: "vital" | "ai-anomaly" | "asha-visit" | "critical" | "info"
  title: string
  message: string
  timestamp: Date
}

const notificationIcons = {
  vital: Activity,
  "ai-anomaly": AlertTriangle,
  "asha-visit": UserCheck,
  critical: AlertCircle,
  info: Info,
}

const notificationColors = {
  vital: "border-blue-500 bg-blue-500/10",
  "ai-anomaly": "border-yellow-500 bg-yellow-500/10",
  "asha-visit": "border-green-500 bg-green-500/10",
  critical: "border-red-500 bg-red-500/10",
  info: "border-purple-500 bg-purple-500/10",
}

const notificationTextColors = {
  vital: "text-blue-400",
  "ai-anomaly": "text-yellow-400",
  "asha-visit": "text-green-400",
  critical: "text-red-400",
  info: "text-purple-400",
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { type, title, message } = event.detail

      const newNotification: Notification = {
        id: Date.now().toString() + Math.random(),
        type,
        title,
        message,
        timestamp: new Date(),
      }

      setNotifications((prev) => [newNotification, ...prev].slice(0, 5))

      // Play sound effect
      playNotificationSound(type)

      // Auto-dismiss after 7 seconds
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 7000)
    }

    window.addEventListener("medical-notification", handleNotification as EventListener)

    return () => {
      window.removeEventListener("medical-notification", handleNotification as EventListener)
    }
  }, [])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    timers.push(
      setTimeout(() => {
        const event = new CustomEvent("medical-notification", {
          detail: {
            type: "vital",
            title: "New vital reading",
            message: "BP 145/90 detected for Priya Sharma",
          },
        })
        window.dispatchEvent(event)
      }, 2000),
    )

    timers.push(
      setTimeout(() => {
        const event = new CustomEvent("medical-notification", {
          detail: {
            type: "ai-anomaly",
            title: "AI detected anomaly",
            message: "Irregular heart rate pattern in last 15 minutes",
          },
        })
        window.dispatchEvent(event)
      }, 5000),
    )

    timers.push(
      setTimeout(() => {
        const event = new CustomEvent("medical-notification", {
          detail: {
            type: "asha-visit",
            title: "ASHA worker logged visit",
            message: "Routine checkup completed at 10:30 AM",
          },
        })
        window.dispatchEvent(event)
      }, 8000),
    )

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const playNotificationSound = (type: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const frequencies: Record<string, number[]> = {
        vital: [800, 600],
        "ai-anomaly": [600, 400, 600],
        "asha-visit": [500, 700],
        critical: [900, 900, 900],
        info: [400],
      }

      const freq = frequencies[type] || [500]
      let time = audioContext.currentTime

      freq.forEach((f) => {
        oscillator.frequency.setValueAtTime(f, time)
        gainNode.gain.setValueAtTime(0.1, time)
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
        time += 0.15
      })

      oscillator.start(audioContext.currentTime)
      oscillator.stop(time)
    } catch (error) {
      // Silent fail if audio not supported
    }
  }

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type]
        return (
          <div
            key={notification.id}
            className={`animate-in slide-in-from-right-full duration-300 p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm ${notificationColors[notification.type]}`}
            style={{
              animation: "slideInRight 0.3s ease-out",
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`${notificationTextColors[notification.type]}`}>
                <Icon className="w-5 h-5 mt-0.5" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
                <p className="text-[10px] text-muted-foreground/60">{notification.timestamp.toLocaleTimeString()}</p>
              </div>
              <button
                className="h-6 w-6 shrink-0 rounded-md hover:bg-background/50 flex items-center justify-center transition-colors"
                onClick={() => removeNotification(notification.id)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
