"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Activity, Loader2, Sparkles } from "lucide-react"
import type { Patient } from "@/lib/mock-data"
import { useState } from "react"

interface RiskAssessmentProps {
  patient: Patient
}

export function RiskAssessment({ patient }: RiskAssessmentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const riskScore =
    patient.riskLevel === "LOW" ? 25 : patient.riskLevel === "MODERATE" ? 55 : patient.riskLevel === "HIGH" ? 75 : 92

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setShowAnalysis(true)
    setAiAnalysis(null)

    try {
      const response = await fetch("/api/ai/risk-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData: patient }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAiAnalysis(data.analysis)

      const event = new CustomEvent("medical-notification", {
        detail: {
          type: "ai-anomaly",
          title: "AI Analysis Complete",
          message: `Risk assessment updated for ${patient.name}`,
        },
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error("[v0] Risk assessment error:", error)
      setAiAnalysis("Error: Unable to generate analysis. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="p-6 glassmorphism">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">AI Risk Assessment</h3>
        <Button onClick={handleAnalyze} disabled={isAnalyzing} size="sm" className="bg-primary text-primary-foreground">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={
                  patient.riskLevel === "LOW"
                    ? "hsl(var(--success))"
                    : patient.riskLevel === "MODERATE"
                      ? "hsl(var(--warning))"
                      : patient.riskLevel === "HIGH"
                        ? "hsl(var(--destructive))"
                        : "hsl(var(--critical))"
                }
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - riskScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{riskScore}</div>
                <div className="text-xs text-muted-foreground">Risk Score</div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <Badge
              className={`${
                patient.riskLevel === "LOW"
                  ? "bg-success"
                  : patient.riskLevel === "MODERATE"
                    ? "bg-warning"
                    : patient.riskLevel === "HIGH"
                      ? "bg-destructive"
                      : "bg-critical"
              } text-white`}
            >
              {patient.riskLevel} RISK
            </Badge>
            <p className="text-sm text-muted-foreground">AI Confidence: 94%</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Detected Risk Factors:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-foreground">Elevated blood pressure trend</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-foreground">Gestational diabetes history</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-foreground">Reduced fetal movement</span>
            </div>
          </div>
        </div>

        {showAnalysis && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="w-4 h-4" />
              AI Analysis
            </div>
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating comprehensive analysis...
              </div>
            ) : (
              <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">{aiAnalysis}</div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAnalysis(!showAnalysis)}>
            {showAnalysis ? "Hide Analysis" : "View Full Analysis"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
