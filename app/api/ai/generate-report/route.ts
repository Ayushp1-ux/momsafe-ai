export async function POST(req: Request) {
  try {
    const { patientData } = await req.json()

    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const report = `MATERNAL HEALTH MONITORING REPORT
Generated: ${date}

═══════════════════════════════════════════════════════

1. EXECUTIVE SUMMARY

Patient ${patientData.name}, a ${patientData.age}-year-old individual at ${patientData.gestationalWeek} weeks gestation, is currently classified as ${patientData.riskLevel} risk. Current vital signs monitoring shows stable readings with blood pressure at ${patientData.vitals.bp} mmHg, heart rate ${patientData.vitals.hr} bpm, and oxygen saturation ${patientData.vitals.spo2}%. Continued close monitoring is recommended given the risk classification.

═══════════════════════════════════════════════════════

2. PATIENT INFORMATION

Full Name: ${patientData.name}
Age: ${patientData.age} years
Gestational Age: ${patientData.gestationalWeek} weeks (approximately ${Math.floor(patientData.gestationalWeek / 4)} months)
Risk Classification: ${patientData.riskLevel}
Report Date: ${date}

═══════════════════════════════════════════════════════

3. VITAL SIGNS ANALYSIS

Current Readings:
┌─────────────────────┬──────────────┬──────────────┐
│ Parameter           │ Current      │ Normal Range │
├─────────────────────┼──────────────┼──────────────┤
│ Blood Pressure      │ ${patientData.vitals.bp.padEnd(12)} │ <140/90      │
│ Heart Rate          │ ${patientData.vitals.hr + " bpm".padEnd(12)} │ 60-100 bpm   │
│ Oxygen Saturation   │ ${patientData.vitals.spo2}%          │ >95%         │
│ Temperature         │ ${patientData.vitals.temp}°F        │ 97.0-99.0°F  │
└─────────────────────┴──────────────┴──────────────┘

Interpretation:
• Blood Pressure: ${Number.parseInt(patientData.vitals.bp.split("/")[0]) > 140 ? "ELEVATED - Requires immediate attention and frequent monitoring" : Number.parseInt(patientData.vitals.bp.split("/")[0]) > 120 ? "BORDERLINE - Close monitoring recommended" : "NORMAL - Continue routine monitoring"}
• Heart Rate: ${patientData.vitals.hr > 100 ? "ELEVATED - Assess for causes (anxiety, infection, anemia)" : "NORMAL - Within expected pregnancy range"}
• Oxygen Saturation: ${patientData.vitals.spo2 < 95 ? "LOW - Requires evaluation for respiratory issues" : "NORMAL - Adequate oxygenation"}
• Temperature: ${patientData.vitals.temp > 100.4 ? "FEVER PRESENT - Rule out infection" : "NORMAL - No fever detected"}

═══════════════════════════════════════════════════════

4. RISK FACTORS & CONCERNS

Primary Risk Factors:
${patientData.riskLevel === "High" ? "• HIGH RISK pregnancy classification\n• Requires intensive monitoring and specialist care" : "• Current risk level requires standard enhanced monitoring"}
${patientData.age > 35 ? "• Advanced maternal age (>35 years)\n• Increased risk for chromosomal abnormalities and complications" : ""}
${patientData.gestationalWeek < 24 ? "• Early gestational age - critical development period" : patientData.gestationalWeek > 37 ? "• Term pregnancy - monitor for signs of labor" : ""}

Clinical Concerns:
${Number.parseInt(patientData.vitals.bp.split("/")[0]) > 140 ? "• PRIORITY: Hypertension - Risk for preeclampsia" : "• Blood pressure within acceptable limits"}
${patientData.vitals.hr > 100 ? "• Tachycardia noted - monitor for underlying causes" : ""}
• Continuous assessment for preeclampsia indicators
• Fetal growth and development monitoring
• Preterm labor risk assessment

═══════════════════════════════════════════════════════

5. TREND ANALYSIS

Based on current data point:
• Vital signs appear stable at this assessment
• ${patientData.riskLevel} risk status maintained
• Recommend establishing baseline trends with more frequent readings
• Compare future readings against current baseline

Monitoring Frequency Recommendation:
${patientData.riskLevel === "High" ? "• Blood pressure: Every 4-6 hours\n• Fetal monitoring: Daily NST\n• Provider visits: Twice weekly" : "• Blood pressure: Every 8-12 hours\n• Fetal monitoring: Twice weekly\n• Provider visits: Weekly"}

═══════════════════════════════════════════════════════

6. CLINICAL RECOMMENDATIONS

Immediate Actions:
1. Continue current monitoring protocol
2. Patient education on warning signs
3. Ensure 24/7 access to medical support
4. ${Number.parseInt(patientData.vitals.bp.split("/")[0]) > 140 ? "URGENT: Initiate hypertension management protocol" : "Maintain routine care schedule"}

Monitoring Plan:
• Vital signs: ${patientData.riskLevel === "High" ? "Every 4-6 hours" : "Twice daily"}
• Weight: Daily (watch for sudden gains >2 lbs/day)
• Urine protein: ${patientData.riskLevel === "High" ? "Daily dipstick" : "Weekly"}
• Fetal movement: Kick counts twice daily
• NST/BPP: ${patientData.riskLevel === "High" ? "Daily" : "Twice weekly"}

Medications/Interventions:
• Prenatal vitamins: Continue as prescribed
• ${Number.parseInt(patientData.vitals.bp.split("/")[0]) > 140 ? "Consider antihypertensive therapy - consult MFM" : "No medication changes indicated at this time"}
• Aspirin 81mg daily (if not already prescribed)
• Consider magnesium supplementation

Lifestyle Modifications:
• Adequate rest: 8-10 hours sleep per night
• Moderate activity: As tolerated, avoid overexertion
• Nutrition: Balanced diet, limit sodium to <2g/day
• Hydration: 8-10 glasses water daily
• Stress reduction: Relaxation techniques, adequate support

═══════════════════════════════════════════════════════

7. FOLLOW-UP SCHEDULE

Next Appointments:
• Provider visit: ${patientData.riskLevel === "High" ? "Within 2-3 days" : "Within 1 week"}
• Ultrasound: ${patientData.gestationalWeek < 24 ? "Anatomy scan if not completed" : "Growth scan within 2 weeks"}
• Laboratory work: CBC, CMP, uric acid, LDH within 1 week
• Specialist consultation: ${patientData.riskLevel === "High" ? "Maternal-Fetal Medicine - URGENT" : "As needed"}

Monitoring Milestones:
• ${patientData.gestationalWeek + 1} weeks: Repeat vital signs assessment
• ${patientData.gestationalWeek + 2} weeks: Full clinical evaluation
• ${patientData.gestationalWeek + 4} weeks: Comprehensive risk reassessment

═══════════════════════════════════════════════════════

8. EMERGENCY INDICATORS

SEEK IMMEDIATE MEDICAL ATTENTION IF:

🚨 Critical Symptoms (Call 911):
• Severe persistent headache unrelieved by medication
• Visual disturbances (blurred vision, seeing spots, light flashes)
• Chest pain or severe difficulty breathing
• Seizure or altered mental status
• Severe vaginal bleeding (soaking pad in <1 hour)
• Sudden severe abdominal pain

⚠️ Urgent Symptoms (Call Provider Immediately):
• Blood pressure >160/110 (if home monitoring available)
• Sudden swelling of face, hands, or feet
• Persistent nausea/vomiting
• Decreased or absent fetal movement
• Regular contractions before 37 weeks
• Severe upper abdominal pain
• Signs of water breaking (fluid leakage)

═══════════════════════════════════════════════════════

PROVIDER SIGNATURE: ______________________________
Date: ${date}

This report is confidential and intended for medical use only.
Patient should retain a copy for personal records.

═══════════════════════════════════════════════════════

MomSafe AI Medical Dashboard | High-Risk Pregnancy Monitoring
Report ID: ${Date.now()} | Generated automatically from clinical data`

    return new Response(JSON.stringify({ report }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Report Generation Error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate report" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
