"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Volume2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Patient } from "@/lib/mock-data"

interface VoiceInterfaceProps {
  patient: Patient
}

export function VoiceInterface({ patient }: VoiceInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript
        setTranscript(speechResult)
        setIsListening(false)
        generateResponse(speechResult)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase()
    let response = ""

    if (lowerQuery.includes("headache") || lowerQuery.includes("pain")) {
      response = `I detect symptoms that could indicate elevated blood pressure. Your current BP is ${patient.vitals.bp}. ${
        patient.riskLevel === "HIGH" || patient.riskLevel === "CRITICAL"
          ? "This requires immediate medical attention. I'm alerting your care team."
          : "Please rest and monitor your symptoms. I'll schedule a follow-up."
      }`
    } else if (lowerQuery.includes("swelling") || lowerQuery.includes("feet")) {
      response = `Swelling can be a sign of fluid retention. Your current vitals show BP ${patient.vitals.bp} and heart rate ${patient.vitals.hr} BPM. I recommend elevating your feet and reducing salt intake. Would you like me to schedule a doctor visit?`
    } else if (lowerQuery.includes("baby") || lowerQuery.includes("movement")) {
      response = `You're at week ${patient.gestationalWeek}. Normal fetal movement varies, but decreased movement should be checked immediately. Would you like me to contact your doctor?`
    } else {
      response = `I understand your concern. Based on your current vitals (BP: ${patient.vitals.bp}, HR: ${patient.vitals.hr} BPM, SpO2: ${patient.vitals.spo2}%), everything appears stable. Would you like me to provide more specific guidance?`
    }

    setAiResponse(response)

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(response)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleVoiceClick = () => {
    setIsOpen(true)
    setTranscript("")
    setAiResponse("")

    if (recognitionRef.current) {
      setIsListening(true)
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.log("[v0] Speech recognition already started or error:", error)
        setIsListening(false)
      }
    } else {
      // Fallback simulation
      setIsListening(true)
      setTimeout(() => {
        setIsListening(false)
        const sampleQuery = "I have a headache and swelling in my feet"
        setTranscript(sampleQuery)
        generateResponse(sampleQuery)
      }, 3000)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsListening(false)
    setTranscript("")
    setAiResponse("")

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Already stopped
      }
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  return (
    <>
      {/* Floating Voice Button */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 transition-all",
          isListening ? "bg-critical animate-pulse" : "bg-primary hover:scale-110",
        )}
        onClick={handleVoiceClick}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>

      {/* Voice Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 space-y-6 glassmorphism">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Voice Assistant</h3>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Waveform Animation */}
            {isListening && (
              <div className="flex items-center justify-center gap-1 h-32">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-waveform"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Status */}
            <div className="text-center space-y-2">
              {isListening ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-critical/20 flex items-center justify-center">
                    <Mic className="w-8 h-8 text-critical animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground">Listening... Speak your symptoms or questions</p>
                </>
              ) : transcript ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border text-left">
                    <p className="text-xs text-muted-foreground mb-1">You said:</p>
                    <p className="text-sm text-foreground">{transcript}</p>
                  </div>

                  {aiResponse && (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                        <p className="text-xs text-muted-foreground">AI Response:</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{aiResponse}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Actions */}
            {aiResponse && (
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
                  Close
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleVoiceClick}>
                  <Mic className="w-4 h-4 mr-2" />
                  Speak Again
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
