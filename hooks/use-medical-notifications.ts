"use client"

import { useEffect, useRef } from "react"

export type NotificationType = "vital" | "ai-anomaly" | "asha-visit" | "critical" | "info"

interface MedicalNotification {
  type: NotificationType
  title: string
  message: string
  playSound?: boolean
}

const notificationCallbacks: ((notification: MedicalNotification) => void)[] = []

export function triggerMedicalNotification(notification: MedicalNotification) {
  notificationCallbacks.forEach((callback) => callback(notification))

  if (notification.playSound !== false) {
    playNotificationSound(notification.type)
  }
}

function playNotificationSound(type: NotificationType) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Different frequencies for different notification types
  const frequencies: Record<NotificationType, number[]> = {
    vital: [800, 600], // Two-tone beep
    "ai-anomaly": [600, 400, 600], // Alert pattern
    "asha-visit": [500, 700], // Pleasant chime
    critical: [900, 900, 900], // Urgent triple beep
    info: [400], // Single soft tone
  }

  const freq = frequencies[type] || [500]
  let time = audioContext.currentTime

  freq.forEach((f, i) => {
    oscillator.frequency.setValueAtTime(f, time)
    gainNode.gain.setValueAtTime(0.1, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    time += 0.15
  })

  oscillator.start(audioContext.currentTime)
  oscillator.stop(time)
}

export function useMedicalNotifications(onNotification: (notification: MedicalNotification) => void) {
  const callbackRef = useRef(onNotification)
  callbackRef.current = onNotification

  useEffect(() => {
    const callback = (notification: MedicalNotification) => {
      callbackRef.current(notification)
    }

    notificationCallbacks.push(callback)

    return () => {
      const index = notificationCallbacks.indexOf(callback)
      if (index > -1) {
        notificationCallbacks.splice(index, 1)
      }
    }
  }, [])
}
