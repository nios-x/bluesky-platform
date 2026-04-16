# AI Recommendation System - Quick Setup

## ✅ What's Been Implemented

1. **Enhanced `/api/recommendation` endpoint** supporting:
   - Text-based input (chat descriptions)
   - Image-based input (base64 encoded)
   - ZIP code validation
2. **AI Integration** with Anthropic Claude:
   - Uses `claude-3-5-sonnet-20241022` model
   - Strict JSON output validation
   - Server-side processing only

3. **Business Rule Engine** that adjusts recommendations:
   - Concrete/brick → 30yd rolloff minimum
   - Dirt/gravel/rock → 20yd rolloff minimum
   - Size normalization (10, 20, 30, 40 yards)
   - Type normalization (rolloff, rubber, permanent)

4. **Pricing Integration**:
   - Calls existing `/api/pricing/quote` endpoint
   - Returns pricing in final response

5. **Logging System** (Supabase):
   - Optional audit trail
   - Tracks input type, AI response, final recommendation
   - Non-blocking (doesn't block recommendation if fails)

---

## 🚀 One-Time Setup

### 1. Install Anthropic SDK

```bash
npm install
```

The `package.json` has already been updated with `@anthropic-ai/sdk`.

### 2. Set Environment Variable

Add to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
```

Get your key from: https://console.anthropic.com/

### 3. (Optional) Create Supabase Table

Run this in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS ai_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  input_type TEXT NOT NULL CHECK (input_type IN ('text', 'image')),
  user_input TEXT,
  ai_raw_response JSONB,
  final_recommendation JSONB,
  pricing_data JSONB,
  zip_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_zip_code ON ai_logs(zip_code);
CREATE INDEX idx_ai_logs_created_at ON ai_logs(created_at);
CREATE INDEX idx_ai_logs_input_type ON ai_logs(input_type);

ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable public read access" ON ai_logs FOR SELECT USING (true);
CREATE POLICY "Allow service role insert" ON ai_logs FOR INSERT WITH CHECK (true);
```

If you skip this, the system still works—logging just fails silently.

---

## 📝 Files Changed/Created

### New Files:

- `app/api/recommendation/route.js` - API endpoint
- `lib/controllers/recommendation.js` - Main recommendation logic
- `lib/models/ai_log.js` - Supabase logging
- `db/migrations/001_create_ai_logs_table.sql` - Database schema
- `AI_RECOMMENDATION_SYSTEM.md` - Full documentation
- `RECOMMENDATION_SETUP.md` - This file

### Updated Files:

- `package.json` - Added @anthropic-ai/sdk

---

## 🧪 Quick Test

### Via cURL:

```bash
curl -X POST http://localhost:3000/api/recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Im removing roofing material - about 2 squares",
    "zipCode": "48038"
  }'
```

### Expected Response:

```json
{
  "success": true,
  "recommendation": {
    "size": 20,
    "type": "rolloff",
    "projectType": "Roofing Project",
    "materialType": "Roofing Material",
    "estimatedVolume": "medium"
  },
  "ai": { ... },
  "pricing": { ... }
}
```

---

## 🎯 API Contract

### Request:

```json
POST /api/recommendation
{
  "text": "optional description",
  "imageBase64": "optional base64 image",
  "zipCode": "48038"
}
```

### Response:

```json
{
  "success": true,
  "recommendation": {
    "size": 20,           // 10, 20, 30, or 40
    "type": "rolloff",    // "rolloff", "rubber", or "permanent"
    "projectType": "string",
    "materialType": "string",
    "estimatedVolume": "small|medium|large"
  },
  "ai": {
    "rawResponse": {...},
    "ruleApplied": "string or null",
    "error": "string or null",
    "fallback": true/false
  },
  "pricing": {...} // or null
}
```

---

## ⚙️ Configuration

### Available Models:

Currently uses: `claude-3-5-sonnet-20241022`

To use a different model, edit `lib/controllers/recommendation.js` line ~115:

```javascript
const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022", // Change here
  // ...
});
```

### Adjusting Rules:

Edit `lib/controllers/recommendation.js` function `applyRules()` (around line 35-90)

Example: To force concrete to 40 yards instead of 30:

```javascript
if (materialType.includes("concrete")) {
  adjustedRecommendation.recommended_size = "40"; // Changed from "30"
  adjustedRecommendation.recommended_type = "rolloff";
}
```

---

## 🔍 Debugging

### Check AI Logs:

```sql
SELECT * FROM ai_logs ORDER BY created_at DESC LIMIT 10;
```

### View Raw Claude Response:

```sql
SELECT
  id,
  input_type,
  ai_raw_response,
  created_at
FROM ai_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### Enable Console Logs:

The system logs errors to console. Check:

- Browser DevTools (Network tab) for API calls
- Server logs for Claude API errors
- Terminal for Supabase logging errors

---

## ✨ Features Included

✅ Text-based recommendations  
✅ Image-based recommendations  
✅ Strict JSON output validation  
✅ Business rule engine  
✅ Pricing integration  
✅ Optional Supabase logging  
✅ Graceful error handling  
✅ ZIP code validation  
✅ Fallback recommendations  
✅ Production-ready code

---

## ⚠️ Important Notes

1. **Existing APIs Not Broken:**
   - Only adds new functionality to existing `/api/recommendation` endpoint
   - `/api/pricing/quote` integration is backward compatible

2. **Fallback Behavior:**
   - If Claude API fails → System returns safe default (20yd rolloff)
   - If Pricing API fails → Returns recommendation without price
   - If Supabase logging fails → Recommendation still returns successfully

3. **Rate Limiting:**
   - Claude API: Watch your quota at console.anthropic.com
   - Recommend adding rate limiting at Vercel/proxy level

4. **Cost Estimation:**
   - Claude 3.5 Sonnet: ~$0.003 per request (text input)
   - ~$0.006 per request (image input, depending on size)
   - Adjust if needed based on usage

---

## 📞 Support

See `AI_RECOMMENDATION_SYSTEM.md` for:

- Full API documentation
- Advanced usage examples
- Monitoring & debugging
- Security considerations
- Performance optimization

---

**Status:** ✅ Ready to deploy  
**Last Updated:** April 15, 2026  
**Tested With:** Next.js 16.1.6, Claude 3.5 Sonnet
