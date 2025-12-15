"use client"

import { Card } from "@/components/ui/card"

export function VitalCardSkeleton() {
  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="w-6 h-6 bg-muted rounded-full" />
          <div className="w-2 h-2 bg-muted rounded-full" />
        </div>
        <div>
          <div className="w-24 h-4 bg-muted rounded mb-2" />
          <div className="w-20 h-8 bg-muted rounded" />
        </div>
        <div className="w-32 h-3 bg-muted rounded" />
      </div>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="w-40 h-6 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="w-12 h-8 bg-muted rounded" />
            <div className="w-12 h-8 bg-muted rounded" />
            <div className="w-12 h-8 bg-muted rounded" />
          </div>
        </div>
        <div className="w-full h-48 bg-muted rounded" />
      </div>
    </Card>
  )
}

export function PatientCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3 animate-pulse">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-32 h-5 bg-muted rounded mb-1" />
              <div className="w-24 h-3 bg-muted rounded" />
            </div>
            <div className="w-16 h-5 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-3 bg-muted rounded" />
            <div className="w-16 h-3 bg-muted rounded" />
          </div>
          <div className="w-28 h-3 bg-muted rounded" />
        </div>
      </div>
    </Card>
  )
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-8 h-8 bg-muted rounded-full" />
      <div className="flex-1">
        <div className="p-3 rounded-lg bg-muted">
          <div className="space-y-2">
            <div className="w-full h-3 bg-background rounded" />
            <div className="w-3/4 h-3 bg-background rounded" />
          </div>
        </div>
        <div className="w-16 h-2 bg-muted rounded mt-1" />
      </div>
    </div>
  )
}
