import { NextResponse } from "next/server";
import { createRecommendationController } from "@/lib/controllers/recommendation";

/**
 * POST /api/recommendation
 *
 * Request body:
 * {
 *   text?: string,           // Text-based input for recommendation
 *   imageBase64?: string,    // Base64 encoded image
 *   zipCode: string          // ZIP code for pricing lookup
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   recommendation: {
 *     size: number,
 *     type: string,
 *     projectType: string,
 *     materialType: string,
 *     estimatedVolume: string
 *   },
 *   ai: {
 *     rawResponse: object,
 *     ruleApplied?: string,
 *     error?: string,
 *     fallback?: boolean
 *   },
 *   pricing: object | null
 * }
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.zipCode) {
      return NextResponse.json(
        { success: false, error: "ZIP code is required" },
        { status: 400 },
      );
    }

    if (!body.text && !body.imageBase64) {
      return NextResponse.json(
        {
          success: false,
          error: "Either text or imageBase64 must be provided",
        },
        { status: 400 },
      );
    }

    // Call recommendation controller
    const recommendation = await createRecommendationController(body);

    return NextResponse.json(recommendation, { status: 200 });
  } catch (error) {
    console.error("Recommendation API error:", error.message);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate recommendation",
      },
      { status: 400 },
    );
  }
}
