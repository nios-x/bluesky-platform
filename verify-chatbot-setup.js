#!/usr/bin/env node

/**
 * Verify Claude Chatbot Setup (Node.js version)
 * Run: node verify-chatbot-setup.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Checking Claude Chatbot Setup...\n");

const checks = [];

// 1. Check .env.local
console.log("1️⃣  Checking .env.local...");
const envFile = path.join(__dirname, ".env.local");
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf-8");
  if (envContent.includes("ANTHROPIC_API_KEY")) {
    console.log("   ✅ ANTHROPIC_API_KEY found in .env.local");
    checks.push(true);
  } else {
    console.log("   ⚠️  ANTHROPIC_API_KEY NOT found in .env.local");
    console.log("   👉 Add this line to .env.local:");
    console.log("      ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx");
    checks.push(false);
  }
} else {
  console.log("   ❌ .env.local not found");
  console.log("   👉 Create .env.local with your ANTHROPIC_API_KEY");
  checks.push(false);
}

console.log("");

// 2. Check if new files exist
console.log("2️⃣  Checking new files...");
const requiredFiles = [
  "app/api/chat/route.ts",
  "components/ai-chatbot-refactored.tsx",
  "lib/utils/chat.ts",
];

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
    checks.push(true);
  } else {
    console.log(`   ❌ ${file} NOT found`);
    checks.push(false);
  }
});

console.log("");

// 3. Check package.json for dependencies
console.log("3️⃣  Checking dependencies...");
const packageJsonPath = path.join(__dirname, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (
    packageJson.dependencies &&
    packageJson.dependencies["@anthropic-ai/sdk"]
  ) {
    console.log("   ✅ @anthropic-ai/sdk is in package.json");
    checks.push(true);
  } else {
    console.log("   ❌ @anthropic-ai/sdk NOT in package.json");
    console.log("   👉 Run: npm install @anthropic-ai/sdk");
    checks.push(false);
  }
}

console.log("");

// Summary
console.log("📋 Setup Checklist:");
console.log(
  checks[0]
    ? "   ✅ ANTHROPIC_API_KEY added to .env.local"
    : "   [ ] ANTHROPIC_API_KEY added to .env.local",
);
console.log(
  checks.slice(1, 4).every((c) => c)
    ? "   ✅ All new files created"
    : "   [ ] All new files created",
);
console.log(
  checks[4]
    ? "   ✅ @anthropic-ai/sdk in dependencies"
    : "   [ ] @anthropic-ai/sdk in dependencies",
);
console.log("   [ ] app/layout.tsx updated to use <AIChatbotRefactored />");
console.log("   [ ] npm run dev started");

console.log("");

if (checks.every((c) => c)) {
  console.log("✨ Your chatbot is ready to use!");
  process.exit(0);
} else {
  console.log("⚠️  Please fix the issues above before using the chatbot");
  process.exit(1);
}
