"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, XCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "Blood Pressure",
    severity: "warning",
    message: "BP slightly elevated: 138/88",
    recommendation: "Monitor closely, recheck in 2 hours",
    time: "10 min ago",
    status: "pending",
  },
  {
    id: 2,
    type: "Heart Rate",
    severity: "info",
    message: "Normal heart rate pattern",
    recommendation: "Continue routine monitoring",
    time: "1 hour ago",
    status: "acknowledged",
  },
  {
    id: 3,
    type: "Movement",
    severity: "critical",
    message: "Reduced fetal movement detected",
    recommendation: "Immediate ultrasound recommended",
    time: "3 hours ago",
    status: "acknowledged",
  },
]

export function AlertsTimeline() {
  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Alerts & Notifications</h3>
          <Button variant="ghost" size="sm">
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    alert.severity === "critical"
                      ? "bg-critical/20"
                      : alert.severity === "warning"
                        ? "bg-warning/20"
                        : "bg-primary/20"
                  }`}
                >
                  {alert.severity === "critical" ? (
                    <XCircle className="w-5 h-5 text-critical" />
                  ) : alert.severity === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  ) : (
                    <Info className="w-5 h-5 text-primary" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{alert.type}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <Badge variant={alert.status === "pending" ? "default" : "secondary"} className="text-xs">
                      {alert.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <strong>Recommendation:</strong> {alert.recommendation}
                  </p>

                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
