# 🏗️ Claude Chatbot System Architecture

## Complete System Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │     AIChatbotRefactored Component (React)                   │ │
│  │                                                               │ │
│  │  State:                                                       │ │
│  │  ├─ messages[] - conversation history                        │ │
│  │  ├─ input - text in input field                              │ │
│  │  ├─ zipCode - collected ZIP code                             │ │
│  │  ├─ isLoading - waiting for API response                     │ │
│  │  ├─ showZipPrompt - should show ZIP input?                   │ │
│  │  └─ recommendation - recommendation object                   │ │
│  │                                                               │ │
│  │  UI:                                                          │ │
│  │  ├─ Chat bubble button (bottom-right)                        │ │
│  │  ├─ Message display area                                     │ │
│  │  ├─ ZIP code input (conditional)                             │ │
│  │  ├─ Text input + Send button                                 │ │
│  │  └─ Recommendation card (conditional)                        │ │
│  │                                                               │ │
│  │  Functions:                                                  │ │
│  │  ├─ handleSendMessage() - process user input                │ │
│  │  └─ sendToAPI() - call Claude chat endpoint                 │ │
│  │                                                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                            ↓ HTTP POST                             │
│                 /api/chat (JSON)                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS SERVER                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │        POST /api/chat Endpoint (route.ts)                    │ │
│  │                                                               │ │
│  │  1. Validate Input                                            │ │
│  │     ├─ Check messages array exists                            │ │
│  │     ├─ Validate at least 1 message                            │ │
│  │     └─ Return error if invalid                                │ │
│  │                                                               │ │
│  │  2. Prepare for Claude                                        │ │
│  │     ├─ Take last 10 messages (optimize cost)                 │ │
│  │     ├─ Add system prompt                                      │ │
│  │     └─ Format for Claude API                                  │ │
│  │                                                               │ │
│  │  3. Call Claude API                                           │ │
│  │     ├─ Model: claude-3-5-sonnet-20241022                     │ │
│  │     ├─ Max tokens: 500                                        │ │
│  │     ├─ System: SYSTEM_PROMPT                                  │ │
│  │     └─ Messages: conversation history                         │ │
│  │                                                               │ │
│  │  4. Analyze Response                                          │ │
│  │     ├─ hasEnoughProjectInfo() check                           │ │
│  │     │   (project type + volume + materials)                  │ │
│  │     ├─ hasZipCode() check                                     │ │
│  │     ├─ Determine response type:                               │ │
│  │     │   ├─ 'text' - normal message                            │ │
│  │     │   ├─ 'waiting_for_zip' - need ZIP                      │ │
│  │     │   └─ 'recommendation' - make recommendation             │ │
│  │     └─ Calculate size if recommending                         │ │
│  │                                                               │ │
│  │  5. Return Response                                           │ │
│  │     {                                                          │ │
│  │       reply: string,                                          │ │
│  │       type: 'text'|'recommendation'|'waiting_for_zip',       │ │
│  │       recommendation?: {                                      │ │
│  │         size: number,                                         │ │
│  │         type: string,                                         │ │
│  │         reason: string,                                       │ │
│  │         price?: number                                        │ │
│  │       },                                                       │ │
│  │       needsZipCode?: boolean                                  │ │
│  │     }                                                          │ │
│  │                                                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                            ↓ HTTP Request                           │
│                 Anthropic Claude API                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                    CLAUDE 3.5 SONNET API                          │
│                    (Anthropic Cloud)                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  System Prompt (instructions for Claude):                         │
│  ├─ "You are a dumpster rental assistant"                        │
│  ├─ "Ask one question at a time"                                 │
│  ├─ "Don't recommend immediately"                                │
│  ├─ "Ask for ZIP only at the final step"                         │
│  └─ Dumpster sizing guidelines                                    │
│                                                                    │
│  Conversation History (last 10 messages):                         │
│  ├─ User message 1 → Assistant response 1                        │
│  ├─ User message 2 → Assistant response 2                        │
│  └─ ... → Current message                                         │
│                                                                    │
│  Claude's Response:                                               │
│  "That sounds like you need a 20-yard dumpster..."              │
│                                                                    │
│  ↓ Returns to server with response + token usage                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

                            ↓ Response sent back

┌────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. Receive Response                                              │
│     ├─ Parse JSON                                                 │
│     ├─ Extract reply text                                         │
│     ├─ Check response type                                        │
│     └─ Get recommendation if present                              │
│                                                                    │
│  2. Update State                                                  │
│     ├─ Add bot message to messages[]                              │
│     ├─ Clear loading indicator                                    │
│     ├─ If type='recommendation':                                  │
│     │   └─ Set recommendation state                               │
│     └─ If needsZipCode:                                           │
│         └─ Set showZipPrompt=true                                 │
│                                                                    │
│  3. Re-render UI                                                  │
│     ├─ Display new bot message                                    │
│     ├─ Show recommendation card (if applicable)                   │
│     ├─ Show ZIP input prompt (if applicable)                      │
│     └─ Scroll to bottom                                           │
│                                                                    │
│  4. Wait for Next User Input                                      │
│     ├─ User types message OR                                      │
│     ├─ User enters ZIP code OR                                    │
│     └─ User clicks "Book This Dumpster"                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Frontend Component: `ai-chatbot-refactored.tsx`

**Responsibilities:**

- Render UI (chat bubble, messages, inputs)
- Manage local state (messages, input, ZIP, loading, etc.)
- Handle user interactions (click, send, ZIP entry)
- Format messages for API
- Call `/api/chat` endpoint
- Display recommendations
- Scroll to bottom

**State Flow:**

```
User Input
  ↓
handleSendMessage()
  ├─ Add to messages[]
  ├─ Clear input
  ├─ Set isLoading=true
  └─ Call sendToAPI()
      ↓
API Response
  ├─ Add bot message to messages[]
  ├─ If recommendation: Save to state
  ├─ If needsZip: Show ZIP prompt
  ├─ Set isLoading=false
  └─ Re-render
```

### 2. Backend Endpoint: `app/api/chat/route.ts`

**Responsibilities:**

- Validate incoming request
- Prepare conversation for Claude
- Call Claude API via SDK
- Analyze response to determine type
- Calculate recommendation if ready
- Return structured response

**Logic Flow:**

```
Incoming Request
  ↓
Validate input
  ├─ messages[] exists?
  ├─ At least 1 message?
  └─ Valid JSON?
      ↓
YES → Format for Claude
  ├─ Last 10 messages
  ├─ Add system prompt
  └─ Add model/parameters
      ↓
Call Claude API
  ├─ Send request
  ├─ Wait for response
  └─ Extract text
      ↓
Analyze Response
  ├─ hasEnoughProjectInfo()?
  ├─ hasZipCode()?
  └─ Determine type
      ↓
Return structured response
  ├─ reply text
  ├─ response type
  ├─ recommendation (if applicable)
  └─ needsZipCode flag
```

### 3. Utilities: `lib/utils/chat.ts`

**Helper Functions:**

```typescript
sendChatMessage()
├─ Takes: messages[], zipCode
└─ Returns: ChatResponse

hasEnoughProjectInfo()
├─ Takes: messages[]
├─ Checks: project type, volume, materials
└─ Returns: boolean

extractZipCode()
├─ Takes: text
├─ Regex search: \d{5}
└─ Returns: string | null

formatRecommendation()
├─ Takes: recommendation object
├─ Formats nicely
└─ Returns: formatted string

getInitialMessage()
├─ Returns initial bot greeting
└─ Used for component init
```

---

## Data Flow Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│ SEQUENCE: User sends message                                    │
└─────────────────────────────────────────────────────────────────┘

1. USER TYPES & CLICKS SEND
   Frontend: handleSendMessage("hello")
   │
   ├─ Create Message object {id, text: "hello", sender: "user"}
   ├─ Add to messages[] state
   ├─ Clear input field
   ├─ Set isLoading = true
   └─ Call sendToAPI()

2. FORMAT & SEND
   Frontend: sendToAPI(messages, zipCode)
   │
   ├─ Create request body:
   │  {
   │    messages: [{role: 'user', content: 'hello'}, ...],
   │    zipCode: '48202'
   │  }
   ├─ POST to /api/chat
   └─ Wait for response

3. BACKEND PROCESSING
   Server: POST /api/chat
   │
   ├─ Validate request
   ├─ Extract messages
   ├─ Take last 10 messages
   ├─ Prepare for Claude:
   │  {
   │    model: 'claude-3-5-sonnet-20241022',
   │    messages: [...],
   │    system: SYSTEM_PROMPT,
   │    max_tokens: 500
   │  }
   ├─ Call Anthropic API
   ├─ Get response: "Great! What kind of project?"
   ├─ Analyze:
   │  - hasEnoughProjectInfo? → NO
   │  - Type → 'text'
   └─ Return:
      {
        reply: "Great! What kind of project?",
        type: 'text'
      }

4. FRONTEND RECEIVES RESPONSE
   Frontend: receive ChatResponse
   │
   ├─ Create Message object {id, text: "Great!...", sender: "bot"}
   ├─ Add to messages[]
   ├─ Set isLoading = false
   ├─ If type === 'recommendation':
   │  └─ Save recommendation to state
   ├─ If needsZipCode:
   │  └─ Set showZipPrompt = true
   └─ Re-render component

5. UI UPDATES
   Frontend: render()
   │
   ├─ Display new bot message
   ├─ If recommendation: Show card with "Book Button"
   ├─ If needsZip: Show ZIP input field
   ├─ Scroll to bottom
   └─ Ready for next user input

6. CYCLE REPEATS
   User types next message
   └─ Back to step 1...
```

---

## Key Decision Points

### When to Ask for ZIP Code

```
if (hasEnoughProjectInfo && !hasZipCode) {
  type = 'waiting_for_zip'
  needsZipCode = true
}
```

### When to Make Recommendation

```
if (hasEnoughProjectInfo && hasZipCode) {
  type = 'recommendation'
  recommendation = calculateRecommendation()
}
```

### How to Calculate Size

```
recommendedSize = 20  // Default

if (hasConcrete || hasHeavyMaterial) size += 10
if (hasFullDemolition) size = 30
if (hasSmallProject) size = 10
```

---

## Information Detection

The system detects when it has enough information through pattern matching:

### Project Type Detection

Keywords: `garage, basement, renovation, construction, cleanup, garden, attic, remodel, demolition, etc.`

### Volume Detection

Keywords: `full, entire, lot of, small, medium, large, multiple, single, several, etc.`

### Material Detection

Keywords: `wood, concrete, furniture, household, construction, brick, tile, appliance, debris, etc.`

Once all 3 are detected → Enough info collected ✓

---

## Response Type State Machine

```
                    [User sends message]
                            ↓
                    [Analyze by Claude]
                            ↓
                Has enough info about project?
                    ↙              ↖
                  NO              YES
                   ↓                ↓
            type='text'     Has ZIP code?
            (ask more)      ↙         ↖
                          NO          YES
                           ↓            ↓
                  type='waiting_for_zip'  type='recommendation'
                  (ask for ZIP)           (make recommendation)
```

---

## Token Usage Optimization

```
Message History: Store full history in frontend state
API Call: Only send last 10 messages to Claude
Cost Impact:
  - Full history: 10,000 tokens × $0.003 = $0.03
  - Last 10: 2,000 tokens × $0.003 = $0.006
  - Savings: 80% reduction in token cost
```

---

## Error Handling

```
API Error Flow:

API Request Fails
    ↓
catch(error)
    ├─ Log error
    ├─ Create error message:
    │  "Sorry, I encountered an error. Please try again."
    ├─ Add to messages[]
    └─ Display to user

User can retry:
├─ Type message again
└─ System tries again
```

---

## Security & Best Practices

```
🔐 Security:
- API key in .env.local (never in code)
- API key never sent to frontend
- All sensitive logic on backend
- Input validation on both ends
- CORS headers configured

⚡ Performance:
- Last 10 messages only (cost)
- Response cached? (consider)
- Rate limiting ready
- Error handling graceful

📊 Monitoring:
- Log each request/response
- Track token usage
- Monitor response times
- Alert on errors
```

---

**This architecture enables natural, conversational AI while maintaining performance, security, and cost efficiency.**
