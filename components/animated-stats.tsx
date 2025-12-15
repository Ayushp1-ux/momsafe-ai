"use client"

import { useEffect, useState } from "react"

export function AnimatedStats() {
  const [stats, setStats] = useState({ mothers: 0, detection: 0, emergencies: 0 })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setStats({
        mothers: Math.floor(18000 * progress),
        detection: Math.floor(95 * progress),
        emergencies: Math.floor(40 * progress),
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
      <div className="space-y-2">
        <div className="text-5xl font-bold text-primary">{stats.mothers.toLocaleString()}+</div>
        <div className="text-muted-foreground">Mothers monitored</div>
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold text-accent">{stats.detection}%</div>
        <div className="text-muted-foreground">Early detection rate</div>
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold text-chart-4">{stats.emergencies}%</div>
        <div className="text-muted-foreground">Fewer emergencies</div>
      </div>
    </div>
  )
}
