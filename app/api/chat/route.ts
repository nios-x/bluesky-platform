import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt that makes Claude behave like a dumpster rental assistant
const SYSTEM_PROMPT = `You are a smart, friendly dumpster rental assistant for Blue Sky Disposal. Your job is to have a natural conversation with customers to understand their project needs and recommend the right dumpster.

## Key Rules:
1. Be conversational and friendly - NOT robotic or form-like
2. Ask ONE question at a time - never ask multiple questions in one message
3. Listen to what the customer says and ask follow-up questions based on THEIR needs
4. DO NOT ask for ZIP code until you have gathered enough information about their project
5. Only recommend after you understand:
   - What type of project they have (cleanup, renovation, construction, etc.)
   - Approximate volume/size of debris
   - Type of materials (household items, construction debris, concrete, etc.)
   - Whether they have any special requirements

## Information Gathering Flow:
- Start by asking what project they're working on
- Ask follow-up questions about volume, materials, weight
- Suggest the appropriate dumpster size based on their answers
- Only ask for ZIP code as the FINAL step before making recommendation
- After getting ZIP code, provide recommendation with confidence

## Dumpster Sizing Guide:
- 10 Yard: Small cleanup, garage cleanout, light household junk
- 15 Yard: Medium renovation, moderate cleanup, mixed materials
- 20 Yard: Large renovation, construction debris, significant cleanup
- 30 Yard: Major construction projects, demolition, heavy materials

## Response Format:
Always respond naturally as a conversational assistant. If you have enough info and need ZIP, mention it in conversation.
If you have all info including ZIP, you may include a structured recommendation at the end if appropriate.

Keep responses short (1-3 sentences typically) to maintain conversation flow.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
  zipCode?: string;
  projectInfo?: Record<string, any>;
}

interface ChatResponse {
  reply: string;
  type: 'text' | 'recommendation' | 'waiting_for_zip';
  recommendation?: {
    size: number;
    type: string;
    reason: string;
    price?: number;
  };
  needsZipCode?: boolean;
}

/**
 * Helper function to determine if we have enough project information
 */
function hasEnoughProjectInfo(messages: Message[]): boolean {
  const conversationText = messages.map(m => m.content).join(' ').toLowerCase();
  
  // Check for project type indicators
  const hasProjectType = /project|cleanup|renovation|construction|garage|basement|garden|yard|junk|debris|demolition/.test(conversationText);
  
  // Check for volume/size indicators
  const hasVolumeInfo = /full|entire|lot of|lots of|small|medium|large|multiple|one|two|three|several|quite a bit|ton of|bunch|heap|pile|load/i.test(conversationText);
  
  // Check for material type indicators
  const hasMaterialInfo = /wood|metal|concrete|brick|drywall|tile|appliance|furniture|household|construction|material|stuff|item|junk|rubble|debris/i.test(conversationText);
  
  return hasProjectType && hasVolumeInfo && hasMaterialInfo;
}

/**
 * Helper function to determine recommended dumpster size
 */
function recommendDumpsterSize(conversationText: string): number {
  const lower = conversationText.toLowerCase();
  
  // Heavy materials = bigger dumpster needed
  if (/concrete|brick|demolition|heavy|tons/i.test(lower)) {
    if (/demolition|major|whole|large|significant/i.test(lower)) {
      return 30;
    }
    return 20;
  }
  
  // Volume/space indicators
  if (/entire house|whole house|full truck|30|major|large|significant/i.test(lower)) {
    return 30;
  }
  
  if (/garage|basement|attic|medium|quite a bit|multiple/i.test(lower)) {
    return 20;
  }
  
  if (/small|little|few|light|single room/i.test(lower)) {
    return 10;
  }
  
  // Default to 20 yard if unclear
  return 20;
}

/**
 * POST /api/chat
 * 
 * Multi-turn conversational endpoint using Claude API
 * 
 * Request body:
 * {
 *   messages: Array<{role: 'user' | 'assistant', content: string}>,
 *   zipCode?: string,
 *   projectInfo?: object
 * }
 * 
 * Response:
 * {
 *   reply: string,
 *   type: 'text' | 'recommendation' | 'waiting_for_zip',
 *   recommendation?: {...},
 *   needsZipCode?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    // Validate input
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { reply: 'Invalid request format', type: 'text' },
        { status: 400 }
      );
    }

    if (body.messages.length === 0) {
      return NextResponse.json(
        { reply: 'Please send a message', type: 'text' },
        { status: 400 }
      );
    }

    // Format messages for Claude API (last 10 messages for context)
    const recentMessages = body.messages.slice(-10);

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    // Extract the reply
    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Check if we have enough information and if ZIP code is present
    const hasEnoughInfo = hasEnoughProjectInfo(recentMessages);
    const hasZipCode = body.zipCode && /\d{5}/.test(body.zipCode);

    let responseType: 'text' | 'recommendation' | 'waiting_for_zip' = 'text';
    let recommendation: ChatResponse['recommendation'] | undefined;

    // If we have enough info and ZIP code, make recommendation
    if (hasEnoughInfo && hasZipCode) {
      responseType = 'recommendation';
      const recommendedSize = recommendDumpsterSize(
        recentMessages.map(m => m.content).join(' ')
      );

      recommendation = {
        size: recommendedSize,
        type: recommendedSize === 10 ? 'Standard' : recommendedSize === 20 ? 'Roll-Off' : 'Premium',
        reason: 'Based on your project details and materials',
        price: recommendedSize * 50, // Placeholder pricing
      };
    } else if (hasEnoughInfo && !hasZipCode) {
      responseType = 'waiting_for_zip';
    }

    return NextResponse.json({
      reply: assistantMessage,
      type: responseType,
      recommendation,
      needsZipCode: hasEnoughInfo && !hasZipCode,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        reply: 'Sorry, I encountered an error. Please try again.',
        type: 'text',
      },
      { status: 500 }
    );
  }
}
