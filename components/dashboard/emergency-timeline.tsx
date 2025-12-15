"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

export function EmergencyTimeline() {
  const [doctor, setDoctor] = useState(false)
  const [asha, setAsha] = useState(false)
  const [ambulance, setAmbulance] = useState(false)

  useEffect(() => {
    setTimeout(() => setAsha(true), 1000)
    setTimeout(() => setDoctor(true), 2500)
    setTimeout(() => setAmbulance(true), 5000)
  }, [])

  const Item = ({
    done,
    label,
    time,
  }: {
    done: boolean
    label: string
    time: string
  }) => (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        {done ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />
        )}
        <span className="text-foreground">{label}</span>
      </div>
      <span className="text-muted-foreground">{time}</span>
    </div>
  )

  return (
    <Card className="p-5 space-y-4 border border-red-500/40 bg-red-500/5">
      <h3 className="text-sm font-semibold text-red-400">
        🚨 Emergency Escalation (Auto-triggered)
      </h3>

      <div className="space-y-3">
        <Item done label="AI detected critical anomaly" time="0 min" />
        <Item done label="Family notified" time="0 min" />
        <Item done={asha} label="ASHA worker alerted" time="1 min" />
        <Item done={doctor} label="Doctor notified" time="2 min" />
        <Item done={ambulance} label="Ambulance on standby" time="5 min" />
      </div>
    </Card>
  )
}
