#!/usr/bin/env node

/\*\*

- CLAUDE CHATBOT SYSTEM ARCHITECTURE & IMPLEMENTATION GUIDE
-
- This document explains:
- 1.  System architecture
- 2.  Data flow
- 3.  Implementation patterns
- 4.  Best practices
- 5.  Advanced customizations
      \*/

// ============================================================================
// PART 1: SYSTEM ARCHITECTURE
// ============================================================================

/\*

┌─────────────────────────────────────────────────────────────────────┐
│ USER INTERFACE │
│ (ai-chatbot-refactored.tsx) │
│ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Chat Messages Display │ │
│ │ - User messages (right, blue) │ │
│ │ - Bot messages (left, gray) │ │
│ │ - Recommendation cards (if applicable) │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ ZIP Code Prompt (shown when needed) │ │
│ │ - Appears only after enough project info gathered │ │
│ │ - Simple input field │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Input Field & Send Button │ │
│ │ - Always ready for new messages │ │
│ │ - Disabled while loading │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
↓
sendToAPI()
message history
optional zipCode
↓
┌─────────────────────────────────────────────────────────────────────┐
│ POST /api/chat │
│ (route.ts) │
│ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 1. Validate request │ │
│ │ - Check messages array exists │ │
│ │ - Ensure at least one message │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 2. Format for Claude API │ │
│ │ - Last 10 messages only (cost optimization) │ │
│ │ - System prompt with instructions │ │
│ │ - Model: Claude 3.5 Sonnet │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 3. Call Claude API │ │
│ │ client.messages.create({ │ │
│ │ model: 'claude-3-5-sonnet-20241022', │ │
│ │ max_tokens: 500, │ │
│ │ system: SYSTEM_PROMPT, │ │
│ │ messages: formattedMessages │ │
│ │ }) │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 4. Analyze response │ │
│ │ - hasEnoughProjectInfo() │ │
│ │ - Determine response type │ │
│ │ - Calculate recommendation if ready │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 5. Return structured response │ │
│ │ { │ │
│ │ reply: string, │ │
│ │ type: 'text' | 'recommendation' | 'waiting_for_zip', │ │
│ │ recommendation?: {...}, │ │
│ │ needsZipCode?: boolean │ │
│ │ } │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
↓
ChatResponse
↓
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND LOGIC │
│ (ai-chatbot-refactored.tsx) │
│ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 1. Add bot message to messages array │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 2. Check response type: │ │
│ │ - 'text': Show normal message │ │
│ │ - 'recommendation': Show special card + booking button │ │
│ │ - 'waiting_for_zip': Show ZIP input prompt │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 3. Render and scroll to bottom │ │
│ │ - Scroll for readability │ │
│ │ - Display recommendation card if applicable │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

\*/

// ============================================================================
// PART 2: DATA FLOW & STATE MANAGEMENT
// ============================================================================

/\*

STATE: messages[]
├─ id: unique identifier
├─ text: message content
├─ sender: 'user' | 'bot'
├─ timestamp: when sent
└─ type?: 'text' | 'recommendation'

STATE: input
└─ current text in input field

STATE: zipCode
└─ customer's ZIP code (collected later)

STATE: showZipPrompt
├─ true: show ZIP input field
└─ false: show normal chat

STATE: isLoading
├─ true: waiting for API response
└─ false: ready for new input

STATE: recommendation
└─ null: no recommendation yet
└─ {...}: recommendation data once made

FLOW: User sends message

1. Create Message object with sender='user'
2. Add to messages[] state
3. Clear input field
4. Set isLoading=true
5. Call sendToAPI(messages, zipCode)
6. Wait for response
7. Receive ChatResponse
8. Create Message object with sender='bot'
9. Add to messages[] state
10. If response.type === 'recommendation':
    - Save recommendation to state
11. If response.needsZipCode:
    - Set showZipPrompt=true
12. Set isLoading=false
13. Re-render UI

\*/

// ============================================================================
// PART 3: IMPLEMENTATION PATTERNS
// ============================================================================

/\*\*

- PATTERN 1: Basic Usage
-
- Simply replace old chatbot with new one
  \*/

// Before:
// import { AIChatbot } from '@/components/ai-chatbot'
// export default MyPage() { return <AIChatbot /> }

// After:
// import { AIChatbotRefactored } from '@/components/ai-chatbot-refactored'
// export default MyPage() { return <AIChatbotRefactored /> }

/\*\*

- PATTERN 2: Using Chat Utils Directly
-
- If you want to integrate chat into your own component
  \*/

import { useState } from 'react';
import { sendChatMessage, ChatMessage, ChatResponse } from '@/lib/utils/chat';

export function CustomChatComponent() {
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [loading, setLoading] = useState(false);

const handleSend = async (text: string, zipCode?: string) => {
// Add user message
const userMsg: ChatMessage = { role: 'user', content: text };
const allMessages = [...messages, userMsg];
setMessages(allMessages);

    setLoading(true);
    try {
      // Send to API
      const response = await sendChatMessage(allMessages, zipCode);

      // Add bot response
      const botMsg: ChatMessage = {
        role: 'assistant',
        content: response.reply,
      };
      setMessages(prev => [...prev, botMsg]);

      // Handle recommendation
      if (response.recommendation) {
        // Do something with recommendation
        console.log('Recommended:', response.recommendation.size, 'yards');
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }

};

return (
<div>
{/_ Render messages _/}
{messages.map(msg => (
<div key={msg.content}>
<strong>{msg.role}:</strong> {msg.content}
</div>
))}

      {/* Input */}
      <input
        placeholder="Type message..."
        onKeyPress={e => {
          if (e.key === 'Enter') {
            handleSend(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>

);
}

/\*\*

- PATTERN 3: Custom System Prompt
-
- Change Claude's behavior by modifying SYSTEM_PROMPT in route.ts
  \*/

const CUSTOM_SYSTEM_PROMPT = `You are a friendly dumpster rental chatbot for Blue Sky Disposal.

Your personality:

- Friendly and conversational
- Knowledgeable about waste disposal
- Patient and helpful
- Slightly humorous

Recommendation rules:

- Always recommend the MINIMUM size needed
- Consider budget as well as capacity
- Ask about budget constraints if appropriate
- Mention eco-friendly disposal options

Remember: Make the customer feel heard and understood.`;

/\*\*

- PATTERN 4: Extending with Project Context
-
- You could pass additional project info to the API
  \*/

// POST /api/chat with extended context:
const extendedRequest = {
messages: [...],
zipCode: '48202',
projectInfo: {
timestamp: '2024-05-06',
pageSource: 'home_page',
userType: 'first_time_visitor',
previousRecommendations: [], // Could store past recs
},
};

// route.ts would receive this and could use it:
if (body.projectInfo?.pageSource === 'services_page') {
// Add additional context to system prompt
}

// ============================================================================
// PART 4: BEST PRACTICES
// ============================================================================

/\*

✅ DO:

- Keep messages concise and friendly
- Ask one question at a time
- Listen to what customer says before recommending
- Explain WHY you're making a recommendation
- Handle errors gracefully
- Log API calls for debugging
- Monitor Claude API costs

❌ DON'T:

- Ask multiple questions at once
- Make recommendation immediately
- Push for ZIP code too early
- Ignore what customer said
- Show API errors to users
- Make recommendations without enough info
- Rely entirely on regex patterns (use Claude's intelligence)

🔧 MAINTENANCE:

- Review conversation logs regularly
- Adjust system prompt based on real conversations
- Test edge cases (typos, off-topic, hostile messages)
- Update dumpster sizing logic based on feedback
- Monitor Claude API availability
- Set up alerts for API failures

💰 COST OPTIMIZATION:

- Use Haiku model for simpler questions
- Implement caching for common questions
- Limit conversation history (currently 10 messages)
- Monitor token usage
- Set up rate limiting if needed

\*/

// ============================================================================
// PART 5: ADVANCED CUSTOMIZATIONS
// ============================================================================

/\*\*

- ADVANCED 1: Multi-language Support
-
- Detect language and adjust system prompt
  \*/

const PROMPTS = {
en: 'You are a friendly dumpster rental assistant...',
es: 'Eres un asistente amable de alquiler de contenedores...',
fr: 'Vous êtes un assistant amical de location de bennes...',
};

// In route.ts:
const language = body.language || 'en';
const systemPrompt = PROMPTS[language];

/\*\*

- ADVANCED 2: A/B Testing Different Prompts
-
- Test which system prompt performs better
  \*/

const PROMPT_VARIANTS = {
v1: 'You are a friendly dumpster assistant...',
v2: 'You are a professional waste management consultant...',
v3: 'You are a quirky, fun dumpster rental buddy...',
};

// In route.ts:
const variant = body.variantId || 'v1';
const systemPrompt = PROMPT_VARIANTS[variant];

// Log which variant was used for analytics
console.log(`Using prompt variant: ${variant}`);

/\*\*

- ADVANCED 3: Persistent User Preferences
-
- Remember customer preferences across conversations
  \*/

import { supabase } from '@/lib/supabase/client';

async function getUserPreferences(userId: string) {
const { data } = await supabase
.from('customer_preferences')
.select('\*')
.eq('id', userId)
.single();
return data;
}

// In route.ts:
const userPrefs = await getUserPreferences(body.userId);
if (userPrefs?.preferredSize) {
// Add to system prompt or response logic
}

/\*\*

- ADVANCED 4: Feedback Loop
-
- Track if recommendations were helpful
  \*/

interface ConversationMetrics {
messageCount: number;
timeToRecommendation: number;
zipCodeAskedWhen: 'early' | 'late' | 'not_asked';
recommendedSize: number;
userAccepted: boolean;
rating?: number;
}

// Save metrics to analytics database
async function logConversationMetrics(metrics: ConversationMetrics) {
await supabase.from('conversation_metrics').insert([metrics]);
}

/\*\*

- ADVANCED 5: Smart Follow-ups
-
- If user is hesitant, offer alternatives
  \*/

// In route.ts:
const hesitationKeywords = ['hmm', 'maybe', 'not sure', 'expensive', 'too much'];
const userHesitant = hesitationKeywords.some(kw =>
lastUserMessage.toLowerCase().includes(kw)
);

if (userHesitant && response.type === 'recommendation') {
// Modify response to include smaller/cheaper option
response.alternativeRecommendation = {
size: response.recommendation.size - 5,
reason: 'More budget-friendly option',
};
}

/\*\*

- ADVANCED 6: Rate Limiting & Abuse Prevention
  \*/

import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({
tokensPerInterval: 30,
interval: 'hour',
maxWaitTime: 60000,
});

export async function POST(request: NextRequest) {
const clientIp = request.ip || 'unknown';

if (!(await limiter.tryRemoveTokens(1))) {
return NextResponse.json(
{ reply: 'Too many requests. Please try again later.' },
{ status: 429 }
);
}

// ... continue with normal logic
}

// ============================================================================
// PART 6: MONITORING & DEBUGGING
// ============================================================================

/\*

LOG IMPORTANT EVENTS:

1. API Calls
   - Request: messages, zipCode
   - Response: reply, type, recommendation
   - Duration: how long Claude took
   - Tokens: input + output tokens

2. Conversation Flow
   - When does user first mention project?
   - When does bot ask for ZIP?
   - When does bot make recommendation?
   - Does user accept or push back?

3. Error Cases
   - Claude API failures
   - Invalid ZIP codes
   - Timeout errors
   - Rate limiting

EXAMPLE LOGGING:

const startTime = Date.now();
console.log('Chat request', {
messageCount: messages.length,
hasZipCode: !!zipCode,
timestamp: new Date().toISOString(),
});

try {
const response = await client.messages.create({...});
const duration = Date.now() - startTime;

console.log('Chat response', {
duration,
responseType: responseType,
hasRecommendation: !!recommendation,
tokensUsed: response.usage,
});
} catch (error) {
console.error('Chat error', {
error: error.message,
duration: Date.now() - startTime,
timestamp: new Date().toISOString(),
});
}

\*/

// ============================================================================
// DEPLOYMENT CHECKLIST
// ============================================================================

/\*

BEFORE GOING LIVE:

Security

- [ ] ANTHROPIC_API_KEY is NOT in git history
- [ ] API key stored in environment variables
- [ ] Rate limiting is enabled
- [ ] Input validation on backend
- [ ] No sensitive data in logs

Performance

- [ ] Conversation history limited to 10 messages
- [ ] Response times < 2 seconds average
- [ ] Claude model is appropriate for use case
- [ ] No memory leaks in component

Functionality

- [ ] Chatbot loads without errors
- [ ] Messages send and receive properly
- [ ] ZIP code flow works correctly
- [ ] Recommendations are accurate
- [ ] Booking integration works

Testing

- [ ] Tested with various project types
- [ ] Tested with different conversation lengths
- [ ] Tested with typos and weird input
- [ ] Tested on mobile
- [ ] Tested error states

Monitoring

- [ ] Error logging set up
- [ ] Conversation metrics logged
- [ ] API usage monitored
- [ ] Performance metrics tracked
- [ ] User feedback collection ready

\*/

console.log('✨ Claude Chatbot System Architecture Guide');
console.log('For detailed implementation, see CHATBOT_INTEGRATION_GUIDE.md');
