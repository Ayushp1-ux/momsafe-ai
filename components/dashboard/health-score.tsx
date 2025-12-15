"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, Award, Star, TrendingUp } from "lucide-react"
import type { Patient } from "@/lib/mock-data"

interface HealthScoreProps {
  patient: Patient
}

const weeklyScores = [
  { week: "Week 28", score: 72 },
  { week: "Week 29", score: 75 },
  { week: "Week 30", score: 78 },
  { week: "Week 31", score: 76 },
  { week: "Week 32", score: 79 },
]

const achievements = [
  { id: "1", title: "7 Days Stable BP", icon: Trophy, color: "text-success", earned: true },
  { id: "2", title: "Perfect Compliance", icon: Award, color: "text-primary", earned: true },
  { id: "3", title: "30 Days Monitored", icon: Star, color: "text-accent", earned: false },
]

export function HealthScore({ patient }: HealthScoreProps) {
  const currentScore = 79

  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/20">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pregnancy Health Score</h3>
            <p className="text-xs text-muted-foreground">Gamified health tracking and progress</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 border border-success/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Overall Health Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">{currentScore}</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-success text-white mb-2">Excellent</Badge>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-primary transition-all duration-1000"
              style={{ width: `${currentScore}%` }}
            />
          </div>
        </div>

        {/* Progress Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Weekly Progress</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                dataKey="score"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--success))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Score Breakdown</h4>
          <div className="space-y-2">
            {[
              { label: "Vital Stability", score: 85, color: "success" },
              { label: "Compliance", score: 95, color: "primary" },
              { label: "Activity Level", score: 70, color: "accent" },
              { label: "Symptom Control", score: 65, color: "warning" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground font-semibold">{item.score}/100</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-${item.color} transition-all`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Achievements</h4>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    achievement.earned ? "bg-card border-border shadow-md" : "bg-muted/20 border-muted opacity-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 mx-auto rounded-full ${achievement.earned ? "bg-primary/20" : "bg-muted"} flex items-center justify-center mb-2`}
                  >
                    <Icon className={`w-6 h-6 ${achievement.earned ? achievement.color : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-xs text-foreground font-medium">{achievement.title}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-foreground font-medium mb-1">Keep it up!</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your health score improved by 3 points this week. Maintain stable vitals for 3 more days to unlock the
            "Consistency Champion" badge!
          </p>
        </div>
      </div>
    </Card>
  )
}
