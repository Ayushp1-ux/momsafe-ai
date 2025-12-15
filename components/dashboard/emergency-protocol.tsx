"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Phone, Clock, CheckCircle, Ambulance } from "lucide-react"
import type { Patient } from "@/lib/mock-data"

interface EmergencyProtocolProps {
  patient: Patient
}

const emergencySteps = [
  { id: "1", step: "Alert care team", completed: true },
  { id: "2", step: "Call ambulance", completed: true },
  { id: "3", step: "Notify nearest hospital", completed: false },
  { id: "4", step: "Prepare medical records", completed: false },
  { id: "5", step: "Contact family members", completed: false },
]

export function EmergencyProtocol({ patient }: EmergencyProtocolProps) {
  const [isExpanded, setIsExpanded] = useState(patient.riskLevel === "CRITICAL")
  const [countdown, setCountdown] = useState(12)

  return (
    <>
      {/* Emergency Alert Banner */}
      {patient.riskLevel === "CRITICAL" && (
        <Card className="p-4 bg-critical/20 border-critical animate-pulse-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-critical animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-critical">CRITICAL RISK DETECTED</h3>
                <p className="text-sm text-muted-foreground">Emergency protocol activated</p>
              </div>
            </div>
            <Button
              variant={isExpanded ? "secondary" : "default"}
              className={isExpanded ? "" : "bg-critical text-white hover:bg-critical/90"}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "View Protocol"}
            </Button>
          </div>
        </Card>
      )}

      {/* Emergency Protocol Panel */}
      {isExpanded && (
        <Card className="p-6 glassmorphism border-critical">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-critical/20">
                  <Ambulance className="w-6 h-6 text-critical animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Emergency Response System</h3>
                  <p className="text-xs text-muted-foreground">Immediate action required</p>
                </div>
              </div>
              <Badge className="bg-critical text-white animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                ETA: {countdown} min
              </Badge>
            </div>

            {/* Ambulance Status */}
            <div className="p-4 rounded-lg bg-critical/10 border border-critical/20">
              <div className="flex items-center gap-3 mb-3">
                <Ambulance className="w-6 h-6 text-critical animate-bounce" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Ambulance Dispatched</p>
                  <p className="text-xs text-muted-foreground">Unit 108 - Advanced Life Support</p>
                </div>
                <Badge className="bg-success text-white">En Route</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-critical animate-pulse" style={{ width: "65%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Estimated arrival: {countdown} minutes</p>
            </div>

            {/* Nearest Hospital */}
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Nearest Hospital Notified</h4>
                  <p className="text-xs text-muted-foreground">Apollo Hospital, Banjara Hills</p>
                  <p className="text-xs text-muted-foreground">Distance: 3.2 km • Emergency Room Ready</p>
                  {/* Static Map Placeholder */}
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mt-2">
                    <img
                      src="/hospital-map-location.jpg"
                      alt="Hospital location map"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Emergency Contacts</h4>
              <div className="space-y-2">
                {[
                  { name: "Dr. Rajesh Sharma", role: "Primary Obstetrician", status: "Called", time: "2 min ago" },
                  { name: "Ramesh Kumar", role: "Family Contact", status: "Called", time: "2 min ago" },
                  { name: "Apollo ER", role: "Emergency Room", status: "Notified", time: "1 min ago" },
                ].map((contact) => (
                  <div
                    key={contact.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                  >
                    <Phone className="w-4 h-4 text-success" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {contact.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{contact.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Emergency Protocol Checklist</h4>
              <div className="space-y-2">
                {emergencySteps.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      item.completed ? "bg-success/10 border-success/20" : "bg-card border-border"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? "bg-success" : "bg-muted"
                      }`}
                    >
                      {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span
                      className={`text-sm ${item.completed ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Vitals */}
            <div className="p-4 rounded-lg bg-critical/10 border border-critical/20">
              <h4 className="text-sm font-semibold text-foreground mb-3">Critical Vitals Snapshot</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Blood Pressure</p>
                  <p className="text-foreground font-bold text-critical">{patient.vitals.bp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Heart Rate</p>
                  <p className="text-foreground font-bold text-critical">{patient.vitals.hr} bpm</p>
                </div>
                <div>
                  <p className="text-muted-foreground">SpO2</p>
                  <p className="text-foreground font-bold text-critical">{patient.vitals.spo2}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Temperature</p>
                  <p className="text-foreground font-bold text-critical">{patient.vitals.temp}°F</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                View Full Protocol
              </Button>
              <Button className="flex-1 bg-critical text-white hover:bg-critical/90">
                <Phone className="w-4 h-4 mr-2" />
                Call Emergency
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
