"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import type * as THREE from "three"

interface FetusModelProps {
  gestationalWeek: number
  showLabels: boolean
}

// Anatomical labels for different gestational stages
const getAnatomyLabels = (week: number) => {
  if (week < 12) {
    return [
      { position: [0, 0.8, 0], label: "Head forming", visible: true },
      { position: [0, 0.3, 0], label: "Neural tube", visible: true },
      { position: [0, -0.3, 0], label: "Limb buds", visible: true },
    ]
  } else if (week < 20) {
    return [
      { position: [0, 1, 0], label: "Brain development", visible: true },
      { position: [0.3, 0.5, 0], label: "Eyes", visible: true },
      { position: [0, 0, 0], label: "Heart", visible: true },
      { position: [0, -0.5, 0], label: "Abdomen", visible: true },
      { position: [0.4, -0.8, 0], label: "Arms", visible: true },
      { position: [-0.4, -0.8, 0], label: "Legs", visible: true },
    ]
  } else if (week < 28) {
    return [
      { position: [0, 1.2, 0], label: "Developed brain", visible: true },
      { position: [0.4, 0.8, 0], label: "Eyes open", visible: true },
      { position: [0, 0.3, 0], label: "Lungs maturing", visible: true },
      { position: [0, -0.2, 0], label: "Digestive system", visible: true },
      { position: [0.5, -0.7, 0], label: "Muscle tone", visible: true },
      { position: [-0.5, -0.7, 0], label: "Fat deposits", visible: true },
    ]
  } else {
    return [
      { position: [0, 1.4, 0], label: "Fully formed brain", visible: true },
      { position: [0.5, 1, 0], label: "Hair growth", visible: true },
      { position: [0, 0.5, 0], label: "Mature lungs", visible: true },
      { position: [0, 0, 0], label: "Strong heart", visible: true },
      { position: [0, -0.5, 0], label: "Full digestive system", visible: true },
      { position: [0.6, -1, 0], label: "Developed limbs", visible: true },
    ]
  }
}

// Calculate fetus size based on gestational week
const getFetusScale = (week: number): number => {
  // Scale from 0.2 (week 8) to 1.0 (week 40)
  const minWeek = 8
  const maxWeek = 40
  const minScale = 0.2
  const maxScale = 1.0

  const normalized = Math.max(0, Math.min(1, (week - minWeek) / (maxWeek - minWeek)))
  return minScale + normalized * (maxScale - minScale)
}

function FetusModel({ gestationalWeek, showLabels }: FetusModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const scale = getFetusScale(gestationalWeek)
  const labels = getAnatomyLabels(gestationalWeek)

  return (
    <group ref={meshRef} scale={scale}>
      {/* Head */}
      <mesh position={[0, 0.8, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? "#ffa5d8" : "#ffb5e0"}
          roughness={0.3}
          metalness={0.1}
          emissive={hovered ? "#ff4da6" : "#ff6bb5"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 16, 32]} />
        <meshStandardMaterial
          color="#ffb5e0"
          roughness={0.3}
          metalness={0.1}
          emissive="#ff6bb5"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#ffb5e0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#ffb5e0" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.15, -0.8, 0]} rotation={[0, 0, Math.PI / 12]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#ffb5e0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-0.15, -0.8, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#ffb5e0" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Umbilical cord representation */}
      {gestationalWeek >= 12 && (
        <mesh position={[0, -0.3, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial
            color="#d4a5ff"
            roughness={0.5}
            metalness={0.2}
            emissive="#b57aff"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}

      {/* Anatomy labels */}
      {showLabels &&
        labels.map((item, index) => (
          <Html key={index} position={item.position as [number, number, number]} distanceFactor={4}>
            <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground shadow-lg whitespace-nowrap">
              {item.label}
            </div>
          </Html>
        ))}
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </div>
  )
}

export function Fetus3DModel({ initialWeek }: { initialWeek: number }) {
  const [gestationalWeek, setGestationalWeek] = useState(initialWeek)
  const [showLabels, setShowLabels] = useState(true)
  const [zoom, setZoom] = useState(5)
  const controlsRef = useRef<any>(null)

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
    setZoom(5)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.max(2, prev - 0.5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.min(10, prev + 0.5))
  }

  const getDevelopmentStage = (week: number): string => {
    if (week < 12) return "First Trimester - Early Development"
    if (week < 20) return "Second Trimester - Rapid Growth"
    if (week < 28) return "Second Trimester - Maturation"
    if (week < 37) return "Third Trimester - Final Growth"
    return "Third Trimester - Full Term"
  }

  const getWeightEstimate = (week: number): string => {
    if (week < 12) return "< 50g"
    if (week < 20) return "250g - 450g"
    if (week < 28) return "600g - 1200g"
    if (week < 37) return "1500g - 2800g"
    return "2500g - 4000g"
  }

  const getLengthEstimate = (week: number): string => {
    if (week < 12) return "< 6 cm"
    if (week < 20) return "15 - 25 cm"
    if (week < 28) return "28 - 38 cm"
    if (week < 37) return "40 - 48 cm"
    return "48 - 53 cm"
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              3D Fetal Development
              <Badge variant="outline" className="text-base">
                Week {gestationalWeek}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2">{getDevelopmentStage(gestationalWeek)}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} title="Reset View">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 3D Canvas */}
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, zoom]} />
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
              <pointLight position={[-5, 5, -5]} intensity={0.4} color="#ffa5d8" />
              <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#d4a5ff" />

              <FetusModel gestationalWeek={gestationalWeek} showLabels={showLabels} />

              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                minDistance={2}
                maxDistance={10}
                enableDamping
                dampingFactor={0.05}
              />

              <Environment preset="sunset" />
            </Suspense>
          </Canvas>

          {/* Loading indicator */}
          <div className="absolute inset-0 pointer-events-none">
            <Suspense fallback={<LoadingFallback />}>
              <div />
            </Suspense>
          </div>
        </div>

        {/* Week Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Gestational Week: {gestationalWeek}</label>
            <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)} className="text-xs">
              {showLabels ? "Hide" : "Show"} Labels
            </Button>
          </div>

          <Slider
            value={[gestationalWeek]}
            onValueChange={([value]) => setGestationalWeek(value)}
            min={8}
            max={40}
            step={1}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Week 8</span>
            <span>Week 20</span>
            <span>Week 32</span>
            <span>Week 40</span>
          </div>
        </div>

        {/* Development Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Estimated Weight</p>
            <p className="text-lg font-semibold text-foreground">{getWeightEstimate(gestationalWeek)}</p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Crown-Rump Length</p>
            <p className="text-lg font-semibold text-foreground">{getLengthEstimate(gestationalWeek)}</p>
          </div>
        </div>

        {/* Key Milestones */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <h4 className="text-sm font-semibold mb-2">Key Milestones at Week {gestationalWeek}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {gestationalWeek < 12 && (
              <>
                <li>• Neural tube developing into brain and spinal cord</li>
                <li>• Heart begins to beat (detectable around week 6)</li>
                <li>• Limb buds forming arms and legs</li>
              </>
            )}
            {gestationalWeek >= 12 && gestationalWeek < 20 && (
              <>
                <li>• All major organs have formed</li>
                <li>• Fetus can make movements</li>
                <li>• Sex can be determined via ultrasound</li>
              </>
            )}
            {gestationalWeek >= 20 && gestationalWeek < 28 && (
              <>
                <li>• Eyes can open and close</li>
                <li>• Lungs continue to develop</li>
                <li>• Brain developing rapidly</li>
              </>
            )}
            {gestationalWeek >= 28 && (
              <>
                <li>• Lungs capable of breathing air</li>
                <li>• Can respond to sound and light</li>
                <li>• Gaining weight rapidly</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
