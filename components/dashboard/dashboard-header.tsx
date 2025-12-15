"use client"

import type React from "react"

import { Activity, Bell, Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary animate-heartbeat" />
          <h1 className="text-xl font-bold text-foreground">MomSafe AI</h1>
          <Badge variant="secondary" className="ml-2">
            Demo Mode
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="transition-all hover:scale-105"
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === "en" ? "English" : "हिंदी"}
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={toggleNotifications}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-critical rounded-full animate-pulse" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {showNotifications && (
        <div className="fixed top-16 right-6 w-96 max-h-[500px] overflow-y-auto bg-card border border-border rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="divide-y divide-border">
            <NotificationItem
              icon={<Activity className="w-4 h-4 text-blue-400" />}
              title="New vital reading"
              message="BP 145/90 detected for Priya Sharma"
              time="2 min ago"
            />
            <NotificationItem
              icon={<Activity className="w-4 h-4 text-yellow-400" />}
              title="AI detected anomaly"
              message="Irregular heart rate pattern in last 15 minutes"
              time="5 min ago"
            />
            <NotificationItem
              icon={<Activity className="w-4 h-4 text-green-400" />}
              title="ASHA worker logged visit"
              message="Routine checkup completed at 10:30 AM"
              time="1 hour ago"
            />
            <NotificationItem
              icon={<Activity className="w-4 h-4 text-red-400" />}
              title="High-risk alert"
              message="Blood pressure elevated for extended period"
              time="3 hours ago"
            />
          </div>
          <div className="p-3 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setShowNotifications(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

function NotificationItem({
  icon,
  title,
  message,
  time,
}: {
  icon: React.ReactNode
  title: string
  message: string
  time: string
}) {
  return (
    <div className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-1">{message}</p>
          <p className="text-[10px] text-muted-foreground/60">{time}</p>
        </div>
      </div>
    </div>
  )
}
