import Anthropic from "@anthropic-ai/sdk";
import { logAIRecommendation } from "@/lib/models/ai_log";
import { supabaseAnon } from "@/lib/supabase";

const client = new Anthropic();

// Mapping from text-based values to database IDs
const DUMPSTER_TYPE_MAPPING = {
  rolloff: 1,
  "roll-off": 1,
  rubber: 2,
  "rubber-wheel": 2,
  permanent: 3,
  "front-load": 3,
};

const DUMPSTER_SIZE_MAPPING = {
  10: 1,
  20: 2,
  30: 3,
  40: 4,
};

/**
 * Apply business rules to the AI recommendation
 * Adjusts size/type based on material and other factors
 */
function applyRules(aiRecommendation, zipCode) {
  let adjustedRecommendation = { ...aiRecommendation };

  const materialType = (aiRecommendation.material_type || "").toLowerCase();
  const recommendedSize = parseInt(aiRecommendation.recommended_size);
  const recommendedType = (
    aiRecommendation.recommended_type || ""
  ).toLowerCase();

  // RULE 1: Concrete/Brick/Asphalt requires minimum 30-yard roll-off
  if (
    materialType.includes("concrete") ||
    materialType.includes("brick") ||
    materialType.includes("asphalt")
  ) {
    adjustedRecommendation.recommended_size = "30";
    adjustedRecommendation.recommended_type = "rolloff";
    adjustedRecommendation.rule_applied = "Heavy Material (Concrete/Brick)";
  }

  // RULE 2: Heavy debris (dirt, gravel, rock) - minimum 20-yard roll-off
  if (
    materialType.includes("dirt") ||
    materialType.includes("gravel") ||
    materialType.includes("rock") ||
    materialType.includes("soil")
  ) {
    if (recommendedSize < 20) {
      adjustedRecommendation.recommended_size = "20";
    }
    adjustedRecommendation.recommended_type = "rolloff";
    adjustedRecommendation.rule_applied = "Heavy Material (Dirt/Gravel)";
  }

  // RULE 3: Light household items can use rubber-wheel or smaller
  if (
    materialType.includes("household") ||
    materialType.includes("trash") ||
    materialType.includes("general waste")
  ) {
    // Keep AI recommendation, but ensure it's reasonable (10-20 yards)
    if (recommendedSize > 30) {
      adjustedRecommendation.recommended_size = "20";
    }
  }

  // RULE 4: Ensure recommended_size is valid (10, 20, 30, or 40)
  const validSizes = [10, 20, 30, 40];
  if (!validSizes.includes(recommendedSize)) {
    const closestSize = validSizes.reduce((prev, curr) =>
      Math.abs(curr - recommendedSize) < Math.abs(prev - recommendedSize)
        ? curr
        : prev,
    );
    adjustedRecommendation.recommended_size = closestSize.toString();
  }

  // RULE 5: Normalize dumpster type
  const normalizedType = recommendedType.toLowerCase().replace(/[-\s]/g, "");
  if (normalizedType.includes("roll") || normalizedType.includes("off")) {
    adjustedRecommendation.recommended_type = "rolloff";
  } else if (normalizedType.includes("rubber")) {
    adjustedRecommendation.recommended_type = "rubber";
  } else if (
    normalizedType.includes("permanent") ||
    normalizedType.includes("front")
  ) {
    adjustedRecommendation.recommended_type = "permanent";
  }

  return adjustedRecommendation;
}

/**
 * Call Anthropic Claude API for recommendation
 */
async function getAIRecommendation(userInput, isImageInput = false) {
  const systemPrompt = `You are a dumpster rental expert. Analyze the user's input and return ONLY valid JSON with these exact fields:
- project_type: string (type of project)
- material_type: string (what materials are being disposed of)
- estimated_volume: "small" | "medium" | "large"
- recommended_size: "10" | "20" | "30" | "40" (in yards)
- recommended_type: "rolloff" | "rubber" | "permanent"

Do not include any explanation, markdown, or extra text. Return ONLY the JSON object.
Be practical and realistic based on the waste type and volume described.`;

  try {
    let messageContent;

    if (isImageInput) {
      // Handle image input
      messageContent = [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg", // Assuming JPEG, could detect from base64
            data: userInput,
          },
        },
        {
          type: "text",
          text: "Analyze this image of waste/debris and recommend an appropriate dumpster. What materials do you see? How much volume?",
        },
      ];
    } else {
      // Handle text input
      messageContent = [
        {
          type: "text",
          text: userInput,
        },
      ];
    }

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 256,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
    });

    // Extract JSON from response
    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Try to parse JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // Fallback if JSON parsing fails
      console.warn("Failed to parse Claude response:", responseText);
      parsedResponse = {
        project_type: "Unknown Project",
        material_type: "Mixed Materials",
        estimated_volume: "medium",
        recommended_size: "20",
        recommended_type: "rolloff",
      };
    }

    return parsedResponse;
  } catch (error) {
    console.error("Claude API error:", error.message);
    throw error;
  }
}

/**
 * Fetch pricing for the recommended configuration
 */
async function getPricing(zipCode, recommendedSize, recommendedType) {
  try {
    // Call the pricing API
    const response = await fetch(
      new URL(
        "/api/pricing/quote",
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zip_code: zipCode,
          dumpster_size_id: DUMPSTER_SIZE_MAPPING[recommendedSize] || 2,
          dumpster_type_id:
            DUMPSTER_TYPE_MAPPING[recommendedType.toLowerCase()] || 1,
          rental_days: 7,
          estimated_weight_tons: 1, // Default estimate
        }),
      },
    );

    if (!response.ok) {
      console.warn("Pricing API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn("Failed to fetch pricing:", error.message);
    return null;
  }
}

/**
 * Validate ZIP code format
 */
function isValidZipCode(zipCode) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Main recommendation controller
 */
export async function createRecommendationController(body) {
  const { text, imageBase64, zipCode } = body;

  // Validate input
  if (!text && !imageBase64) {
    throw new Error("Either text or imageBase64 must be provided");
  }

  if (!zipCode) {
    throw new Error("ZIP code is required");
  }

  if (!isValidZipCode(zipCode)) {
    throw new Error("Invalid ZIP code format");
  }

  let inputType = "text";
  let userInput = text;

  if (imageBase64 && !text) {
    inputType = "image";
    userInput = imageBase64.substring(0, 100); // Store only first 100 chars for logging
  }

  try {
    // Get AI recommendation
    const aiResponse = await getAIRecommendation(
      text || imageBase64,
      !text && imageBase64,
    );

    // Apply business rules
    const adjustedRecommendation = applyRules(aiResponse, zipCode);

    // Get pricing
    const pricing = await getPricing(
      zipCode,
      adjustedRecommendation.recommended_size,
      adjustedRecommendation.recommended_type,
    );

    // Prepare final response
    const finalResponse = {
      success: true,
      recommendation: {
        size: parseInt(adjustedRecommendation.recommended_size),
        type: adjustedRecommendation.recommended_type,
        projectType: adjustedRecommendation.project_type,
        materialType: adjustedRecommendation.material_type,
        estimatedVolume: adjustedRecommendation.estimated_volume,
      },
      ai: {
        rawResponse: aiResponse,
        ruleApplied: adjustedRecommendation.rule_applied || null,
      },
      pricing: pricing || null,
    };

    // Log to Supabase (non-blocking)
    logAIRecommendation({
      inputType,
      userInput,
      aiRawResponse: aiResponse,
      finalRecommendation: {
        size: finalResponse.recommendation.size,
        type: finalResponse.recommendation.type,
      },
      pricing,
      zipCode,
    }).catch((err) => {
      console.warn("Logging failed (non-blocking):", err.message);
    });

    return finalResponse;
  } catch (error) {
    console.error("Recommendation controller error:", error.message);

    // Fallback response on error
    const fallbackResponse = {
      success: true,
      recommendation: {
        size: 20,
        type: "rolloff",
        projectType: "Unknown",
        materialType: "Unknown",
        estimatedVolume: "medium",
      },
      ai: {
        rawResponse: null,
        error: error.message,
        fallback: true,
      },
      pricing: null,
    };

    return fallbackResponse;
  }
}
