import { NextResponse } from "next/server"

let healthData = {
  neurodegenerativeRisk: {
    percentage: 18,
    description: "Low risk based on current data",
    trend: "stable",
  },
  chronicDiseaseMarkers: {
    percentage: 32,
    description: "Slightly elevated inflammation markers",
    trend: "needs_attention",
  },
  overallScore: {
    score: 78,
    insight: "Good, but focus on reducing inflammation.",
    factors: [
      { name: "Sleep Quality", score: 85 },
      { name: "Physical Activity", score: 70 },
      { name: "Stress Levels", score: 65 },
      { name: "Nutrition Balance", score: 80 },
    ],
  },
  vitalSigns: {
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: "37.0°C",
    oxygenSaturation: 98,
  },
}

export async function GET() {
  // Simulate some minor data fluctuations
  healthData.neurodegenerativeRisk.percentage = Math.max(
    10,
    Math.min(90, healthData.neurodegenerativeRisk.percentage + Math.floor(Math.random() * 5) - 2)
  )
  healthData.chronicDiseaseMarkers.percentage = Math.max(
    10,
    Math.min(90, healthData.chronicDiseaseMarkers.percentage + Math.floor(Math.random() * 5) - 2)
  )
  healthData.overallScore.score = Math.max(
    50,
    Math.min(95, healthData.overallScore.score + Math.floor(Math.random() * 3) - 1)
  )

  return NextResponse.json(healthData)
}

export async function POST(req: Request) {
  const { symptoms } = await req.json()

  // Simple logic to adjust health data based on symptoms
  if (symptoms.includes("headache")) {
    healthData.neurodegenerativeRisk.percentage = Math.min(90, healthData.neurodegenerativeRisk.percentage + 5)
  }
  if (symptoms.includes("fatigue")) {
    healthData.chronicDiseaseMarkers.percentage = Math.min(90, healthData.chronicDiseaseMarkers.percentage + 7)
    healthData.overallScore.score = Math.max(50, healthData.overallScore.score - 3)
  }
  if (symptoms.includes("dizziness")) {
    healthData.neurodegenerativeRisk.percentage = Math.min(90, healthData.neurodegenerativeRisk.percentage + 8)
    healthData.overallScore.score = Math.max(50, healthData.overallScore.score - 5)
  }

  // Update trends based on changes
  healthData.neurodegenerativeRisk.trend =
    healthData.neurodegenerativeRisk.percentage > 30 ? "needs_attention" : "stable"
  healthData.chronicDiseaseMarkers.trend =
    healthData.chronicDiseaseMarkers.percentage > 40 ? "needs_attention" : "stable"

  return NextResponse.json(healthData)
}
