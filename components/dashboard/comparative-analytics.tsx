"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import type { Patient } from "@/lib/mock-data"

interface ComparativeAnalyticsProps {
  patient: Patient
}

const similarCases = [
  {
    id: "SC1",
    age: 29,
    week: 33,
    riskLevel: "MODERATE",
    bp: "140/89",
    outcome: "Normal Delivery",
    daysToDelivery: 42,
    complications: "None",
  },
  {
    id: "SC2",
    age: 27,
    week: 31,
    riskLevel: "MODERATE",
    bp: "136/87",
    outcome: "Normal Delivery",
    daysToDelivery: 56,
    complications: "Mild Pre-eclampsia (managed)",
  },
  {
    id: "SC3",
    age: 30,
    week: 34,
    riskLevel: "HIGH",
    bp: "142/91",
    outcome: "C-Section",
    daysToDelivery: 35,
    complications: "Pre-eclampsia",
  },
]

export function ComparativeAnalytics({ patient }: ComparativeAnalyticsProps) {
  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Compare with Similar Cases</h3>
            <p className="text-xs text-muted-foreground">Anonymized patients with similar profiles</p>
          </div>
        </div>

        {/* Current Patient Summary */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Current Patient Profile</h4>
            <Badge className="bg-primary text-primary-foreground">Active</Badge>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-bold text-foreground">{patient.age}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Week</p>
              <p className="text-sm font-bold text-foreground">{patient.gestationalWeek}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk</p>
              <p className="text-sm font-bold text-foreground">{patient.riskLevel}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">BP</p>
              <p className="text-sm font-bold text-foreground">{patient.vitals.bp}</p>
            </div>
          </div>
        </div>

        {/* Similar Cases Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Similar Cases (Last 12 Months)</h4>
          <div className="space-y-2">
            {similarCases.map((case_) => (
              <div
                key={case_.id}
                className="p-4 rounded-lg bg-card/50 border border-border hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">{case_.id}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          case_.outcome === "Normal Delivery"
                            ? "bg-success/20 text-success"
                            : "bg-warning/20 text-warning"
                        }`}
                      >
                        {case_.outcome}
                      </Badge>
                    </div>
                    {case_.outcome === "Normal Delivery" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-warning" />
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Age/Week</p>
                      <p className="text-foreground font-medium">
                        {case_.age}y, W{case_.week}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">BP</p>
                      <p className="text-foreground font-medium">{case_.bp}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk</p>
                      <p className="text-foreground font-medium">{case_.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days to Delivery</p>
                      <p className="text-foreground font-medium">{case_.daysToDelivery}</p>
                    </div>
                  </div>

                  {case_.complications !== "None" && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Complications:</span> {case_.complications}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outcome Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h5 className="text-sm font-semibold text-foreground">Normal Delivery</h5>
            </div>
            <p className="text-2xl font-bold text-success">67%</p>
            <p className="text-xs text-muted-foreground">2 out of 3 cases</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              <h5 className="text-sm font-semibold text-foreground">C-Section</h5>
            </div>
            <p className="text-2xl font-bold text-warning">33%</p>
            <p className="text-xs text-muted-foreground">1 out of 3 cases</p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <h5 className="text-sm font-semibold text-foreground mb-2">AI Insight</h5>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on similar cases, your patient has a 67% likelihood of normal delivery. However, close monitoring for
            pre-eclampsia is recommended given the elevated BP trend. Average time to delivery: 44 days.
          </p>
        </div>
      </div>
    </Card>
  )
}
