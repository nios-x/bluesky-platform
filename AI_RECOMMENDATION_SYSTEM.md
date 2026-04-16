# AI-Powered Smart Recommendation System

## Overview

This implementation enhances the existing `POST /api/recommendation` endpoint with AI-powered dumpster recommendations using Anthropic's Claude AI.

**Key Features:**

- Text-based recommendation input
- Image-based recommendation input (base64)
- Strict JSON output from Claude
- Automatic business rule application (material-based adjustments)
- Integration with existing pricing API
- Optional Supabase logging for audit trail
- Production-ready error handling with graceful fallbacks

---

## Architecture

```
POST /api/recommendation
    ↓
app/api/recommendation/route.js (API Handler)
    ↓
lib/controllers/recommendation.js (Main Logic)
    ├─→ getAIRecommendation() → Claude API
    ├─→ applyRules() → Business Rule Engine
    ├─→ getPricing() → /api/pricing/quote
    └─→ logAIRecommendation() → Supabase
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @anthropic-ai/sdk@^0.28.3
```

Or the package.json has already been updated. Run:

```bash
npm install
```

### 2. Set Environment Variables

Add to your `.env.local`:

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-... # Get from https://console.anthropic.com
```

### 3. Create Supabase AI Logs Table (Optional)

Run the migration in Supabase SQL Editor:

```bash
# Located at: db/migrations/001_create_ai_logs_table.sql
```

**Note:** If the `ai_logs` table doesn't exist, logging will fail silently (non-blocking).

---

## API Specification

### Endpoint

```
POST /api/recommendation
```

### Request Body

```json
{
  "text": "I'm doing a kitchen remodel with mixed debris", // Optional
  "imageBase64": "data:image/jpeg;base64,...", // Optional
  "zipCode": "48038" // Required
}
```

**Requirements:**

- Either `text` OR `imageBase64` must be provided (or both)
- `zipCode` is required and must be valid US ZIP format (5 or 9 digits)

### Response (Success)

```json
{
  "success": true,
  "recommendation": {
    "size": 20, // Yards (10, 20, 30, or 40)
    "type": "rolloff", // "rolloff" | "rubber" | "permanent"
    "projectType": "Kitchen Remodel",
    "materialType": "Mixed Construction Debris",
    "estimatedVolume": "medium" // "small" | "medium" | "large"
  },
  "ai": {
    "rawResponse": {
      "project_type": "Kitchen Remodel",
      "material_type": "Mixed Construction Debris",
      "estimated_volume": "medium",
      "recommended_size": "20",
      "recommended_type": "rolloff"
    },
    "ruleApplied": null // Or the name of applied rule
  },
  "pricing": {
    "base_price": 455,
    "shipping_fee": 0,
    "included_days": 7,
    "included_tons": 2,
    "extra_days_fee": 0,
    "extra_weight_fee": 0,
    "total_price": 455,
    "currency": "USD"
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "error": "Invalid ZIP code format"
}
```

---

## Usage Examples

### Example 1: Text-Based Recommendation

```javascript
const response = await fetch("/api/recommendation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "I'm removing roofing material from my house - about 2 squares of asphalt shingles",
    zipCode: "48038",
  }),
});

const data = await response.json();
console.log(data.recommendation);
// Output: { size: 20, type: "rolloff", ... }
```

### Example 2: Image-Based Recommendation

```javascript
// Assuming you have a File object from file input
const file = event.target.files[0];
const reader = new FileReader();

reader.onload = async (e) => {
  // Extract base64 from data URL: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  const imageBase64 = e.target.result.split(",")[1];

  const response = await fetch("/api/recommendation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageBase64: imageBase64,
      zipCode: "48038",
    }),
  });

  const data = await response.json();
  console.log(data.recommendation);
};

reader.readAsDataURL(file);
```

### Example 3: React Component Integration

```typescript
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function RecommendationForm() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [text, setText] = useState('');
  const [zipCode, setZipCode] = useState('');

  async function handleGetRecommendation() {
    if (!text || !zipCode) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          zipCode
        })
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to get recommendation');
        return;
      }

      setRecommendation(data);
      toast.success(
        `Recommended: ${data.recommendation.size}yd ${data.recommendation.type}`
      );
    } catch (error) {
      toast.error('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your project and materials..."
        className="w-full border rounded p-2"
      />
      <input
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="ZIP Code"
        className="w-full border rounded p-2"
      />
      <button
        onClick={handleGetRecommendation}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
      </button>

      {recommendation && (
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-bold text-lg">Recommended:</h3>
          <p className="text-2xl font-bold text-green-600">
            {recommendation.recommendation.size}yd {recommendation.recommendation.type}
          </p>
          <p>Material: {recommendation.recommendation.materialType}</p>
          <p>Estimated Price: ${recommendation.pricing?.total_price}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Business Rules (Rule Engine)

The system applies automatic rules after AI recommendation to ensure safe and compliant service delivery:

### Rule 1: Heavy Materials (Concrete/Brick/Asphalt)

- **Trigger:** Material contains "concrete", "brick", or "asphalt"
- **Action:** Force 30-yard rolloff
- **Reason:** Heavy materials require reinforced containers and larger capacity

### Rule 2: Heavy Debris (Dirt/Gravel/Rock)

- **Trigger:** Material contains "dirt", "gravel", "rock", or "soil"
- **Action:** Minimum 20-yard rolloff (enforce minimum)
- **Reason:** Heavy weight distribution requires suitable equipment

### Rule 3: Light Household Items

- **Trigger:** Material contains "household", "trash", or "general waste"
- **Action:** Cap at 20 yards max (adjust if AI recommends larger)
- **Reason:** Light materials don't need oversized containers

### Rule 4: Valid Size Normalization

- **Trigger:** Recommended size not in [10, 20, 30, 40]
- **Action:** Round to nearest valid size
- **Reason:** System only supports these yard sizes

### Rule 5: Type Normalization

- **Trigger:** Recommended type contains typos or variations
- **Action:** Normalize to "rolloff", "rubber", or "permanent"
- **Reason:** Ensure consistency with database schema

---

## Error Handling

The system is designed to fail gracefully:

### Scenario 1: Claude API Failure

```json
{
  "success": true,
  "recommendation": {
    "size": 20,
    "type": "rolloff"
  },
  "ai": {
    "error": "API rate limit exceeded",
    "fallback": true
  },
  "pricing": null
}
```

### Scenario 2: Invalid JSON from Claude

The system detects and handles malformed JSON responses, falling back to default recommendations.

### Scenario 3: Pricing API Unavailable

Recommendation still returns successfully without pricing data.

### Scenario 4: Supabase Logging Failure

Logging failures don't block the recommendation response (non-blocking).

---

## Monitoring & Debugging

### View AI Recommendation Logs

```sql
-- Query in Supabase SQL Editor
SELECT
  id,
  input_type,
  zip_code,
  ai_raw_response->>'project_type' as project_type,
  final_recommendation->>'type' as recommended_type,
  created_at
FROM ai_logs
ORDER BY created_at DESC
LIMIT 50;
```

### Enable Detailed Logging

Set in your environment:

```bash
DEBUG=* npm run dev
```

### Check Browser Console

Image-based recommendations may log warnings if format detection fails.

---

## Performance Considerations

- **Claude API Latency:** ~1-3 seconds (expect 95th percentile)
- **Image Processing:** Base64 encoding adds overhead; use JPEG for optimal size
- **Pricing API Call:** ~500ms
- **Supabase Logging:** Non-blocking (async), <100ms

**Optimization Tips:**

1. Cache recommendations for repeated inputs (24-hour TTL)
2. Batch image processing if handling many requests
3. Use connection pooling for database (already configured)

---

## Security Considerations

✅ **Implemented:**

- Server-side AI processing (no client-side API keys)
- Strict JSON validation
- ZIP code format validation
- RLS (Row Level Security) on ai_logs table
- Service role key separation

⚠️ **Notes:**

- Image base64 data is logged (consider PII)
- API rate limiting recommended at proxy level (Vercel, Cloudflare)
- ANTHROPIC_API_KEY must be in server environment only

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"

**Solution:** Add to `.env.local` and restart dev server

### Issue: "Service not available in this ZIP code"

**Solution:** Check Supabase `zip_codes` table; add missing ZIP if needed

### Issue: Image recommendations not working

**Solution:** Ensure base64 string is valid JPEG; test with `console.log(imageBase64.substring(0, 50))`

### Issue: Recommendations don't match expected material type

**Solution:** Check `ai_logs` table to see raw Claude response; may need to adjust prompts

---

## Future Enhancements

- [ ] Confidence score from Claude
- [ ] Material-specific recommendations (roofing, siding, etc.)
- [ ] Multi-language support
- [ ] Recommendation caching with Redis
- [ ] A/B testing different prompts
- [ ] Admin dashboard for reviewing recommendations
- [ ] Webhook notifications for high-confidence recommendations

---

## Testing

### Unit Test Example (Jest)

```javascript
import { createRecommendationController } from "@/lib/controllers/recommendation";

describe("Recommendation System", () => {
  it("should recommend 30yd rolloff for concrete", async () => {
    const result = await createRecommendationController({
      text: "Removing concrete foundation",
      zipCode: "48038",
    });

    expect(result.recommendation.size).toBe(30);
    expect(result.recommendation.type).toBe("rolloff");
  });

  it("should reject invalid ZIP code", async () => {
    await expect(
      createRecommendationController({
        text: "Some project",
        zipCode: "invalid",
      }),
    ).rejects.toThrow("Invalid ZIP code format");
  });
});
```

---

## API Response Codes

| Code | Meaning      | Example                         |
| ---- | ------------ | ------------------------------- |
| 200  | Success      | `{"success": true, ...}`        |
| 400  | Bad Request  | Missing zipCode, invalid format |
| 500  | Server Error | Unexpected internal error       |

---

## Support & Contact

For issues or questions:

1. Check the troubleshooting section above
2. Review Anthropic documentation: https://docs.anthropic.com
3. Check Supabase docs: https://supabase.com/docs
4. Create a GitHub issue with logs from `ai_logs` table

---

**Last Updated:** April 15, 2026
**Version:** 1.0.0
**Status:** Production Ready
