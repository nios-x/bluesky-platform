import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// Define material and project types
const PROJECT_TYPES = [
  "Home/Garage/Basement Cleanout",
  "Home Remodel",
  "Kitchen or Bathroom Demo",
  "Roofing Project",
  "Siding Tear-Off",
  "Wood Deck Removal",
  "Yard Cleanup / Landscaping",
  "Concrete or Masonry Removal",
  "Other Project",
  "Not Sure Yet",
];

const MATERIAL_TYPES = [
  "Construction Waste",
  "Household Waste",
  "Roofing",
  "Landscape/Leaves/Trees/Broken Stumps",
  "Cardboard",
  "Metal",
  "Other Waste",
  "Heavy Material",
];

const HEAVY_MATERIALS = [
  "Dirt",
  "Brick",
  "Block",
  "Concrete",
  "Rocks",
  "Masonry",
];

// Dumpster availability rules
const DUMPSTER_RULES = {
  ROLL_OFF: { sizes: [10, 20, 30, 40], name: "Roll-Off" },
  RUBBER_WHEEL: { sizes: [10, 20, 30], name: "Rubber Wheel" },
  PERMANENT: { sizes: [2, 4, 6, 8], name: "Permanent" },
};

const SYSTEM_PROMPT = `You are the Blue Sky Disposal Dumpster Expert - a friendly, professional AI assistant helping customers find the perfect dumpster.

YOUR ROLE:
- Guide customers through their project details
- Recommend the right dumpster size and type
- Provide helpful, accurate information
- Be conversational and supportive

CONVERSATION RULES:
1. Ask ONE question at a time
2. Be warm and personable, never robotic
3. Listen carefully to understand their needs
4. Ask clarifying questions naturally

DUMPSTER OPTIONS AVAILABLE:
- Roll-Off: 10, 20, 30, 40 yards
- Rubber Wheel: 10, 20, 30 yards  
- Permanent: 2, 4, 6, 8 yards

CRITICAL BUSINESS RULE - HEAVY MATERIALS:
If customer mentions: Dirt, Brick, Block, Concrete, Rocks, Masonry
→ ALWAYS respond with this exact phrase at the end: "[HEAVY_MATERIAL_RESTRICTION]"
This triggers backend enforcement of 10 Yard Roll-Off ONLY.

RECOMMENDATION FORMAT:
When you have enough info (project type, materials, estimated debris), respond with:
[DUMPSTER_RECOMMENDATION]
Size: <number>
Type: <Roll-Off|Rubber Wheel|Permanent>
ProjectType: <exact project type from list>
MaterialType: <exact material type>
Reason: <brief reason>

MATERIAL MAPPING (use EXACT values):
- Heavy items → Heavy Material
- Construction debris → Construction Waste  
- Roof shingles/materials → Roofing
- Leaves, branches, dirt → Landscape/Leaves/Trees/Broken Stumps
- Household items → Household Waste
- Boxes → Cardboard
- Scrap metal → Metal
- Anything else → Other Waste

FLOW:
1. Greet warmly and ask about their project
2. Follow up with questions about debris amount
3. Identify material types
4. Recommend appropriate size and type
5. Explain the recommendation clearly`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, imageBase64, zipcode } = body;

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
        model: "claude-3-5-sonnet-20241022",
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

    // Parse recommendation from AI response
    const recommendationMatch = aiReply.match(
      /\[DUMPSTER_RECOMMENDATION\]([\s\S]*?)(?:\[|$)/,
    );
    const hasHeavyMaterial = aiReply.includes("[HEAVY_MATERIAL_RESTRICTION]");

    let recommendation = null;
    if (recommendationMatch) {
      const recText = recommendationMatch[1];
      const sizeMatch = recText.match(/Size:\s*(\d+)/);
      const typeMatch = recText.match(/Type:\s*([^\n]+)/);
      const projectMatch = recText.match(/ProjectType:\s*([^\n]+)/);
      const materialMatch = recText.match(/MaterialType:\s*([^\n]+)/);
      const reasonMatch = recText.match(/Reason:\s*([^\n]+)/);

      if (sizeMatch && typeMatch) {
        const detectedSize = parseInt(sizeMatch[1]);
        const detectedType = typeMatch[1].trim();

        // BACKEND ENFORCEMENT: If heavy material detected, force 10 Yard Roll-Off
        let finalSize = detectedSize;
        let finalType = detectedType;
        let displayMessage = aiReply
          .replace(/\[DUMPSTER_RECOMMENDATION\][\s\S]*?\[?$/, "")
          .trim();

        if (hasHeavyMaterial) {
          finalSize = 10;
          finalType = "Roll-Off";
          displayMessage +=
            "\n\n⚠️ **Weight Restrictions:** Heavy materials require a 10 Yard Roll-Off dumpster. This is our maximum capacity for safety.";
        }

        recommendation = {
          size: finalSize,
          type: finalType,
          projectType: projectMatch ? projectMatch[1].trim() : "Other Project",
          materialType: materialMatch ? materialMatch[1].trim() : "Other Waste",
          reason: reasonMatch
            ? reasonMatch[1].trim()
            : "Based on your project details",
          enforced: hasHeavyMaterial,
        };

        return NextResponse.json({
          success: true,
          reply: displayMessage,
          type: "recommendation",
          recommendation: recommendation,
        });
      }
    }

    // No recommendation yet, continue conversation
    const cleanReply = aiReply
      .replace(/\[DUMPSTER_RECOMMENDATION\][\s\S]*?\[?$/, "")
      .replace(/\[HEAVY_MATERIAL_RESTRICTION\]/, "")
      .trim();

    return NextResponse.json({
      success: true,
      reply: cleanReply,
      type: "text",
      recommendation: null,
      hasHeavyMaterial: hasHeavyMaterial,
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
