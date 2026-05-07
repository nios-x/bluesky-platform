/**
 * Chat API utilities for Claude-powered conversational AI
 * 
 * These utilities help manage conversation state and interact with the /api/chat endpoint
 */

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
  type: 'text' | 'recommendation' | 'waiting_for_zip'
  recommendation?: {
    size: number
    type: string
    reason: string
    price?: number
  }
  needsZipCode?: boolean
}

/**
 * Send a message to the Claude chat API
 * 
 * @param messages - Array of previous messages in the conversation
 * @param zipCode - Optional ZIP code for the customer
 * @returns Claude's response with reply and metadata
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  zipCode?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        zipCode,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Chat API error:', error)
    throw error
  }
}

/**
 * Determine if the conversation has collected enough project information
 * 
 * @param messages - Array of all messages in conversation
 * @returns true if we have enough info about the project
 */
export function hasEnoughProjectInfo(messages: ChatMessage[]): boolean {
  const conversationText = messages.map(m => m.content).join(' ').toLowerCase()

  const hasProjectType = /project|cleanup|renovation|construction|garage|basement|garden|yard|junk|debris|demolition/.test(
    conversationText
  )

  const hasVolumeInfo = /full|entire|lot of|lots of|small|medium|large|multiple|one|two|three|several|quite a bit|ton of|bunch|heap|pile|load/i.test(
    conversationText
  )

  const hasMaterialInfo = /wood|metal|concrete|brick|drywall|tile|appliance|furniture|household|construction|material|stuff|item|junk|rubble|debris/i.test(
    conversationText
  )

  return hasProjectType && hasVolumeInfo && hasMaterialInfo
}

/**
 * Extract ZIP code from a message or validate an existing one
 * 
 * @param text - Text to search for ZIP code
 * @returns ZIP code if found, otherwise null
 */
export function extractZipCode(text: string): string | null {
  const zipMatch = text.match(/\b(\d{5})(?:-\d{4})?\b/)
  return zipMatch ? zipMatch[1] : null
}

/**
 * Format a dumpster recommendation for display
 * 
 * @param recommendation - The recommendation object from Claude
 * @returns Formatted string for user display
 */
export function formatRecommendation(
  recommendation: ChatResponse['recommendation']
): string {
  if (!recommendation) return ''

  let formatted = `📦 Recommendation: ${recommendation.size} Yard ${recommendation.type} Dumpster\n`
  formatted += `💡 Reason: ${recommendation.reason}\n`

  if (recommendation.price) {
    formatted += `💰 Est. Price: $${recommendation.price.toFixed(2)}`
  }

  return formatted
}

/**
 * Create initial greeting message
 * 
 * @returns Initial bot message
 */
export function getInitialMessage(): ChatMessage {
  return {
    role: 'assistant',
    content:
      "Hi! 👋 Welcome to Blue Sky Disposal. I'm here to help you find the perfect dumpster for your project. What are you working on today?",
  }
}
