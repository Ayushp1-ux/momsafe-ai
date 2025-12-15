"use client"

import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Activity, Heart, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Patient } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface PatientSidebarProps {
  patients: Patient[]
  selectedPatientId: string
  onSelectPatient: (id: string) => void
}

export function PatientSidebar({ patients, selectedPatientId, onSelectPatient }: PatientSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "risk" | "week">("risk")

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "bg-success text-success-foreground"
      case "MODERATE":
        return "bg-warning text-warning-foreground"
      case "HIGH":
        return "bg-destructive text-destructive-foreground"
      case "CRITICAL":
        return "bg-critical text-critical-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRiskWeight = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return 4
      case "HIGH":
        return 3
      case "MODERATE":
        return 2
      case "LOW":
        return 1
      default:
        return 0
    }
  }

  let filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (sortBy === "risk") {
    filteredPatients = [...filteredPatients].sort((a, b) => getRiskWeight(b.riskLevel) - getRiskWeight(a.riskLevel))
  } else if (sortBy === "name") {
    filteredPatients = [...filteredPatients].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === "week") {
    filteredPatients = [...filteredPatients].sort((a, b) => b.gestationalWeek - a.gestationalWeek)
  }

  const toggleSort = () => {
    if (sortBy === "risk") setSortBy("name")
    else if (sortBy === "name") setSortBy("week")
    else setSortBy("risk")
  }

  return (
    <aside className="w-80 border-r border-border bg-card p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm" onClick={toggleSort}>
            <ArrowUpDown className="w-3 h-3 mr-2" />
            {sortBy === "risk" ? "Risk Level" : sortBy === "name" ? "Name" : "Week"}
          </Button>
        </div>

        <div className="space-y-2">
          {filteredPatients.map((patient, index) => (
            <Card
              key={patient.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md animate-fade-in",
                selectedPatientId === patient.id && "ring-2 ring-primary shadow-lg",
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onSelectPatient(patient.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {patient.age}y, Week {patient.gestationalWeek}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        getRiskColor(patient.riskLevel),
                        (patient.riskLevel === "HIGH" || patient.riskLevel === "CRITICAL") && "animate-pulse-glow",
                      )}
                    >
                      {patient.riskLevel}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{patient.vitals.bp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{patient.vitals.hr} bpm</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{patient.lastActivity}</p>
                </div>
              </div>
            </Card>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No patients found</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
