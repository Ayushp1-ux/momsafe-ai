"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"

const bpData = [
  { time: "00:00", systolic: 118, diastolic: 75 },
  { time: "04:00", systolic: 115, diastolic: 73 },
  { time: "08:00", systolic: 122, diastolic: 78 },
  { time: "12:00", systolic: 120, diastolic: 76 },
  { time: "16:00", systolic: 119, diastolic: 75 },
  { time: "20:00", systolic: 121, diastolic: 77 },
  { time: "24:00", systolic: 118, diastolic: 74 },
]

const hrData = [
  { time: "00:00", hr: 72 },
  { time: "04:00", hr: 68 },
  { time: "08:00", hr: 75 },
  { time: "12:00", hr: 78 },
  { time: "16:00", hr: 74 },
  { time: "20:00", hr: 76 },
  { time: "24:00", hr: 72 },
]

export function VitalCharts() {
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Blood Pressure Chart */}
      <Card className="p-6 glassmorphism">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Blood Pressure (24h)</h3>
            <div className="flex gap-2">
              <Button variant={timeRange === "6h" ? "secondary" : "ghost"} size="sm" onClick={() => setTimeRange("6h")}>
                6h
              </Button>
              <Button
                variant={timeRange === "12h" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("12h")}
              >
                12h
              </Button>
              <Button
                variant={timeRange === "24h" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("24h")}
              >
                24h
              </Button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={bpData}>
              <defs>
                <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="systolic"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorSystolic)"
              />
              <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Heart Rate Chart */}
      <Card className="p-6 glassmorphism">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Heart Rate Variability</h3>
            <div className="flex gap-2">
              <Button variant={timeRange === "6h" ? "secondary" : "ghost"} size="sm" onClick={() => setTimeRange("6h")}>
                6h
              </Button>
              <Button
                variant={timeRange === "12h" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("12h")}
              >
                12h
              </Button>
              <Button
                variant={timeRange === "24h" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("24h")}
              >
                24h
              </Button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 85]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="hr"
                stroke="hsl(var(--accent))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--accent))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
