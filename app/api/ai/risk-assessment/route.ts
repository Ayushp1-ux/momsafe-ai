export async function POST(req: Request) {
  try {
    const { patientData } = await req.json()

    // Calculate risk score based on vitals
    let riskScore = 30 // base score
    const bpParts = patientData.vitals.bp.split("/")
    const systolic = Number.parseInt(bpParts[0])
    const diastolic = Number.parseInt(bpParts[1])

    if (systolic > 140 || diastolic > 90) riskScore += 20
    if (systolic > 160 || diastolic > 100) riskScore += 30
    if (patientData.vitals.hr > 100) riskScore += 10
    if (patientData.vitals.spo2 < 95) riskScore += 15
    if (patientData.riskLevel === "High") riskScore += 25
    if (patientData.age > 35) riskScore += 10

    riskScore = Math.min(riskScore, 95) // cap at 95

    const analysis = `RISK ASSESSMENT ANALYSIS

Overall Risk Score: ${riskScore}/100
Classification: ${riskScore > 70 ? "HIGH RISK" : riskScore > 50 ? "MODERATE RISK" : "LOW-MODERATE RISK"}

KEY RISK FACTORS IDENTIFIED:
${systolic > 140 || diastolic > 90 ? "• Elevated blood pressure (" + patientData.vitals.bp + ") - requires immediate attention" : "• Blood pressure within acceptable range"}
${patientData.age > 35 ? "• Advanced maternal age (" + patientData.age + " years)" : ""}
${patientData.riskLevel === "High" ? "• Pre-existing high-risk classification" : ""}
${patientData.vitals.hr > 100 ? "• Elevated heart rate (" + patientData.vitals.hr + " bpm)" : ""}
${patientData.gestationalWeek < 24 ? "• Early gestational age - critical development period" : ""}

IMMEDIATE CONCERNS:
${riskScore > 70 ? "⚠️ HIGH PRIORITY: Close monitoring required\n• Consider hospitalization or increased surveillance\n• Daily vital sign monitoring mandatory" : "✓ No immediate emergency concerns identified"}

SPECIFIC RECOMMENDATIONS:
1. Vital Sign Monitoring
   - Check BP every 4-6 hours
   - Monitor for trends, not just single readings
   - Use proper technique (seated, relaxed, correct cuff size)

2. Symptom Awareness
   - Watch for: severe headaches, visual disturbances, upper abdominal pain
   - Monitor fetal movement (kick counts)
   - Report any vaginal bleeding or fluid leakage immediately

3. Lifestyle Modifications
   - Adequate rest (8-10 hours sleep)
   - Reduce sodium intake
   - Stay well-hydrated
   - Avoid strenuous activities

4. Medical Follow-up
   - Schedule appointment within ${riskScore > 70 ? "24 hours" : riskScore > 50 ? "48-72 hours" : "1 week"}
   - Consider specialist consultation
   - Update care plan based on trends

ESCALATION CRITERIA:
Seek immediate medical attention if:
• BP exceeds 160/110
• Severe persistent headache
• Vision changes or seeing spots
• Severe swelling (face, hands)
• Decreased fetal movement
• Chest pain or severe shortness of breath
• Vaginal bleeding

NEXT ASSESSMENT: ${riskScore > 70 ? "Within 12 hours" : riskScore > 50 ? "Within 24 hours" : "Within 48 hours"}`

    return new Response(JSON.stringify({ analysis }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Risk Assessment Error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate risk assessment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
