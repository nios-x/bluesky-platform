import { supabaseAdmin } from "@/lib/supabase";

export async function logAIRecommendation({
  inputType,
  userInput,
  aiRawResponse,
  finalRecommendation,
  pricing,
  zipCode,
}) {
  try {
    const { error } = await supabaseAdmin.from("ai_logs").insert({
      input_type: inputType, // 'text' or 'image'
      user_input: userInput,
      ai_raw_response: JSON.stringify(aiRawResponse),
      final_recommendation: JSON.stringify(finalRecommendation),
      pricing_data: pricing ? JSON.stringify(pricing) : null,
      zip_code: zipCode,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Failed to log AI recommendation:", error.message);
    }
  } catch (err) {
    // Silent fail - don't block the recommendation if logging fails
    console.warn("AI logging error (non-blocking):", err.message);
  }
}
