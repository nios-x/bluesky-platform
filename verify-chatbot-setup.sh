#!/bin/bash

# Verify Claude Chatbot Setup
# This script checks if everything is configured correctly

echo "🔍 Checking Claude Chatbot Setup..."
echo ""

# Check if .env.local exists
echo "1️⃣  Checking .env.local..."
if [ -f .env.local ]; then
    if grep -q "ANTHROPIC_API_KEY" .env.local; then
        echo "   ✅ ANTHROPIC_API_KEY found in .env.local"
    else
        echo "   ⚠️  ANTHROPIC_API_KEY NOT found in .env.local"
        echo "   👉 Add this line to .env.local:"
        echo "      ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx"
    fi
else
    echo "   ❌ .env.local not found"
    echo "   👉 Create .env.local with your ANTHROPIC_API_KEY"
fi

echo ""

# Check if new files exist
echo "2️⃣  Checking new files..."

files=(
    "app/api/chat/route.ts"
    "components/ai-chatbot-refactored.tsx"
    "lib/utils/chat.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file NOT found"
    fi
done

echo ""

# Check if @anthropic-ai/sdk is installed
echo "3️⃣  Checking dependencies..."
if npm list @anthropic-ai/sdk > /dev/null 2>&1; then
    echo "   ✅ @anthropic-ai/sdk is installed"
else
    echo "   ❌ @anthropic-ai/sdk NOT installed"
    echo "   👉 Run: npm install @anthropic-ai/sdk"
fi

echo ""

# Summary
echo "📋 Setup Checklist:"
echo "   [ ] ANTHROPIC_API_KEY added to .env.local"
echo "   [ ] All new files created"
echo "   [ ] Dependencies installed"
echo "   [ ] app/layout.tsx updated to use <AIChatbotRefactored />"
echo "   [ ] npm run dev started"
echo ""
echo "✨ Once all are complete, your chatbot is ready to use!"
