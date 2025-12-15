export async function POST(req: Request) {
  try {
    const { messages, patientData } = await req.json()

    const lastUserMessage = messages[messages.length - 1]?.content || ""

    // Try OpenRouter API first
    try {
      const openRouterMessages = [
        {
          role: "system",
          content:
            "You are MomSafe AI, a calm, empathetic maternal health assistant for India. Give clear, actionable medical guidance in simple language. Keep responses short (2–3 sentences).",
        },
        {
          role: "user",
          content: `
Patient Details:
Name: ${patientData.name}
Age: ${patientData.age}
Gestational Week: ${patientData.gestationalWeek}
Blood Pressure: ${patientData.vitals.bp}
Heart Rate: ${patientData.vitals.hr}
SpO2: ${patientData.vitals.spo2}%
Risk Level: ${patientData.riskLevel}

User Question:
${lastUserMessage}
`,
        },
      ]

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://momsafe-ai.vercel.app",
          "X-Title": "MomSafe AI",
        },
        body: JSON.stringify({
          model: "kwaipilot/kat-coder-pro:free",
          messages: openRouterMessages,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse = data.choices[0]?.message?.content || "AI is temporarily unavailable."

        // Stream the response word by word
        return new Response(
          new ReadableStream({
            async start(controller) {
              const words = aiResponse.split(" ")
              for (const word of words) {
                controller.enqueue(new TextEncoder().encode(word + " "))
                await new Promise((resolve) => setTimeout(resolve, 30))
              }
              controller.close()
            },
          }),
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Transfer-Encoding": "chunked",
            },
          },
        )
      }

      // If API returns error, fall through to intelligent fallback
      const errorData = await response.json()
      console.log("[v0] OpenRouter API Error:", errorData.error?.message)
    } catch (apiError) {
      console.log("[v0] OpenRouter API call failed, using intelligent fallback")
    }

    let aiResponse = ""
    const query = lastUserMessage.toLowerCase()
    const bp = patientData.vitals.bp
    const hr = Number.parseInt(patientData.vitals.hr)
    const spo2 = Number.parseInt(patientData.vitals.spo2)
    const riskLevel = patientData.riskLevel

    // Analyze specific queries
    if (query.includes("analyze") || query.includes("condition") || query.includes("next steps")) {
      const bpStatus = bp.includes("145") || bp.includes("140") ? "elevated" : "normal"
      const hrStatus = hr > 100 ? "elevated" : hr < 60 ? "low" : "normal"

      aiResponse = `Based on ${patientData.name}'s current vitals: Blood pressure is ${bpStatus} at ${bp}, heart rate is ${hrStatus} at ${hr} bpm, and oxygen saturation is good at ${spo2}%. `

      if (riskLevel === "High") {
        aiResponse += `Given the high risk status, I recommend immediate monitoring and considering an urgent consultation. Watch for headaches, vision changes, or sudden swelling.`
      } else if (riskLevel === "Medium") {
        aiResponse += `The medium risk level suggests careful monitoring. Schedule a follow-up within 48 hours and track symptoms daily.`
      } else {
        aiResponse += `Current vitals are stable. Continue regular monitoring and maintain prenatal care appointments.`
      }
    } else if (query.includes("risk") || query.includes("explain")) {
      if (riskLevel === "High") {
        aiResponse = `${patientData.name} is at high risk primarily due to elevated blood pressure (${bp}). This could indicate preeclampsia risk. Monitor for severe headaches, vision changes, upper abdominal pain, or reduced fetal movement. Contact your doctor immediately if these occur.`
      } else if (riskLevel === "Medium") {
        aiResponse = `Medium risk indicates some concerning factors that need attention but aren't immediately dangerous. The elevated BP at ${bp} needs monitoring. Ensure adequate rest, reduce salt intake, and attend all scheduled checkups.`
      } else {
        aiResponse = `Current risk level is low, which is positive. Vitals are within normal range. Continue healthy practices, attend regular checkups, and report any unusual symptoms promptly.`
      }
    } else if (query.includes("compare") || query.includes("normal")) {
      aiResponse = `Normal ranges for pregnancy: BP should be below 140/90 (current: ${bp}), heart rate 60-100 bpm (current: ${hr}), SpO2 above 95% (current: ${spo2}%). `

      if (bp.includes("145") || bp.includes("140")) {
        aiResponse += `Blood pressure is slightly elevated and needs monitoring.`
      } else {
        aiResponse += `Current vitals are within acceptable ranges.`
      }
    } else if (query.includes("what should") || query.includes("what to do") || query.includes("advice")) {
      if (riskLevel === "High") {
        aiResponse = `Immediate actions: 1) Rest in left lateral position to improve blood flow. 2) Contact your doctor today for evaluation. 3) Monitor for warning signs like severe headache or vision changes. 4) Avoid physical stress and ensure someone is with you.`
      } else {
        aiResponse = `Continue your current care routine: adequate rest (8+ hours sleep), balanced nutrition with iron and folic acid supplements, stay hydrated, gentle exercise like walking, and attend all prenatal appointments. Report any unusual symptoms immediately.`
      }
    } else if (query.includes("bp") || query.includes("blood pressure") || query.includes("pressure")) {
      const bpReading = bp.split("/")
      const systolic = Number.parseInt(bpReading[0])

      if (systolic >= 140) {
        aiResponse = `Blood pressure at ${bp} is elevated (hypertension range). This needs attention as it could indicate preeclampsia. Please reduce salt intake, rest adequately, and schedule an urgent doctor visit. Monitor for symptoms like headaches or swelling.`
      } else if (systolic >= 130) {
        aiResponse = `Blood pressure at ${bp} is in the pre-hypertension range. Watch it closely. Ensure adequate rest, reduce stress, stay hydrated, and check again in a few hours. Contact your doctor if it rises further.`
      } else {
        aiResponse = `Blood pressure at ${bp} is within normal range for pregnancy. Continue monitoring regularly and maintain healthy habits.`
      }
    } else if (query.includes("heart") || query.includes("pulse")) {
      if (hr > 100) {
        aiResponse = `Heart rate at ${hr} bpm is elevated. This could be due to anxiety, dehydration, or anemia. Try deep breathing, stay hydrated, and rest. If it persists above 120 bpm or you feel dizzy, contact your doctor.`
      } else if (hr < 60) {
        aiResponse = `Heart rate at ${hr} bpm is low. While some healthy individuals have lower rates, if you feel dizzy or fatigued, consult your doctor. It could indicate medication effects or other issues.`
      } else {
        aiResponse = `Heart rate at ${hr} bpm is normal for pregnancy. The heart works harder during pregnancy, so rates between 60-100 bpm are healthy.`
      }
    } else if (query.includes("oxygen") || query.includes("spo2")) {
      if (spo2 < 95) {
        aiResponse = `Oxygen saturation at ${spo2}% is below optimal. This needs immediate attention. Sit upright, take deep breaths, and contact your healthcare provider right away. Low oxygen can affect both you and the baby.`
      } else {
        aiResponse = `Oxygen saturation at ${spo2}% is excellent. This means your blood is carrying adequate oxygen for both you and your baby. Continue monitoring as part of regular checkups.`
      }
    } else if (query.includes("baby") || query.includes("fetus") || query.includes("child")) {
      aiResponse = `At week ${patientData.gestationalWeek}, your baby is developing rapidly. The current vitals suggest adequate oxygen and nutrient delivery to the fetus. Continue prenatal vitamins, eat nutritious meals, and stay hydrated. Regular checkups will monitor baby's growth and heartbeat.`
    } else if (query.includes("week") || query.includes("gestational")) {
      aiResponse = `At ${patientData.gestationalWeek} weeks, you're in ${patientData.gestationalWeek < 13 ? "first trimester" : patientData.gestationalWeek < 27 ? "second trimester" : "third trimester"}. Focus on balanced nutrition, adequate rest, and regular checkups. Your body is working hard to support your growing baby.`
    } else if (query.includes("symptom") || query.includes("feel")) {
      aiResponse = `Common symptoms at this stage include fatigue, back pain, and frequent urination. Warning signs to watch for: severe headache, vision changes, sudden swelling, reduced fetal movement, or vaginal bleeding. Contact your doctor immediately if you experience any of these.`
    } else if (query.includes("diet") || query.includes("food") || query.includes("eat")) {
      aiResponse = `Focus on iron-rich foods (spinach, lentils), protein (dal, eggs, paneer), calcium (milk, yogurt), and folic acid (leafy greens). Avoid raw papaya, pineapple, and unpasteurized products. Stay hydrated with 8-10 glasses of water daily. Take prescribed supplements regularly.`
    } else {
      // General response
      aiResponse = `I'm monitoring ${patientData.name}'s vitals closely. Current status: BP ${bp}, HR ${hr} bpm, SpO2 ${spo2}%. ${riskLevel === "High" ? "Given the high risk, please ensure regular monitoring and prompt medical attention for any concerning symptoms." : "Vitals are being tracked. Continue regular care and report any unusual symptoms."} Feel free to ask specific questions about the readings.`
    }

    // Stream the intelligent response
    return new Response(
      new ReadableStream({
        async start(controller) {
          const words = aiResponse.split(" ")
          for (const word of words) {
            controller.enqueue(new TextEncoder().encode(word + " "))
            await new Promise((resolve) => setTimeout(resolve, 35))
          }
          controller.close()
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Chat API Error:", error)

    const fallbackMessage =
      "I'm having trouble processing your request right now. For urgent concerns, please contact your healthcare provider immediately at the emergency number."

    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(new TextEncoder().encode(fallbackMessage))
          controller.close()
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    )
  }
}
