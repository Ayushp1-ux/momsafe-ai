"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, AlertCircle } from "lucide-react"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import type { Patient } from "@/lib/mock-data"

interface PredictiveTimelineProps {
  patient: Patient
}

const predictiveData = [
  {
    day: "Today",
    riskScore: 55,
    bpSystolic: 138,
    bpDiastolic: 88,
    confidence: 95,
    uncertaintyLow: 50,
    uncertaintyHigh: 60,
  },
  {
    day: "Day 3",
    riskScore: 58,
    bpSystolic: 140,
    bpDiastolic: 90,
    confidence: 87,
    uncertaintyLow: 52,
    uncertaintyHigh: 64,
  },
  {
    day: "Day 7",
    riskScore: 62,
    bpSystolic: 142,
    bpDiastolic: 91,
    confidence: 78,
    uncertaintyLow: 54,
    uncertaintyHigh: 70,
  },
  {
    day: "Day 14",
    riskScore: 65,
    bpSystolic: 145,
    bpDiastolic: 92,
    confidence: 65,
    uncertaintyLow: 55,
    uncertaintyHigh: 75,
  },
  {
    day: "Delivery",
    riskScore: 68,
    bpSystolic: 148,
    bpDiastolic: 94,
    confidence: 55,
    uncertaintyLow: 58,
    uncertaintyHigh: 78,
  },
]

export function PredictiveTimeline({ patient }: PredictiveTimelineProps) {
  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Future Outlook & Predictions</h3>
            <p className="text-xs text-muted-foreground">AI-powered 7-day forecast with confidence intervals</p>
          </div>
        </div>

        {/* Predictive Chart with Uncertainty */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Risk Score Trajectory</h4>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={predictiveData}>
              <defs>
                <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[40, 85]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="p-3 bg-card border border-border rounded-lg space-y-1">
                        <p className="text-sm font-semibold text-foreground">{data.day}</p>
                        <p className="text-xs text-muted-foreground">Risk Score: {data.riskScore}</p>
                        <p className="text-xs text-muted-foreground">
                          Range: {data.uncertaintyLow}-{data.uncertaintyHigh}
                        </p>
                        <p className="text-xs text-accent">Confidence: {data.confidence}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="uncertaintyHigh"
                stroke="none"
                fill="url(#uncertaintyGradient)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="uncertaintyLow"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="hsl(var(--warning))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--warning))", r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Cards */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Detailed Predictions</h4>
          <div className="space-y-3">
            {predictiveData.map((point, index) => (
              <div
                key={point.day}
                className="p-4 rounded-lg bg-card/50 border border-border hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-semibold text-foreground">{point.day}</h5>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            point.riskScore < 50
                              ? "bg-success/20 text-success"
                              : point.riskScore < 65
                                ? "bg-warning/20 text-warning"
                                : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {point.riskScore < 50 ? "Low" : point.riskScore < 65 ? "Moderate" : "High"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Predicted BP</p>
                          <p className="text-foreground font-medium">
                            {point.bpSystolic}/{point.bpDiastolic}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Score</p>
                          <p className="text-foreground font-medium">{point.riskScore}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent transition-all" style={{ width: `${point.confidence}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{point.confidence}% confident</span>
                      </div>
                    </div>
                  </div>
                  {index >= 2 && <AlertCircle className="w-5 h-5 text-warning animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-sm font-semibold text-foreground">AI Recommendation</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Trend analysis suggests increasing risk over next 7 days. Consider scheduling additional monitoring
                appointments on Days 3 and 7. Blood pressure management intervention recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
