# Quick Reference: Claude Chatbot Implementation

## 🚀 Quick Start (5 minutes)

### Step 1: Add API Key

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### Step 2: Import Component

```tsx
// app/layout.tsx (or any page)
import { AIChatbotRefactored } from "@/components/ai-chatbot-refactored";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AIChatbotRefactored />
      </body>
    </html>
  );
}
```

### Step 3: Start Server

```bash
npm run dev
# Open http://localhost:3000
# Click chat bubble at bottom-right
```

---

## 📋 File Reference

| File                                   | Purpose                | Key Changes                      |
| -------------------------------------- | ---------------------- | -------------------------------- |
| `app/api/chat/route.ts`                | Claude API integration | NEW - Handles conversation logic |
| `components/ai-chatbot-refactored.tsx` | UI Component           | NEW - Replaces old chatbot       |
| `lib/utils/chat.ts`                    | Helper functions       | NEW - Utility functions          |

---

## 🎯 Conversation Flow

```
User Input
    ↓
hasEnoughProjectInfo() check
    ├─ NO  → Ask follow-up question
    └─ YES → Check for ZIP code
              ├─ NO  → Ask for ZIP
              └─ YES → Make recommendation
```

---

## 🔧 Customization Examples

### Change Greeting

```tsx
// components/ai-chatbot-refactored.tsx - Change initial state
const [messages, setMessages] = useState<Message[]>([
  {
    id: "1",
    text: "Your custom greeting here!",
    sender: "bot",
    timestamp: new Date(),
  },
]);
```

### Change Dumpster Sizes

```ts
// app/api/chat/route.ts - recommendDumpsterSize() function
if (/concrete|demolition|heavy/.test(lower)) {
  return 40; // Instead of 30
}
```

### Add Real Pricing

```ts
// app/api/chat/route.ts
recommendation = {
  size: recommendedSize,
  type: "Roll-Off",
  reason: "Based on your project",
  price: await getPricingFromDatabase(zipCode, recommendedSize),
};
```

### Change Claude Model

```ts
// app/api/chat/route.ts - Change model line
model: 'claude-3-5-haiku-20241022', // Faster, cheaper
// OR
model: 'claude-3-opus-20250219', // Most capable
```

---

## 🧪 Testing Scenarios

### Scenario 1: Basic Cleanup

```
User: Hello
Bot: What are you working on?
User: Cleaning my garage
Bot: How much junk?
User: Full garage, lots of furniture
Bot: Any heavy stuff?
User: Just old furniture and boxes
Bot: One last thing - ZIP?
User: 48202
Bot: [RECOMMENDATION: 20 yard]
```

### Scenario 2: Quick Question

```
User: What's your pricing?
Bot: Our pricing varies by size and location. Can I help you find the right dumpster for a specific project?
User: Yes, renovation
Bot: What kind of renovation?
... (continues)
```

### Scenario 3: Confused User

```
User: i dunno what i need
Bot: No problem! Let me help. Are you doing a cleanup, renovation, or construction project?
User: cleanup
Bot: Great! What's the scope - is it like a single room or a full house?
... (continues)
```

---

## 📊 API Request/Response

### Request

```json
POST /api/chat
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

### Response

```json
{
  "reply": "Perfect! That sounds like you need a 20-yard dumpster.",
  "type": "recommendation",
  "needsZipCode": false,
  "recommendation": {
    "size": 20,
    "type": "Roll-Off",
    "reason": "Full garage cleanup with furniture",
    "price": 1000
  }
}
```

---

## 🐛 Common Issues & Fixes

| Issue                            | Cause                                 | Fix                                   |
| -------------------------------- | ------------------------------------- | ------------------------------------- |
| "API error 401"                  | Missing/invalid API key               | Check ANTHROPIC_API_KEY in .env.local |
| Chatbot asks for ZIP immediately | `hasEnoughProjectInfo()` too strict   | Add more keywords to regex patterns   |
| Recommendations wrong size       | `recommendDumpsterSize()` logic wrong | Adjust thresholds and keywords        |
| Long response times              | Using Opus instead of Sonnet          | Change to `claude-3-5-sonnet`         |
| "Too many requests"              | Rate limiting                         | Increase limiter tokens or add delay  |
| Chatbot not responding           | Server error                          | Check console logs and API status     |

---

## 🔍 Debugging

### Enable Verbose Logging

```ts
// app/api/chat/route.ts - Add at start of POST function
console.log("[CHAT DEBUG]", {
  messageCount: body.messages.length,
  hasZip: !!body.zipCode,
  timestamp: new Date().toISOString(),
});

// Add after Claude response
console.log("[CLAUDE RESPONSE]", {
  reply: assistantMessage.substring(0, 50) + "...",
  type: responseType,
  hasRecommendation: !!recommendation,
  hasEnoughInfo,
  hasZipCode,
});
```

### Check API Key

```bash
# Verify key format
echo $ANTHROPIC_API_KEY  # Should start with sk-ant-

# Test with curl
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/models
```

### Monitor Token Usage

```ts
// Add to route.ts after Claude response
console.log("Tokens used:", {
  input: response.usage.input_tokens,
  output: response.usage.output_tokens,
  total: response.usage.input_tokens + response.usage.output_tokens,
});
```

---

## 💾 Environment Setup

```bash
# .env.local example
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# Optional monitoring
NEXT_PUBLIC_DEBUG_CHAT=true
CHAT_LOG_LEVEL=debug
```

---

## 🚢 Production Deployment

### Before Deploying

- [ ] Test on staging environment
- [ ] Verify API key works
- [ ] Check rate limiting
- [ ] Monitor API costs
- [ ] Set up error alerts

### Vercel Deployment

```bash
# Add environment variable in Vercel dashboard
# Settings → Environment Variables
# ANTHROPIC_API_KEY = your-key

# Deploy
git push origin main  # Triggers automatic deployment
```

### Docker Deployment

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV ANTHROPIC_API_KEY=your-key
CMD ["npm", "start"]
```

---

## 📈 Monitoring Metrics

Track these for optimal performance:

```ts
interface ConversationMetrics {
  messageCount: number; // How many turns?
  timeToRecommendation: number; // How long (ms)?
  recommendedSize: number; // 10, 20, or 30?
  userAccepted: boolean; // Did they book?
  averageResponseTime: number; // Claude API latency
  costPerConversation: number; // Input + output tokens * rate
}
```

---

## 📚 Resources

- **Claude API Docs**: https://docs.anthropic.com/
- **SDK Reference**: https://github.com/anthropics/anthropic-sdk-javascript
- **Pricing**: https://www.anthropic.com/pricing
- **Status Page**: https://status.anthropic.com/

---

## 🎓 Learn More

See detailed guides:

- **Integration Guide**: `CHATBOT_INTEGRATION_GUIDE.md`
- **Architecture**: `CHATBOT_ARCHITECTURE.md`
- **Component Code**: `components/ai-chatbot-refactored.tsx`
- **API Code**: `app/api/chat/route.ts`

---

## ✨ Tips & Tricks

### Tip 1: Speed Up Development

Use `claude-3-5-haiku` for testing, switch to `claude-3-5-sonnet` for production

### Tip 2: Better Recommendations

Add more examples to system prompt of projects → recommended sizes

### Tip 3: Reduce Costs

Implement message compression (summarize old messages after 20+ turns)

### Tip 4: Improve UX

Show typing indicator while waiting for Claude response

### Tip 5: Track Success

Log when users click "Book This Dumpster" to measure conversion rate

---

**Last Updated**: May 2026  
**Claude Model**: 3.5 Sonnet  
**API Version**: 2024-06-01
