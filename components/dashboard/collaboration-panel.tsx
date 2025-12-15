"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, MessageSquare, Eye, Clock } from "lucide-react"
import type { Patient } from "@/lib/mock-data"
import { useApp } from "@/lib/app-context"
import { useState } from "react"

interface CollaborationPanelProps {
  patient: Patient
}

const careTeam = [
  { id: "1", name: "Dr. Rajesh Sharma", role: "Obstetrician", status: "online", lastSeen: "Active now" },
  { id: "2", name: "Nurse Priya", role: "ASHA Worker", status: "online", lastSeen: "Active now" },
  { id: "3", name: "Ramesh Kumar", role: "Family Contact", status: "offline", lastSeen: "2 hours ago" },
]

const defaultNotes = [
  {
    id: "1",
    author: "Dr. Rajesh Sharma",
    role: "Obstetrician",
    content: "BP trending upward. Consider increasing monitoring frequency to every 2 hours. @nurse @family",
    time: "15 min ago",
    tags: ["urgent", "bp-monitoring"],
  },
  {
    id: "2",
    author: "Nurse Priya",
    role: "ASHA Worker",
    content: "Patient reports reduced fetal movement. Scheduling ultrasound for today 3 PM. @doctor",
    time: "1 hour ago",
    tags: ["fetal-movement", "ultrasound"],
  },
]

export function CollaborationPanel({ patient }: CollaborationPanelProps) {
  const { addNote, getNotes } = useApp()
  const [noteInput, setNoteInput] = useState("")
  const patientNotes = getNotes(patient.id)
  const allNotes = [...patientNotes, ...defaultNotes]

  const handleAddNote = () => {
    if (noteInput.trim()) {
      const tags: string[] = []
      if (noteInput.includes("@")) tags.push("mention")
      if (noteInput.toLowerCase().includes("urgent")) tags.push("urgent")

      addNote(patient.id, noteInput, "Current User", tags)
      setNoteInput("")

      const event = new CustomEvent("medical-notification", {
        detail: {
          type: "team",
          title: "New Team Note",
          message: `Note added for ${patient.name}`,
        },
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Medical Team Collaboration</h3>
            <p className="text-xs text-muted-foreground">Shared notes and real-time updates</p>
          </div>
          <Badge variant="secondary" className="animate-pulse">
            <Eye className="w-3 h-3 mr-1" />
            Dr. Sharma viewing
          </Badge>
        </div>

        {/* Care Team Members */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Care Team</h4>
          <div className="space-y-2">
            {careTeam.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                      member.status === "online" ? "bg-success" : "bg-muted"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {member.lastSeen}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Notes Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Shared Notes</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-lg bg-card border border-border space-y-2 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-accent/20 text-accent text-xs">
                        {note.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{note.author}</p>
                      <p className="text-xs text-muted-foreground">{note.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{note.time}</p>
                </div>

                <p className="text-sm text-foreground leading-relaxed pl-11">{note.content}</p>

                <div className="flex flex-wrap gap-2 pl-11">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Note Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a note or tag someone with @..."
              className="flex-1"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddNote()
                }
              }}
            />
            <Button
              size="icon"
              className="bg-primary text-primary-foreground"
              onClick={handleAddNote}
              disabled={!noteInput.trim()}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Tag:</span>
            <button className="hover:text-foreground" onClick={() => setNoteInput((prev) => prev + " @doctor")}>
              @doctor
            </button>
            <button className="hover:text-foreground" onClick={() => setNoteInput((prev) => prev + " @nurse")}>
              @nurse
            </button>
            <button className="hover:text-foreground" onClick={() => setNoteInput((prev) => prev + " @family")}>
              @family
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
