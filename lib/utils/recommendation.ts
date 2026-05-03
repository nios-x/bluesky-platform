/**
 * Client-side helpers for the AI Recommendation System
 * These are utility functions to use in React components
 */

/**
 * Convert File to base64 string
 * Usage: const b64 = await fileToBase64(file)
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      // Extract base64 part without "data:image/jpeg;base64," prefix
      const base64 = (result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}

/**
 * Validate ZIP code format
 */
export function isValidZipCode(zipCode) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Format price to USD
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Get display name for dumpster type
 */
export function getDumpsterTypeDisplayName(type) {
  const typeMap = {
    'rolloff': 'Roll-Off Dumpster',
    'rubber': 'Rubber Wheel Container',
    'permanent': 'Permanent Container',
  };
  return typeMap[type] || type;
}

/**
 * Get display name for volume estimate
 */
export function getVolumeDisplayName(volume) {
  const volumeMap = {
    'small': 'Small (10 yards)',
    'medium': 'Medium (20 yards)',
    'large': 'Large (30+ yards)',
  };
  return volumeMap[volume] || volume;
}

/**
 * Call the recommendation API
 * Returns the full response or null on error
 */
export async function getRecommendation({
  text,
  imageBase64,
  zipCode,
}) {
  if (!text && !imageBase64) {
    throw new Error('Either text or imageBase64 must be provided');
  }

  if (!zipCode) {
    throw new Error('ZIP code is required');
  }

  if (!isValidZipCode(zipCode)) {
    throw new Error('Invalid ZIP code format');
  }

  const response = await fetch('/api/recommendation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      imageBase64,
      zipCode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get recommendation');
  }

  return response.json();
}

/**
 * Get confidence assessment based on AI response
 * Higher confidence = more detailed recommendation from Claude
 */
export function getConfidenceScore(aiRawResponse) {
  if (!aiRawResponse) return 0;

  let score = 50; // Base confidence

  // Increase confidence if all fields are present
  if (aiRawResponse.project_type) score += 10;
  if (aiRawResponse.material_type) score += 10;
  if (aiRawResponse.estimated_volume) score += 10;
  if (aiRawResponse.recommended_size) score += 10;
  if (aiRawResponse.recommended_type) score += 10;

  return Math.min(score, 100);
}

/**
 * Parse response and prepare for display
 */
export function parseRecommendationResponse(data) {
  if (!data.success) {
    return {
      error: data.error,
      recommendation: null,
    };
  }

  const { recommendation, ai, pricing } = data;

  return {
    error: null,
    recommendation: {
      ...recommendation,
      displayType: getDumpsterTypeDisplayName(recommendation.type),
      displayVolume: getVolumeDisplayName(recommendation.estimatedVolume),
    },
    ai,
    pricing: pricing ? {
      ...pricing,
      formattedTotal: formatPrice(pricing.total_price),
      formattedBase: formatPrice(pricing.base_price),
      formattedShipping: formatPrice(pricing.shipping_fee),
    } : null,
    confidence: getConfidenceScore(ai.rawResponse),
  };
}
