"use client"

import { Card } from "@/components/ui/card"

interface ExplainabilityProps {
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}

export function AIExplainability({ riskLevel }: ExplainabilityProps) {
  const factors =
    riskLevel === "CRITICAL" || riskLevel === "HIGH"
      ? [
          { label: "Blood Pressure Spike", value: 45 },
          { label: "Gestational Age", value: 25 },
          { label: "Medical History", value: 20 },
          { label: "Symptoms Pattern", value: 10 },
        ]
      : [
          { label: "Vitals Stability", value: 40 },
          { label: "Gestational Age", value: 30 },
          { label: "Medical History", value: 20 },
          { label: "Lifestyle Factors", value: 10 },
        ]

  return (
    <Card className="p-5 space-y-4 glassmorphism">
      <h3 className="text-sm font-semibold text-foreground">
        🧠 Why AI Flagged This Case
      </h3>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.label} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{factor.label}</span>
              <span>{factor.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${factor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
