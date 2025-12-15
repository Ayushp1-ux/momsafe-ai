"use client"
import { Input } from "@/components/ui/input"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, Brain, Loader2, Activity } from "lucide-react"
import type { Patient } from "@/lib/mock-data"
import { useRef, useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"

interface AIChatAssistantProps {
  patient: Patient
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIChatAssistant({ patient }: AIChatAssistantProps) {
  const { language } = useLanguage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        language === "hi"
          ? "सुप्रभात! मैंने नवीनतम जीवन संकेतों का विश्लेषण किया है। रक्तचाप थोड़ा बढ़ा हुआ है लेकिन स्वीकार्य सीमा के भीतर है।"
          : "Good morning! I've analyzed the latest vitals. Blood pressure is slightly elevated but within acceptable range.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          patientData: patient,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          aiResponse += chunk

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage?.role === "assistant" && lastMessage.id === "temp") {
              return [...prev.slice(0, -1), { ...lastMessage, content: aiResponse }]
            }
            return [...prev, { id: "temp", role: "assistant", content: aiResponse }]
          })
        }

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.role === "assistant" && lastMessage.id === "temp") {
            return [...prev.slice(0, -1), { ...lastMessage, id: Date.now().toString() }]
          }
          return prev
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzePatient = () => {
    const analysisMessage = "Analyze this patient's condition and suggest next steps."
    setInput(analysisMessage)
    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        const submitEvent = new Event("submit", { cancelable: true, bubbles: true })
        form.dispatchEvent(submitEvent)
      }
    }, 100)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions =
    language === "hi"
      ? ["जोखिम समझाएं", "सामान्य से तुलना करें", "मुझे क्या करना चाहिए?"]
      : ["Explain Risk", "Compare to Normal", "What Should I Do?"]

  const handleQuickAction = (action: string) => {
    setInput(action)
    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }, 0)
  }

  return (
    <aside className="w-96 border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{language === "hi" ? "एआई सहायक" : "AI Assistant"}</h3>
            <p className="text-xs text-muted-foreground">
              {language === "hi" ? "रीयल-टाइम विश्लेषण" : "Real-time analysis"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <Button onClick={handleAnalyzePatient} disabled={isLoading} className="w-full" variant="default">
          <Activity className="w-4 h-4 mr-2" />
          {language === "hi" ? "रोगी का विश्लेषण करें" : "Analyze Patient"}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border space-y-2">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          {language === "hi" ? "त्वरित क्रियाएं" : "Quick Actions"}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => handleQuickAction(action)}
              disabled={isLoading}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback
                className={message.role === "assistant" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}
              >
                {message.role === "assistant" ? "AI" : "U"}
              </AvatarFallback>
            </Avatar>

            <div className={`flex-1 ${message.role === "user" ? "items-end" : ""}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.role === "assistant" ? "bg-card border border-border" : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === "hi" ? "एआई विश्लेषण कर रहा है..." : "AI is analyzing..."}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
            {language === "hi" ? "त्रुटि: कृपया पुनः प्रयास करें" : "Error: Please try again"}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder={language === "hi" ? "जीवन संकेतों के बारे में पूछें..." : "Ask about vitals..."}
            className="flex-1"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button size="icon" variant="ghost" type="button">
            <Mic className="w-5 h-5" />
          </Button>
          <Button size="icon" className="bg-primary text-primary-foreground" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </aside>
  )
}
