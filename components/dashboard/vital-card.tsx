"use client"

import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface VitalCardProps {
  icon: LucideIcon
  label: string
  value: string
  status: "normal" | "warning" | "critical"
  trend: string
  animated?: boolean
}

export function VitalCard({ icon: Icon, label, value, status, trend, animated }: VitalCardProps) {
  const statusColor = {
    normal: "text-success",
    warning: "text-warning",
    critical: "text-critical",
  }[status]

  return (
    <Card className="p-6 glassmorphism hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Icon className={cn("w-6 h-6", statusColor, animated && "animate-heartbeat")} />
          <div className={cn("w-2 h-2 rounded-full", statusColor.replace("text", "bg"))} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              trend.startsWith("+")
                ? "text-success"
                : trend.startsWith("-")
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            {trend}
          </span>
          <span className="text-muted-foreground">24h trend</span>
        </div>
      </div>
    </Card>
  )
}
