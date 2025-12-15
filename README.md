# MomSafe AI - Maternal Health Monitoring Dashboard

An advanced AI-powered maternal health monitoring system designed for high-risk pregnancies. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and **powered by Claude AI (Anthropic)**.

## Features

### 1. **Real-Time Patient Monitoring**
- Live vital signs tracking (Blood Pressure, Heart Rate, SpO2, Temperature)
- Interactive patient sidebar with search and filtering
- Risk-based color coding and visual indicators
- Auto-refreshing data streams

### 2. **ML Model Explainability Panel**
- Feature importance visualization using bar charts
- SHAP-style contribution analysis
- Interactive "What-If" simulator with adjustable vitals
- Real-time risk score recalculation
- Decision tree path visualization

### 3. **Predictive Timeline**
- 7-day health outlook with confidence intervals
- Predicted vital signs and risk scores
- Timeline view showing progression to delivery date
- Uncertainty ranges for predictions
- AI-powered recommendations

### 4. **Voice Interface**
- Floating microphone button for hands-free interaction
- Real-time speech-to-text transcription
- AI-powered voice responses
- Waveform animation during listening
- Symptom detection and emergency alerts

### 5. **Comparative Analytics**
- Side-by-side comparison with similar cases
- Anonymized patient profiles
- Outcome statistics and predictions
- Success rate visualization
- AI insights based on historical data

### 6. **Medical Team Collaboration**
- Real-time collaboration indicators
- Shared notes timeline with tagging
- Care team member status tracking
- Message threading with @mentions
- Activity timestamps

### 7. **Health Score Tracking**
- Gamified pregnancy health score (0-100)
- Weekly progress charts
- Score breakdown by category
- Achievement badges system
- Motivational messages

### 8. **Emergency Response System**
- Automatic critical risk detection
- Ambulance dispatch simulation
- Hospital notification with map
- Emergency contact calling
- Step-by-step protocol checklist
- Real-time ETA countdown

### 9. **Multilingual Support**
- English and Hindi language toggle
- Translated UI elements
- Localized AI chat responses
- Persistent language preference

### 10. **Real AI Integration (Claude by Anthropic)**
**All AI features use live API calls - no mock data!**

#### AI-Powered Chat Assistant
- Real conversational AI using Claude 3.5 Sonnet
- Context-aware responses based on patient vitals
- Streaming text responses (word-by-word like ChatGPT)
- Medical expertise in maternal health
- Quick action buttons for common queries
- Error handling with graceful fallbacks

#### Live AI Risk Assessment
- Click "Analyze with AI" for comprehensive analysis
- Claude analyzes: vitals, symptoms, history, gestational age
- Returns: detailed risk factors, immediate concerns, recommendations
- Loading states with spinner animations
- Structured medical-grade output

#### AI Symptom Checker
- Select symptoms from common pregnancy issues
- Real-time AI analysis of symptom combinations
- Urgency classification: IMMEDIATE, URGENT, or ROUTINE
- Warning signs and next steps
- Context-aware based on patient's current state

#### Medical Report Generator
- AI-generated comprehensive medical reports
- Professional formatting suitable for medical records
- Includes: executive summary, vital analysis, risk factors, recommendations
- Downloadable as text file
- Formatted for doctor review

**API Endpoints:**
- `/api/ai/chat` - Streaming chat with patient context
- `/api/ai/risk-assessment` - Detailed risk analysis
- `/api/ai/symptom-checker` - Symptom analysis with urgency levels
- `/api/ai/generate-report` - Professional medical report generation

**AI Features:**
- Uses Vercel AI SDK for streaming and generation
- Claude 3.5 Sonnet model for medical accuracy
- Temperature tuning for consistent medical advice
- Token limits optimized for response quality
- Comprehensive error handling

### 11. **Advanced UI/UX**
- Glassmorphism effects
- Smooth page transitions with Framer Motion
- Loading skeletons for async content
- Custom animations (heartbeat, pulse, waveform)
- Responsive design for all screen sizes
- Accessible keyboard navigation

## Technology Stack

- **Framework**: Next.js 16.0 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1
- **Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts 2.15
- **Animations**: Framer Motion 12.23
- **State Management**: Zustand 5.0
- **Icons**: Lucide React
- **AI Integration**: Vercel AI SDK 5.0 with Claude 3.5 Sonnet (Anthropic)

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard with AI Tools tab
│   ├── api/
│   │   └── ai/
│   │       ├── chat/route.ts           # Streaming AI chat
│   │       ├── risk-assessment/route.ts # Risk analysis
│   │       ├── symptom-checker/route.ts # Symptom analysis
│   │       └── generate-report/route.ts # Report generation
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── dashboard/
│   │   ├── dashboard-header.tsx
│   │   ├── patient-sidebar.tsx
│   │   ├── main-monitoring.tsx
│   │   ├── ai-chat-assistant.tsx        # Real AI chat with streaming
│   │   ├── risk-assessment.tsx          # Live AI risk analysis
│   │   ├── symptom-checker.tsx          # NEW: AI symptom analyzer
│   │   ├── report-generator.tsx         # NEW: AI report generation
│   │   ├── ml-explainability.tsx
│   │   ├── predictive-timeline.tsx
│   │   ├── voice-interface.tsx
│   │   ├── comparative-analytics.tsx
│   │   ├── collaboration-panel.tsx
│   │   ├── health-score.tsx
│   │   ├── emergency-protocol.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── page-transition.tsx
│   │   └── notification-system.tsx
│   ├── ui/                     # shadcn/ui components
│   └── animated-stats.tsx
├── lib/
│   ├── mock-data.ts            # Patient data
│   ├── translations.ts         # i18n strings
│   └── utils.ts
└── hooks/
    └── use-language.ts         # Language preference hook
\`\`\`

## Key Features Detail

### ML Explainability
The AI Reasoning tab provides transparency into how the machine learning model calculates risk scores:
- **Feature Importance**: Visual breakdown showing which factors contribute most (BP: 35%, History: 25%, etc.)
- **Interactive Simulator**: Adjust vitals with sliders to see real-time risk changes
- **Decision Path**: Step-by-step logic showing how the AI arrived at its conclusion

### Predictive Analytics
The system forecasts patient health trajectory:
- Predicts vital signs for next 7-14 days
- Calculates delivery date risk progression
- Shows confidence intervals and uncertainty ranges
- Provides actionable recommendations based on trends

### Emergency Response
Automated emergency protocol activation:
- Detects critical risk levels automatically
- Dispatches virtual ambulance with ETA
- Notifies nearest hospital with patient data
- Calls emergency contacts automatically
- Displays step-by-step emergency checklist

### Collaborative Care
Real-time team coordination:
- Shows who's currently viewing the patient
- Shared notes with medical team tagging
- Activity timeline with timestamps
- Role-based care team management

### Real AI Integration Details

#### How AI Chat Works
1. User types a question about patient vitals
2. System sends message + full patient context to `/api/ai/chat`
3. Claude receives: patient name, age, vitals, risk level, gestational week
4. AI responds as maternal health specialist with streaming text
5. Response appears word-by-word for natural conversation feel

#### How Risk Assessment Works
1. Click "Analyze with AI" button
2. Shows loading animation: "AI is analyzing..."
3. API calls Claude with complete patient data
4. Claude returns structured analysis:
   - Overall risk score (0-100)
   - Key risk factors identified
   - Immediate concerns
   - Monitoring recommendations
   - When to escalate care
5. Response displayed in formatted panel

#### How Symptom Checker Works
1. Select symptoms from checkboxes (headache, vision issues, swelling, etc.)
2. Click "Analyze Symptoms" button
3. AI receives symptoms + patient context
4. Returns:
   - Possible conditions
   - Urgency level classification
   - Warning signs to watch for
   - Recommended next steps
5. Urgent symptoms trigger visual alerts

#### How Report Generator Works
1. Click "Generate Medical Report" button
2. Shows "Generating Report..." with spinner
3. Claude creates comprehensive medical document with sections:
   - Executive Summary
   - Vital Signs Analysis
   - Risk Factors & Concerns
   - Trend Analysis
   - Clinical Recommendations
   - Follow-up Schedule
   - Emergency Indicators
4. Report displays in monospace font for professional look
5. Download button saves as `.txt` file with patient name + date

**AI Model Configuration:**
- **Chat**: Temperature 0.7, Max 500 tokens (conversational)
- **Risk Assessment**: Temperature 0.5, Max 800 tokens (analytical)
- **Symptom Checker**: Temperature 0.3, Max 600 tokens (precise)
- **Report Generator**: Temperature 0.4, Max 1200 tokens (comprehensive)

## Demo Patients

The system includes 5 demo patients with varying risk levels:
1. **Priya Sharma** (28y, Week 32) - Moderate Risk
2. **Anita Desai** (32y, Week 28) - Low Risk
3. **Kavita Patel** (35y, Week 36) - High Risk
4. **Meera Reddy** (26y, Week 24) - Low Risk
5. **Shalini Kumar** (38y, Week 34) - Critical Risk

## Using AI Features

### AI Chat Assistant (Right Sidebar)
- Type questions in the chat input at the bottom
- Use quick action buttons: "Explain Risk", "Compare to Normal", "What Should I Do?"
- AI responds with medical guidance in real-time
- Watch for loading indicator (3 dots) while AI is thinking
- Responses stream word-by-word like ChatGPT

### AI Tools Tab
Navigate to "AI Tools" tab to access:

**Symptom Checker:**
1. Check boxes for symptoms patient is experiencing
2. Selected symptoms appear as badges above button
3. Click "Analyze Symptoms" to get AI analysis
4. Review urgency level and recommendations

**Report Generator:**
1. Click "Generate Medical Report"
2. Wait for AI to create comprehensive report (10-15 seconds)
3. Review formatted medical document
4. Click "Download" to save as text file

### Risk Assessment (Overview Tab)
- Look for "Analyze with AI" button in Risk Assessment card
- Click to get detailed AI analysis of patient's current state
- Review AI-generated risk factors and recommendations
- Use insights to inform clinical decisions

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatible
- Focus visible indicators

## Future Enhancements

- Real backend integration with Supabase/Neon
- Actual speech recognition API for voice interface
- WebRTC for real-time data streaming
- Mobile app with React Native
- Integration with wearable devices (Apple Watch, Fitbit)
- Advanced ML models for better predictions
- Voice-to-voice AI conversations (STT + TTS)
- Multi-modal AI with image analysis for ultrasounds
- Predictive AI for delivery date estimation
- AI-powered anomaly detection in real-time
- Integration with electronic health records (EHR)

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`



