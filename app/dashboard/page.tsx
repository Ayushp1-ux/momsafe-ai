"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PatientSidebar } from "@/components/dashboard/patient-sidebar"
import { MainMonitoring } from "@/components/dashboard/main-monitoring"
import { AIChatAssistant } from "@/components/dashboard/ai-chat-assistant"
import { MLExplainability } from "@/components/dashboard/ml-explainability"
import { PredictiveTimeline } from "@/components/dashboard/predictive-timeline"
import { VoiceInterface } from "@/components/dashboard/voice-interface"
import { ComparativeAnalytics } from "@/components/dashboard/comparative-analytics"
import { CollaborationPanel } from "@/components/dashboard/collaboration-panel"
import { HealthScore } from "@/components/dashboard/health-score"
import { EmergencyProtocol } from "@/components/dashboard/emergency-protocol"
import { PageTransition } from "@/components/dashboard/page-transition"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { SymptomChecker } from "@/components/dashboard/symptom-checker"
import { ReportGenerator } from "@/components/dashboard/report-generator"
import { Fetus3DModel } from "@/components/dashboard/fetus-3d-model"
import { PDFReportDownload } from "@/components/dashboard/pdf-report-download"
import { PatientLocationMap } from "@/components/dashboard/patient-location-map"
import { useApp } from "@/lib/app-context"

// 🔥 NEW FEATURES
import { AIExplainability } from "@/components/dashboard/ai-explainability"
import { EmergencyTimeline } from "@/components/dashboard/emergency-timeline"

export default function DashboardPage() {
  const { patients } = useApp()
  const [selectedPatientId, setSelectedPatientId] = useState("1")
  const [activeTab, setActiveTab] = useState("overview")

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0]

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />
      <NotificationSystem />

      <div className="flex-1 flex overflow-hidden">
        <PatientSidebar
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* 🔴 Existing emergency banner */}
            <EmergencyProtocol patient={selectedPatient} />

            {/* 🚨 NEW: Emergency Escalation Timeline */}
            {selectedPatient.riskLevel === "CRITICAL" && (
              <EmergencyTimeline />
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="3d-model">3D Model</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
                <TabsTrigger value="ai-reasoning">AI Reasoning</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="collaboration">Team</TabsTrigger>
              </TabsList>

              {/* ================= OVERVIEW ================= */}
              <TabsContent value="overview" className="space-y-6">
                <PageTransition id={`overview-${selectedPatientId}`}>
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <PDFReportDownload patient={selectedPatient} />
                    </div>

                    <MainMonitoring patient={selectedPatient} />

                    {/* 🧠 NEW: Explainability card */}
                    <AIExplainability riskLevel={selectedPatient.riskLevel} />

                    <HealthScore patient={selectedPatient} />
                  </div>
                </PageTransition>
              </TabsContent>

              {/* ================= 3D MODEL ================= */}
              <TabsContent value="3d-model">
                <PageTransition id={`3d-model-${selectedPatientId}`}>
                  <Fetus3DModel initialWeek={selectedPatient.gestationalWeek} />
                </PageTransition>
              </TabsContent>

              {/* ================= LOCATION ================= */}
              <TabsContent value="location">
                <PageTransition id={`location-${selectedPatientId}`}>
                  <PatientLocationMap patient={selectedPatient} />
                </PageTransition>
              </TabsContent>

              {/* ================= AI TOOLS ================= */}
              <TabsContent value="ai-tools">
                <PageTransition id={`ai-tools-${selectedPatientId}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SymptomChecker patient={selectedPatient} />
                    <ReportGenerator patient={selectedPatient} />
                  </div>
                </PageTransition>
              </TabsContent>

              {/* ================= AI REASONING ================= */}
              <TabsContent value="ai-reasoning">
                <PageTransition id={`ai-reasoning-${selectedPatientId}`}>
                  <MLExplainability patient={selectedPatient} />
                </PageTransition>
              </TabsContent>

              {/* ================= PREDICTIONS ================= */}
              <TabsContent value="predictions">
                <PageTransition id={`predictions-${selectedPatientId}`}>
                  <PredictiveTimeline patient={selectedPatient} />
                </PageTransition>
              </TabsContent>

              {/* ================= ANALYTICS ================= */}
              <TabsContent value="analytics">
                <PageTransition id={`analytics-${selectedPatientId}`}>
                  <ComparativeAnalytics patient={selectedPatient} />
                </PageTransition>
              </TabsContent>

              {/* ================= TEAM ================= */}
              <TabsContent value="collaboration">
                <PageTransition id={`collaboration-${selectedPatientId}`}>
                  <CollaborationPanel patient={selectedPatient} />
                </PageTransition>
              </TabsContent>

            </Tabs>
          </div>
        </main>

        <AIChatAssistant patient={selectedPatient} />
      </div>

      <VoiceInterface patient={selectedPatient} />
    </div>
  )
}
