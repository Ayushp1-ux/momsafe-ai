import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Activity, Brain, Bell, TrendingUp, Shield, Sparkles } from "lucide-react"
import { AnimatedStats } from "@/components/animated-stats"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#16213e]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent animate-pulse-glow" />

        <div className="container relative mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur">
                <Activity className="w-10 h-10 text-primary animate-heartbeat" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white text-balance">
                MomSafe <span className="text-primary">AI</span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-foreground/80 text-balance leading-relaxed">
              AI-powered maternal health monitoring for high-risk pregnancies
            </p>

            {/* Animated Statistics */}
            <AnimatedStats />

            {/* CTA Button */}
            <div className="pt-8">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow shadow-2xl shadow-primary/50"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Launch Live Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-6xl mx-auto">
            <Card className="p-6 glassmorphism hover:scale-105 transition-transform duration-300 border-primary/20">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/20 w-fit">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">AI Risk Prediction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced machine learning algorithms predict complications before they occur
                </p>
              </div>
            </Card>

            <Card className="p-6 glassmorphism hover:scale-105 transition-transform duration-300 border-accent/20">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-accent/20 w-fit">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Voice Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time vital signs tracking with intelligent pattern recognition
                </p>
              </div>
            </Card>

            <Card className="p-6 glassmorphism hover:scale-105 transition-transform duration-300 border-chart-4/20">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-chart-4/20 w-fit">
                  <Bell className="w-8 h-8 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Real-time Alerts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instant notifications for medical teams when intervention is needed
                </p>
              </div>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5" />
              <span>Medical-grade security and HIPAA compliant</span>
            </div>
            <p className="text-sm text-muted-foreground">Trusted by healthcare facilities across India</p>
          </div>
        </div>
      </div>
    </div>
  )
}
