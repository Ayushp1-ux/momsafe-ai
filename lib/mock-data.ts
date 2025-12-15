export interface Patient {
  id: string
  name: string
  age: number
  gestationalWeek: number
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  lastActivity: string
  vitals: {
    bp: string
    hr: number
    spo2: number
    temp: number
  }
}

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 28,
    gestationalWeek: 32,
    riskLevel: "MODERATE",
    lastActivity: "5 minutes ago",
    vitals: {
      bp: "138/88",
      hr: 76,
      spo2: 98,
      temp: 98.6,
    },
  },
  {
    id: "2",
    name: "Anita Desai",
    age: 32,
    gestationalWeek: 28,
    riskLevel: "LOW",
    lastActivity: "15 minutes ago",
    vitals: {
      bp: "118/75",
      hr: 72,
      spo2: 99,
      temp: 98.4,
    },
  },
  {
    id: "3",
    name: "Kavita Patel",
    age: 35,
    gestationalWeek: 36,
    riskLevel: "HIGH",
    lastActivity: "2 minutes ago",
    vitals: {
      bp: "145/92",
      hr: 88,
      spo2: 96,
      temp: 99.1,
    },
  },
  {
    id: "4",
    name: "Meera Reddy",
    age: 26,
    gestationalWeek: 24,
    riskLevel: "LOW",
    lastActivity: "1 hour ago",
    vitals: {
      bp: "115/72",
      hr: 68,
      spo2: 99,
      temp: 98.2,
    },
  },
  {
    id: "5",
    name: "Shalini Kumar",
    age: 38,
    gestationalWeek: 34,
    riskLevel: "CRITICAL",
    lastActivity: "Just now",
    vitals: {
      bp: "152/98",
      hr: 92,
      spo2: 94,
      temp: 99.5,
    },
  },
]
