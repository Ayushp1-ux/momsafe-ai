export async function POST(req: Request) {
  try {
    const { symptoms, patientData } = await req.json()

    // Determine urgency based on symptoms
    const emergencySymptoms = [
      "severe headache",
      "vision changes",
      "chest pain",
      "difficulty breathing",
      "vaginal bleeding",
    ]
    const urgentSymptoms = ["moderate headache", "swelling", "decreased movement", "contractions"]

    const hasEmergency = symptoms.some((s: string) => emergencySymptoms.some((es) => s.toLowerCase().includes(es)))
    const hasUrgent = symptoms.some((s: string) => urgentSymptoms.some((us) => s.toLowerCase().includes(us)))

    const urgency = hasEmergency ? "IMMEDIATE" : hasUrgent ? "URGENT" : "ROUTINE"

    const analysis = `SYMPTOM ANALYSIS
Patient: ${patientData.name} (${patientData.gestationalWeek} weeks)

Reported Symptoms:
${symptoms.map((s: string) => "• " + s).join("\n")}

URGENCY LEVEL: ${urgency}
${urgency === "IMMEDIATE" ? "🚨 GO TO EMERGENCY ROOM NOW" : urgency === "URGENT" ? "⚠️ CONTACT DOCTOR TODAY" : "✓ MONITOR AND DISCUSS AT NEXT VISIT"}

POSSIBLE CONDITIONS:
${
  hasEmergency
    ? `• Preeclampsia/Eclampsia - severe symptoms present
• Placental abruption risk
• Cardiac or respiratory emergency
These are serious pregnancy complications requiring immediate evaluation.`
    : hasUrgent
      ? `• Early signs of preeclampsia
• Preterm labor symptoms
• Urinary tract infection
• Normal pregnancy discomforts requiring monitoring`
      : `• Common pregnancy symptoms
• Normal physiological changes
• Minor discomforts typical for gestational age`
}

WARNING SIGNS TO WATCH:
${
  urgency !== "IMMEDIATE"
    ? `Monitor for development of:
• Severe persistent headache that doesn't improve with rest
• Visual changes (blurred vision, seeing spots, light sensitivity)
• Upper abdominal pain (especially right upper quadrant)
• Sudden severe swelling of face or hands
• Less than 10 fetal movements in 2 hours
• Regular contractions before 37 weeks
• Any vaginal bleeding or fluid leakage`
    : "Proceed to emergency care immediately - do not wait to monitor symptoms"
}

RECOMMENDED NEXT STEPS:
${
  urgency === "IMMEDIATE"
    ? `1. GO TO EMERGENCY ROOM IMMEDIATELY
2. Call ambulance if unable to transport safely (911)
3. Bring prenatal records if available
4. Do not eat or drink (in case procedure needed)
5. Have someone accompany you if possible`
    : urgency === "URGENT"
      ? `1. Contact your OB/GYN or maternal-fetal medicine doctor today
2. Be prepared to go in for evaluation
3. Monitor symptoms closely and track any changes
4. Rest and stay hydrated while awaiting guidance
5. Have someone available to drive you if needed`
      : `1. Document symptoms (when they started, frequency, severity)
2. Try comfort measures (rest, hydration, positioning)
3. Discuss at your next scheduled appointment
4. Contact provider if symptoms worsen or new symptoms develop
5. Continue regular prenatal care and monitoring`
}

WHEN TO ESCALATE:
Call 911 or go to ER immediately if you develop:
• Chest pain or severe difficulty breathing
• Seizure or loss of consciousness
• Severe bleeding (soaking pad in less than 1 hour)
• Severe unrelenting pain
• Signs of shock (pale, clammy, rapid pulse)`

    return new Response(JSON.stringify({ analysis }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Symptom Checker Error:", error)
    return new Response(JSON.stringify({ error: "Failed to analyze symptoms" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
