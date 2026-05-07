import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are an intelligent and friendly dumpster rental assistant for a waste disposal company.

Your goal is to have a NATURAL, CONVERSATIONAL dialogue with customers to understand their cleanup or demolition project and recommend the right dumpster size.

IMPORTANT CONVERSATIONAL RULES:
- Ask ONE question at a time, never multiple questions
- Be friendly and conversational, not robotic
- Understand project details slowly through natural conversation
- Do NOT ask for ZIP code until you have enough project information
- Do NOT jump to recommendations too quickly

CONVERSATION FLOW:
1. Start by understanding the project type (garage cleanup, renovation, junk removal, etc.)
2. Ask about the volume/amount of debris
3. Ask about material types (furniture, concrete, wood, metal, etc.)
4. Ask about the location/ZIP code when ready to recommend
5. Only recommend after gathering sufficient information

WHEN TO RECOMMEND:
Only provide a dumpster recommendation when you have:
- Clear understanding of project type
- Approximate amount of debris
- Material types involved
- Customer's ZIP code

RECOMMENDATION FORMAT:
When recommending, return a recommendation object.

RESPONSE FORMAT:
Always respond naturally as if chatting with a customer. Your response will be parsed and formatted by the system.`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, imageBase64 } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Conversation history is required" },
        { status: 400 },
      );
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 },
      );
    }

    // Build messages array for Claude
    const claudeMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // If image is provided, append it to the latest user message
    if (
      imageBase64 &&
      claudeMessages[claudeMessages.length - 1]?.role === "user"
    ) {
      claudeMessages[claudeMessages.length - 1].content = [
        {
          type: "text",
          text: claudeMessages[claudeMessages.length - 1].content,
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: imageBase64.replace(/^data:image\/[^;]+;base64,/, ""),
          },
        },
      ];
    }

    // Call Anthropic API
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: claudeMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to process request" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const aiReply = data.content[0]?.text || "";

    // Let AI handle recommendations naturally through conversation
    // No forced recommendation parsing
    return NextResponse.json({
      success: true,
      reply: aiReply,
      type: "text",
      recommendation: null,
    });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate response",
      },
      { status: 500 },
    );
  }
}
