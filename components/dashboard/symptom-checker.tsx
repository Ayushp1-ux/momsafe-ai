"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import type { Patient } from "@/lib/mock-data"
import { useState } from "react"

interface SymptomCheckerProps {
  patient: Patient
}

const commonSymptoms = [
  "Severe headache",
  "Blurred vision",
  "Swelling in hands/feet",
  "Upper abdominal pain",
  "Nausea/vomiting",
  "Reduced fetal movement",
  "Contractions",
  "Vaginal bleeding",
]

export function SymptomChecker({ patient }: SymptomCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return

    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      const response = await fetch("/api/ai/symptom-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          patientData: patient,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAnalysis(data.analysis)
    } catch (error) {
      console.error("[v0] Symptom checker error:", error)
      setAnalysis("Error: Unable to analyze symptoms. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="p-6 glassmorphism">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Symptom Checker</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Select symptoms the patient is experiencing:</p>
          <div className="grid grid-cols-2 gap-3">
            {commonSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={selectedSymptoms.includes(symptom)}
                  onCheckedChange={() => handleSymptomToggle(symptom)}
                />
                <label
                  htmlFor={symptom}
                  className="text-sm text-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {symptom}
                </label>
              </div>
            ))}
          </div>
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <Badge key={symptom} variant="secondary" className="text-xs">
                {symptom}
              </Badge>
            ))}
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={selectedSymptoms.length === 0 || isAnalyzing}
          className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Analyze Symptoms ({selectedSymptoms.length})
            </>
          )}
        </Button>

        {analysis && (
          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-warning">
              <AlertCircle className="w-4 h-4" />
              Symptom Analysis
            </div>
            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">{analysis}</div>
          </div>
        )}
      </div>
    </Card>
  )
}
