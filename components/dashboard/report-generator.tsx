"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Download } from "lucide-react"
import type { Patient } from "@/lib/mock-data"
import { useState } from "react"

interface ReportGeneratorProps {
  patient: Patient
}

export function ReportGenerator({ patient }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState<string | null>(null)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setReport(null)

    try {
      const response = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData: patient }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setReport(data.report)
    } catch (error) {
      console.error("[v0] Report generation error:", error)
      setReport("Error: Unable to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!report) return

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${patient.name.replace(/\s+/g, "_")}_Medical_Report_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-6 glassmorphism">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Medical Report Generator</h3>
        </div>
        {report && (
          <Button onClick={handleDownload} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a comprehensive medical report for {patient.name} including vital signs analysis, risk assessment,
          and clinical recommendations.
        </p>

        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full bg-primary text-primary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate Medical Report
            </>
          )}
        </Button>

        {report && (
          <div className="p-4 rounded-lg bg-card border border-border max-h-96 overflow-y-auto">
            <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">{report}</pre>
          </div>
        )}
      </div>
    </Card>
  )
}
