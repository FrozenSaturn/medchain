import { NextResponse } from "next/server"
import { useStore } from "@/lib/store"

export async function GET() {
  try {
    // Get data from the store
    const state = useStore.getState()

    // Extract only the necessary data for AI context
    const context = {
      courses: state.courses,
      tasks: state.tasks,
      notes: state.notes,
      focusSessions: state.focusSessions,
      aiConversations: state.aiConversations,
    }

    return NextResponse.json(context)
  } catch (error) {
    console.error("Error fetching user context:", error)
    return NextResponse.json({ error: "Failed to fetch user context" }, { status: 500 })
  }
}
