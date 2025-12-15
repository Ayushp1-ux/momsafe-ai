"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Phone, Clock } from "lucide-react"
import type { Patient } from "@/lib/mock-data"

interface Hospital {
  id: string
  name: string
  lat: number
  lng: number
  distance: string
  eta: string
  phone: string
  facilities: string[]
}

interface PatientLocationMapProps {
  patient: Patient
}

export function PatientLocationMap({ patient }: PatientLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Mock patient location (Mumbai coordinates as example)
  const patientLocation = { lat: 19.076, lng: 72.8777 }

  // Mock nearby hospitals
  const hospitals: Hospital[] = [
    {
      id: "h1",
      name: "Lilavati Hospital & Research Centre",
      lat: 19.066,
      lng: 72.8347,
      distance: "4.2 km",
      eta: "12 min",
      phone: "+91-22-26567891",
      facilities: ["24/7 Emergency", "NICU", "Maternity Ward", "ICU"],
    },
    {
      id: "h2",
      name: "Breach Candy Hospital",
      lat: 18.9729,
      lng: 72.8066,
      distance: "6.8 km",
      eta: "18 min",
      phone: "+91-22-23672888",
      facilities: ["24/7 Emergency", "NICU", "Maternity Ward"],
    },
    {
      id: "h3",
      name: "Jaslok Hospital",
      lat: 18.9652,
      lng: 72.8085,
      distance: "7.5 km",
      eta: "22 min",
      phone: "+91-22-66573333",
      facilities: ["24/7 Emergency", "NICU", "Maternity Ward", "ICU", "Blood Bank"],
    },
  ]

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Check if already loaded
      if ((window as any).L) {
        setMapLoaded(true)
        initializeMap()
        return
      }

      // Load CSS
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(cssLink)

      // Load JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        setMapLoaded(true)
        setTimeout(initializeMap, 100)
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current || !(window as any).L) return

      const L = (window as any).L

      // Initialize map
      const map = L.map(mapRef.current).setView([patientLocation.lat, patientLocation.lng], 13)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Patient marker (blue)
      const patientIcon = L.divIcon({
        html: `<div style="background: #2962ff; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); margin-top: 6px; margin-left: 8px; color: white; font-weight: bold;">P</div></div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      L.marker([patientLocation.lat, patientLocation.lng], { icon: patientIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: system-ui; padding: 4px;"><strong>${patient.name}</strong><br/>Current Location</div>`,
        )

      // Hospital markers (red crosses)
      hospitals.forEach((hospital) => {
        const hospitalIcon = L.divIcon({
          html: `<div style="background: #dc2626; width: 32px; height: 32px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="color: white; font-size: 20px; font-weight: bold;">+</div></div>`,
          className: "hospital-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })

        const marker = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon }).addTo(map)

        marker.on("click", () => {
          setSelectedHospital(hospital)
        })

        marker.bindPopup(
          `<div style="font-family: system-ui; padding: 4px;">
            <strong>${hospital.name}</strong><br/>
            <span style="color: #666;">📍 ${hospital.distance} • ⏱️ ${hospital.eta}</span>
          </div>`,
        )

        // Add circle to show coverage area
        L.circle([hospital.lat, hospital.lng], {
          color: "#dc2626",
          fillColor: "#dc2626",
          fillOpacity: 0.1,
          radius: 500,
        }).addTo(map)
      })

      // Fit bounds to show all markers
      const bounds = L.latLngBounds([
        [patientLocation.lat, patientLocation.lng],
        ...hospitals.map((h) => [h.lat, h.lng]),
      ])
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    loadLeaflet()
  }, [])

  return (
    <Card className="p-6 glassmorphism">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Patient Location & Nearby Hospitals</h3>
            <p className="text-sm text-muted-foreground">Real-time location tracking and emergency routing</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <MapPin className="w-3 h-3" />
            Live
          </Badge>
        </div>

        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-lg border border-border overflow-hidden"
          style={{ zIndex: 1 }}
        />

        {/* Hospital Details */}
        {selectedHospital && (
          <Card className="p-4 border border-accent bg-accent/10">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{selectedHospital.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {selectedHospital.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedHospital.eta}
                    </span>
                  </div>
                </div>
                <Button size="sm" className="gap-2" onClick={() => window.open(`tel:${selectedHospital.phone}`)}>
                  <Phone className="w-3 h-3" />
                  Call
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedHospital.facilities.map((facility) => (
                  <Badge key={facility} variant="secondary" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 bg-transparent"
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&origin=${patientLocation.lat},${patientLocation.lng}&destination=${selectedHospital.lat},${selectedHospital.lng}`
                  window.open(url, "_blank")
                }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </Button>
            </div>
          </Card>
        )}

        {/* Hospital List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">All Nearby Hospitals</p>
          <div className="space-y-2">
            {hospitals.map((hospital) => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedHospital?.id === hospital.id
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{hospital.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hospital.distance} • {hospital.eta}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-destructive rounded flex items-center justify-center text-white text-sm font-bold">
                    +
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
