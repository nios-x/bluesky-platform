# Claude Conversational Chatbot Integration Guide

## Overview

This guide explains how to integrate the refactored Claude-powered conversational chatbot into your Blue Sky Disposal application.

## What Was Created

### 1. **New API Route: `/api/chat`** (`app/api/chat/route.ts`)

- Uses Claude 3.5 Sonnet for natural language understanding
- Maintains multi-turn conversation history
- Automatically detects when enough project info has been gathered
- Intelligently determines when to ask for ZIP code
- Generates recommendations based on conversation context

### 2. **Refactored Chatbot Component** (`components/ai-chatbot-refactored.tsx`)

- Conversational, Claude-like behavior
- Maintains full message history
- Smart ZIP code prompting
- Displays recommendations in an attractive card format
- Fully responsive and accessible

### 3. **Chat Utilities** (`lib/utils/chat.ts`)

- Helper functions for API communication
- Conversation analysis functions
- ZIP code extraction and validation
- Message formatting utilities

## Key Features

✅ **Truly Conversational**

- Not a form - feels like talking to a real assistant
- One question at a time
- Contextual follow-ups based on user input

✅ **Intelligent Information Gathering**

- Asks about project type (cleanup, renovation, construction, etc.)
- Understands volume and size
- Identifies material types
- Only asks for ZIP code when ready to recommend

✅ **Smart Recommendations**

- Recommends dumpster size based on gathered info
- Explains WHY that size is recommended
- Shows estimated pricing
- Easy booking integration

✅ **Multi-Turn Conversation**

- Maintains full conversation history
- Claude understands context across messages
- Can handle off-topic questions and redirect
- Remembers previous information in conversation

## Integration Steps

### Step 1: Environment Setup

Make sure you have the Claude API key configured:

```bash
# Add to your .env.local file
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

Get your key from: https://console.anthropic.com/

### Step 2: Replace the Chatbot in Your Layout

Find where you're currently using the chatbot component and update it:

**Before:**

```tsx
import { AIChatbot } from "@/components/ai-chatbot";

export default function Layout() {
  return (
    <>
      {/* Your layout content */}
      <AIChatbot />
    </>
  );
}
```

**After:**

```tsx
import { AIChatbotRefactored } from "@/components/ai-chatbot-refactored";

export default function Layout() {
  return (
    <>
      {/* Your layout content */}
      <AIChatbotRefactored />
    </>
  );
}
```

### Step 3: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Click the chatbot bubble in the bottom-right corner

4. Try this conversation:

   ```
   You: Hello
   Bot: Hi! What kind of project are you working on?

   You: Cleaning my garage
   Bot: Got it! About how much junk do you have - is it like a full garage or just part of it?

   You: Full garage, lots of old furniture
   Bot: That's helpful! Any heavy materials like concrete, or mostly household items like furniture?

   You: Just furniture and boxes
   Bot: Perfect! One last thing - what's your ZIP code so I can provide you with the best recommendation?

   You: 48202
   Bot: Great! Based on your full garage cleanup with furniture, I recommend a 20-yard dumpster. [Shows recommendation card]
   ```

### Step 4: Customization (Optional)

#### Change the System Prompt

Edit `app/api/chat/route.ts` and modify the `SYSTEM_PROMPT` constant to adjust:

- Tone and personality
- What questions are asked
- When to make recommendations
- Pricing strategy

#### Adjust Dumpster Sizing Logic

The `recommendDumpsterSize()` function in `app/api/chat/route.ts` determines sizes:

```typescript
// Current logic:
// 10 yard: Small cleanups
// 20 yard: Medium projects (default)
// 30 yard: Large/heavy projects

// Modify these thresholds for your business
```

#### Add Real Pricing

Replace the placeholder pricing in `route.ts`:

```typescript
price: recommendedSize * 50, // Change this formula
```

Connect to your pricing database/API for real-time quotes.

## How It Works: The Conversation Flow

```
USER MESSAGE
    ↓
SEND TO /api/chat
    ↓
CLAUDE ANALYZES:
├─ Has enough project info? (type, volume, materials)
├─ Do we have ZIP code?
└─ Generate appropriate response
    ↓
RETURN RESPONSE WITH:
├─ Natural conversational reply
├─ Type: 'text' | 'recommendation' | 'waiting_for_zip'
├─ Optional recommendation object
└─ Flag if ZIP code is needed
    ↓
FRONTEND UPDATES:
├─ Show Claude's message
├─ If recommendation: Display nice card
├─ If needs ZIP: Show ZIP input prompt
└─ Continue conversation
```

## API Endpoint Details

### POST /api/chat

**Request:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "I'm cleaning my garage"
    },
    {
      "role": "assistant",
      "content": "How much junk do you have?"
    }
  ],
  "zipCode": "48202"
}
```

**Response:**

```json
{
  "reply": "That sounds like a 20-yard dumpster would work perfectly for you!",
  "type": "recommendation",
  "recommendation": {
    "size": 20,
    "type": "Roll-Off",
    "reason": "Based on your full garage cleanup with furniture",
    "price": 1000
  },
  "needsZipCode": false
}
```

## Conversation Flow Logic

### What Triggers Information Gathering?

The AI asks follow-up questions to understand:

1. **Project Type** (regex: project|cleanup|renovation|construction|garage|basement|etc.)
   - "What kind of project are you working on?"

2. **Volume/Size** (regex: full|entire|lot of|small|medium|large|etc.)
   - "How much debris do you have?"

3. **Material Type** (regex: wood|concrete|furniture|household|etc.)
   - "What kind of materials?"

### What Triggers Recommendation?

When Claude detects all three pieces of information:

- ✅ Project type identified
- ✅ Volume/size understood
- ✅ Material types known

→ **Then asks for ZIP code** (if not already provided)

→ **Then makes recommendation** (once ZIP is provided)

## Advanced Customization

### Adding Support for Images

You can extend the chatbot to accept images:

1. Update the frontend to support file uploads
2. Convert images to base64
3. Send to `/api/chat` endpoint:

```json
{
  "messages": [...],
  "imageData": "data:image/jpeg;base64,..."
}
```

4. Update the Claude system prompt to handle vision

### Connecting to Real Booking System

Replace the demo booking logic:

```typescript
// In ai-chatbot-refactored.tsx
<Button
  onClick={() => {
    // Instead of alert, redirect to booking page
    window.location.href = `/booking?size=${rec.size}&zipcode=${zipCode}`
  }}
>
  Book This Dumpster
</Button>
```

### Adding Payment Integration

After user confirms booking:

1. Create an order with the recommended size + ZIP
2. Redirect to Stripe checkout with the dumpster pricing
3. Stripe webhook confirms payment
4. Send confirmation email

## Testing Checklist

- [ ] Chatbot loads and opens
- [ ] Initial greeting displays
- [ ] Can type and send messages
- [ ] Claude responds naturally
- [ ] Conversation context is maintained
- [ ] ZIP code prompt appears at right time
- [ ] Recommendation displays correctly
- [ ] No console errors

## Troubleshooting

### "API error: 401"

- ❌ Check your `ANTHROPIC_API_KEY` in `.env.local`
- ✅ Verify key is valid at https://console.anthropic.com

### "Failed to generate recommendation"

- ❌ Claude API might be rate-limited
- ✅ Check API quota at console.anthropic.com
- ✅ Try again in a few seconds

### "Chatbot asks for ZIP immediately"

- ❌ The `hasEnoughProjectInfo()` logic might be too strict
- ✅ Adjust regex patterns in `app/api/chat/route.ts`
- ✅ Add more keyword variations

### Responses are too long

- ✅ Adjust `max_tokens: 500` in route.ts (lower = shorter)
- ✅ Add instruction to system prompt: "Keep responses brief (1-2 sentences)"

### Recommendations are wrong size

- ✅ Adjust the `recommendDumpsterSize()` function
- ✅ Add more keywords/patterns that indicate size
- ✅ Train Claude with more examples in system prompt

## Performance Optimization

### Token Usage

- Latest messages only: Last 10 messages sent (reduces cost)
- Configure in: `const recentMessages = body.messages.slice(-10)`

### Response Time

- Claude Haiku is faster: `model: 'claude-3-5-haiku-20241022'`
- Claude Sonnet is smarter (current): `model: 'claude-3-5-sonnet-20241022'`

### Cost Estimation

- Average conversation: 2,000-3,000 tokens
- ~$0.01-0.02 per recommendation
- ~$0.03 per 1M tokens (Sonnet pricing)

## Next Steps

1. ✅ **Deploy to production** - Push the new files
2. ✅ **Monitor conversations** - Check Claude outputs
3. ✅ **Adjust prompts** - Fine-tune based on real usage
4. ✅ **Connect to booking** - Link recommendations to checkout
5. ✅ **Add analytics** - Track recommendation accuracy
6. ✅ **Gather feedback** - Ask users about chatbot helpfulness

## Support

For issues or questions:

- Claude API docs: https://docs.anthropic.com/
- SDK reference: https://github.com/anthropics/anthropic-sdk-python
- Check API status: https://status.anthropic.com/
