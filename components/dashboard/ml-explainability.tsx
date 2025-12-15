"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Brain, TrendingUp, TrendingDown, Info } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useState } from "react"
import type { Patient } from "@/lib/mock-data"

interface MLExplainabilityProps {
  patient: Patient
}

const featureImportance = [
  { feature: "Blood Pressure", importance: 35, impact: "positive" },
  { feature: "Medical History", importance: 25, impact: "positive" },
  { feature: "Symptoms", importance: 20, impact: "positive" },
  { feature: "Age", importance: 12, impact: "neutral" },
  { feature: "Gestational Week", importance: 8, impact: "negative" },
]

export function MLExplainability({ patient }: MLExplainabilityProps) {
  const [simulatedBP, setSimulatedBP] = useState([138])
  const [simulatedHR, setSimulatedHR] = useState([76])
  const [simulatedRisk, setSimulatedRisk] = useState(55)

  const handleBPChange = (value: number[]) => {
    setSimulatedBP(value)
    // Calculate new risk based on BP
    const newRisk = Math.min(100, Math.max(0, 55 + (value[0] - 138) * 0.5))
    setSimulatedRisk(Math.round(newRisk))
  }

  const handleHRChange = (value: number[]) => {
    setSimulatedHR(value)
    // Calculate new risk based on HR
    const newRisk = Math.min(100, Math.max(0, simulatedRisk + (value[0] - 76) * 0.3))
    setSimulatedRisk(Math.round(newRisk))
  }

  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Reasoning & Explainability</h3>
            <p className="text-xs text-muted-foreground">Understanding how AI calculates risk</p>
          </div>
        </div>

        {/* Feature Importance Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Feature Importance Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                dataKey="feature"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                {featureImportance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.impact === "positive"
                        ? "hsl(var(--destructive))"
                        : entry.impact === "negative"
                          ? "hsl(var(--success))"
                          : "hsl(var(--warning))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SHAP-style Contributions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Risk Contribution Analysis</h4>
          <div className="space-y-2">
            {featureImportance.map((feature) => (
              <div key={feature.feature} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32">{feature.feature}</span>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${
                      feature.impact === "positive"
                        ? "bg-destructive"
                        : feature.impact === "negative"
                          ? "bg-success"
                          : "bg-warning"
                    } transition-all`}
                    style={{ width: `${feature.importance}%` }}
                  />
                </div>
                {feature.impact === "positive" ? (
                  <TrendingUp className="w-4 h-4 text-destructive" />
                ) : feature.impact === "negative" ? (
                  <TrendingDown className="w-4 h-4 text-success" />
                ) : (
                  <Info className="w-4 h-4 text-warning" />
                )}
                <span className="text-xs font-semibold text-foreground w-12 text-right">{feature.importance}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">What-If Simulator</h4>
            <Badge variant="secondary" className="text-xs">
              Interactive
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Blood Pressure (Systolic)</label>
                <span className="text-sm font-semibold text-foreground">{simulatedBP[0]} mmHg</span>
              </div>
              <Slider value={simulatedBP} onValueChange={handleBPChange} min={100} max={180} step={1} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Heart Rate</label>
                <span className="text-sm font-semibold text-foreground">{simulatedHR[0]} bpm</span>
              </div>
              <Slider value={simulatedHR} onValueChange={handleHRChange} min={60} max={120} step={1} />
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Predicted Risk Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{simulatedRisk}</span>
                  <Badge
                    className={`${
                      simulatedRisk < 40
                        ? "bg-success"
                        : simulatedRisk < 60
                          ? "bg-warning"
                          : simulatedRisk < 80
                            ? "bg-destructive"
                            : "bg-critical"
                    } text-white`}
                  >
                    {simulatedRisk < 40
                      ? "LOW"
                      : simulatedRisk < 60
                        ? "MODERATE"
                        : simulatedRisk < 80
                          ? "HIGH"
                          : "CRITICAL"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Path */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">AI Decision Path</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
              <div className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">BP &lt; 140: Normal range ✓</p>
                <p className="text-xs text-muted-foreground">Patient's BP is 138/88</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
              <div className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">History check: Gestational diabetes detected</p>
                <p className="text-xs text-muted-foreground">Risk factor identified (+15 points)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
              <div className="w-6 h-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">Symptoms: Reduced fetal movement</p>
                <p className="text-xs text-muted-foreground">Immediate monitoring required (+20 points)</p>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-primary text-primary-foreground">Export Detailed Report</Button>
      </div>
    </Card>
  )
}
