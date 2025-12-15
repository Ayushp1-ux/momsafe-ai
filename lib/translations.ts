export const translations = {
  en: {
    dashboard: "Dashboard",
    patients: "Patients",
    riskAssessment: "Risk Assessment",
    vitals: "Vital Signs",
    bloodPressure: "Blood Pressure",
    heartRate: "Heart Rate",
    temperature: "Temperature",
    aiAssistant: "AI Assistant",
    emergency: "Emergency",
    criticalRisk: "Critical Risk Detected",
    moderate: "Moderate",
    high: "High",
    low: "Low",
    critical: "Critical",
    week: "Week",
    years: "years old",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    patients: "मरीज़",
    riskAssessment: "जोखिम मूल्यांकन",
    vitals: "महत्वपूर्ण संकेत",
    bloodPressure: "रक्तचाप",
    heartRate: "हृदय गति",
    temperature: "तापमान",
    aiAssistant: "एआई सहायक",
    emergency: "आपातकाल",
    criticalRisk: "गंभीर जोखिम का पता चला",
    moderate: "मध्यम",
    high: "उच्च",
    low: "निम्न",
    critical: "गंभीर",
    week: "सप्ताह",
    years: "वर्ष की आयु",
  },
}

export type Language = "en" | "hi"

export function translate(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key]
}
