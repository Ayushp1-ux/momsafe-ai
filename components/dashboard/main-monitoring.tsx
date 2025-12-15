"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Thermometer, Wind } from "lucide-react"
import { VitalCard } from "@/components/dashboard/vital-card"
import { VitalCharts } from "@/components/dashboard/vital-charts"
import { RiskAssessment } from "@/components/dashboard/risk-assessment"
import { AlertsTimeline } from "@/components/dashboard/alerts-timeline"
import type { Patient } from "@/lib/mock-data"
import { useEffect } from "react"

interface MainMonitoringProps {
  patient: Patient
}

export function MainMonitoring({ patient }: MainMonitoringProps) {
  useEffect(() => {
    const checkVitals = () => {
      const bp = patient.vitals.bp
      const [systolic, diastolic] = bp.split("/").map(Number)

      if (systolic > 140 || diastolic > 90) {
        const event = new CustomEvent("medical-notification", {
          detail: {
            type: "vital",
            title: "Elevated Blood Pressure",
            message: `${patient.name}: BP ${bp} detected`,
          },
        })
        window.dispatchEvent(event)
      }

      if (patient.vitals.hr > 100 || patient.vitals.hr < 60) {
        const event = new CustomEvent("medical-notification", {
          detail: {
            type: "vital",
            title: "Abnormal Heart Rate",
            message: `${patient.name}: Heart rate ${patient.vitals.hr} BPM`,
          },
        })
        window.dispatchEvent(event)
      }
    }

    const timer = setTimeout(checkVitals, 1000)
    return () => clearTimeout(timer)
  }, [patient])

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Patient Header */}
      <Card className="p-6 glassmorphism">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
            <p className="text-muted-foreground">
              {patient.age} years old • Week {patient.gestationalWeek} • {patient.lastActivity}
            </p>
          </div>
          <Badge
            className={`text-sm px-4 py-2 ${
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
        </div>
      </Card>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard icon={Activity} label="Blood Pressure" value={patient.vitals.bp} status="normal" trend="+2%" />
        <VitalCard
          icon={Heart}
          label="Heart Rate"
          value={`${patient.vitals.hr} bpm`}
          status="normal"
          trend="-1%"
          animated
        />
        <VitalCard icon={Wind} label="SpO2" value={`${patient.vitals.spo2}%`} status="normal" trend="0%" />
        <VitalCard
          icon={Thermometer}
          label="Temperature"
          value={`${patient.vitals.temp}°F`}
          status="normal"
          trend="0%"
        />
      </div>

      {/* Charts */}
      <VitalCharts />

      {/* Risk Assessment & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RiskAssessment patient={patient} />
        <AlertsTimeline />
      </div>
    </main>
  )
}
