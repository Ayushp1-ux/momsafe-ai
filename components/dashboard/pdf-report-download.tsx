"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import type { Patient } from "@/lib/mock-data"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface PDFReportDownloadProps {
  patient: Patient
}

export function PDFReportDownload({ patient }: PDFReportDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      let yPosition = margin

      // Header - Medical Document Styling
      pdf.setFillColor(41, 98, 255)
      pdf.rect(0, 0, pageWidth, 35, "F")

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont("helvetica", "bold")
      pdf.text("MomSafe AI", margin, 20)

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text("Maternal Health Monitoring Report", margin, 28)

      yPosition = 45

      // Patient Information Section
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("PATIENT INFORMATION", margin, yPosition)
      yPosition += 8

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(60, 60, 60)

      const patientInfo = [
        `Name: ${patient.name}`,
        `Age: ${patient.age} years`,
        `Gestational Week: ${patient.gestationalWeek}`,
        `Risk Level: ${patient.riskLevel}`,
        `Last Updated: ${patient.lastActivity}`,
        `Report Generated: ${new Date().toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "short",
        })}`,
      ]

      patientInfo.forEach((info) => {
        pdf.text(info, margin, yPosition)
        yPosition += 6
      })

      yPosition += 5

      // Vital Signs Section
      pdf.setFillColor(240, 240, 240)
      pdf.rect(margin, yPosition - 3, pageWidth - margin * 2, 8, "F")

      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("CURRENT VITAL SIGNS", margin + 2, yPosition + 3)
      yPosition += 12

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      const vitals = [
        { label: "Blood Pressure", value: patient.vitals.bp + " mmHg", status: "Normal Range" },
        { label: "Heart Rate", value: patient.vitals.hr + " BPM", status: "Normal Range" },
        { label: "Oxygen Saturation", value: patient.vitals.spo2 + "%", status: "Excellent" },
        { label: "Temperature", value: patient.vitals.temp + "°F", status: "Normal" },
      ]

      vitals.forEach((vital) => {
        pdf.setTextColor(60, 60, 60)
        pdf.text(vital.label + ":", margin + 5, yPosition)
        pdf.setFont("helvetica", "bold")
        pdf.text(vital.value, margin + 60, yPosition)
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(0, 150, 0)
        pdf.text(vital.status, margin + 90, yPosition)
        yPosition += 7
      })

      yPosition += 5

      // Capture Charts
      const chartElements = document.querySelectorAll(".glassmorphism")
      if (chartElements.length > 0) {
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text("VITAL TRENDS (24 HOURS)", margin, yPosition)
        yPosition += 8

        try {
          const chartElement = chartElements[0] as HTMLElement

          // Clone the element to avoid modifying the original
          const clonedElement = chartElement.cloneNode(true) as HTMLElement

          // Create a temporary container with RGB colors
          const tempContainer = document.createElement("div")
          tempContainer.style.position = "absolute"
          tempContainer.style.left = "-9999px"
          tempContainer.style.top = "0"
          tempContainer.style.width = chartElement.offsetWidth + "px"
          tempContainer.style.height = chartElement.offsetHeight + "px"
          tempContainer.style.background = "#1a1f3a"
          tempContainer.style.borderRadius = "12px"
          tempContainer.style.padding = "16px"
          document.body.appendChild(tempContainer)
          tempContainer.appendChild(clonedElement)

          // Override all oklch colors with RGB equivalents
          const allElements = tempContainer.querySelectorAll("*")
          allElements.forEach((el) => {
            const element = el as HTMLElement
            const computedStyle = window.getComputedStyle(element)

            // Convert background colors
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes("oklch")) {
              element.style.backgroundColor = "rgb(26, 31, 58)"
            }

            // Convert text colors
            if (computedStyle.color && computedStyle.color.includes("oklch")) {
              element.style.color = "rgb(255, 255, 255)"
            }

            // Convert border colors
            if (computedStyle.borderColor && computedStyle.borderColor.includes("oklch")) {
              element.style.borderColor = "rgba(255, 255, 255, 0.1)"
            }
          })

          const canvas = await html2canvas(tempContainer, {
            backgroundColor: "#1a1f3a",
            scale: 2,
            logging: false,
            allowTaint: true,
            useCORS: true,
          })

          // Clean up temporary container
          document.body.removeChild(tempContainer)

          const imgData = canvas.toDataURL("image/png")
          const imgWidth = pageWidth - margin * 2
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }

          pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 10
        } catch (error) {
          console.error("Error capturing chart:", error)
          // Continue without the chart if capture fails
          pdf.setFontSize(10)
          pdf.setTextColor(150, 150, 150)
          pdf.text("(Chart visualization could not be captured)", margin, yPosition)
          yPosition += 10
        }
      }

      // Risk Assessment Section
      if (yPosition > pageHeight - 60) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFillColor(240, 240, 240)
      pdf.rect(margin, yPosition - 3, pageWidth - margin * 2, 8, "F")

      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("RISK ASSESSMENT", margin + 2, yPosition + 3)
      yPosition += 12

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(60, 60, 60)

      const riskFactors =
        patient.riskLevel === "CRITICAL" || patient.riskLevel === "HIGH"
          ? [
              "Elevated blood pressure detected",
              "Increased heart rate variability",
              "Requires immediate medical attention",
              "Recommend hospitalization monitoring",
            ]
          : ["All vitals within normal ranges", "Regular monitoring recommended", "Continue prenatal care schedule"]

      riskFactors.forEach((factor) => {
        pdf.text("• " + factor, margin + 5, yPosition)
        yPosition += 6
      })

      yPosition += 10

      // Recommendations
      pdf.setFillColor(240, 240, 240)
      pdf.rect(margin, yPosition - 3, pageWidth - margin * 2, 8, "F")

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("RECOMMENDATIONS", margin + 2, yPosition + 3)
      yPosition += 12

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      const recommendations = [
        "Continue daily monitoring of blood pressure",
        "Maintain hydration - minimum 8 glasses of water daily",
        "Rest with left lateral position for optimal blood flow",
        "Follow prescribed medication schedule",
        "Next checkup scheduled in 48 hours",
      ]

      recommendations.forEach((rec) => {
        pdf.text("• " + rec, margin + 5, yPosition)
        yPosition += 6
      })

      // Footer
      const footerY = pageHeight - 20
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

      pdf.setTextColor(120, 120, 120)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "italic")
      pdf.text(
        "This report is generated by MomSafe AI and should be reviewed by a qualified healthcare professional.",
        margin,
        footerY,
      )
      pdf.text(`Document ID: MSA-${patient.id}-${Date.now()}`, margin, footerY + 5)
      pdf.text(`Page 1 of ${pdf.getNumberOfPages()}`, pageWidth - margin - 20, footerY + 5)

      // Save PDF
      pdf.save(`MomSafe_Report_${patient.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download Medical Report
        </>
      )}
    </Button>
  )
}
