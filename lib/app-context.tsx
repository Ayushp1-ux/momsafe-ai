"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockPatients, type Patient } from "@/lib/mock-data"

interface VitalReading {
  timestamp: Date
  bp: string
  hr: number
  spo2: number
  temp: number
}

interface AppContextType {
  patients: Patient[]
  updatePatientVitals: (patientId: string, vitals: Patient["vitals"]) => void
  addVitalHistory: (patientId: string, reading: VitalReading) => void
  getVitalHistory: (patientId: string) => VitalReading[]
  addNote: (patientId: string, note: string, author: string, tags: string[]) => void
  getNotes: (patientId: string) => any[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [vitalHistory, setVitalHistory] = useState<Record<string, VitalReading[]>>({})
  const [notes, setNotes] = useState<Record<string, any[]>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setPatients((prev) =>
        prev.map((patient) => {
          const variance = Math.random() * 4 - 2
          const newHr = Math.max(60, Math.min(100, patient.vitals.hr + Math.floor(variance)))
          const newSpo2 = Math.max(94, Math.min(100, patient.vitals.spo2 + Math.floor(variance / 2)))

          return {
            ...patient,
            vitals: {
              ...patient.vitals,
              hr: newHr,
              spo2: newSpo2,
            },
            lastActivity: "Just now",
          }
        }),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const updatePatientVitals = (patientId: string, vitals: Patient["vitals"]) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              vitals,
              lastActivity: "Just now",
            }
          : p,
      ),
    )

    addVitalHistory(patientId, {
      timestamp: new Date(),
      ...vitals,
    })
  }

  const addVitalHistory = (patientId: string, reading: VitalReading) => {
    setVitalHistory((prev) => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), reading].slice(-100),
    }))
  }

  const getVitalHistory = (patientId: string) => {
    return vitalHistory[patientId] || []
  }

  const addNote = (patientId: string, note: string, author: string, tags: string[]) => {
    const newNote = {
      id: Date.now().toString(),
      author,
      role: "Healthcare Provider",
      content: note,
      time: "Just now",
      tags,
      timestamp: new Date(),
    }

    setNotes((prev) => ({
      ...prev,
      [patientId]: [newNote, ...(prev[patientId] || [])],
    }))
  }

  const getNotes = (patientId: string) => {
    return notes[patientId] || []
  }

  return (
    <AppContext.Provider
      value={{
        patients,
        updatePatientVitals,
        addVitalHistory,
        getVitalHistory,
        addNote,
        getNotes,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
