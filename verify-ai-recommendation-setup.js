#!/usr/bin/env node

/**
 * VERIFICATION SCRIPT
 * Checks that all required files for the AI Recommendation System are in place
 *
 * Run: node verify-ai-recommendation-setup.js
 */

const fs = require("fs");
const path = require("path");

const requiredFiles = {
  // Core API files
  "app/api/recommendation/route.js": "API Endpoint Handler",
  "lib/controllers/recommendation.js": "Business Logic & AI Integration",
  "lib/models/ai_log.js": "Supabase Logging Model",

  // Utilities & Components
  "lib/utils/recommendation.ts": "Client-side Helper Functions",
  "components/ai-recommendation-form.tsx": "Example React Component",

  // Database
  "db/migrations/001_create_ai_logs_table.sql": "Database Migration",

  // Documentation
  "AI_RECOMMENDATION_SYSTEM.md": "Full Documentation",
  "RECOMMENDATION_SETUP.md": "Quick Start Guide",
  "IMPLEMENTATION_SUMMARY.md": "Implementation Overview",
  "FINAL_VERIFICATION_NOTES.md": "Setup & Verification Notes",
};

const environmentVariables = ["ANTHROPIC_API_KEY"];

console.log("\n🔍 AI RECOMMENDATION SYSTEM - VERIFICATION SCRIPT\n");
console.log("=".repeat(60));

// Check files
console.log("\n📁 Checking Required Files...\n");

let filesOK = 0;
let filesMissing = 0;

Object.entries(requiredFiles).forEach(([file, description]) => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  const status = exists ? "✅" : "❌";

  if (exists) {
    filesOK++;
    const size = fs.statSync(filePath).size;
    console.log(`${status} ${file}`);
    console.log(`   └─ ${description} (${size} bytes)`);
  } else {
    filesMissing++;
    console.log(`${status} ${file}`);
    console.log(`   └─ ${description} (MISSING)`);
  }
});

// Check package.json for Anthropic SDK
console.log("\n📦 Checking Dependencies...\n");
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"),
  );

  if (
    packageJson.dependencies &&
    packageJson.dependencies["@anthropic-ai/sdk"]
  ) {
    console.log(
      `✅ @anthropic-ai/sdk: ${packageJson.dependencies["@anthropic-ai/sdk"]}`,
    );
  } else {
    console.log("❌ @anthropic-ai/sdk: NOT FOUND in package.json");
    console.log("   └─ Run: npm install");
  }
} catch (err) {
  console.log("❌ Could not read package.json");
}

// Check environment
console.log("\n🔐 Checking Environment Variables...\n");

const envFile = path.join(process.cwd(), ".env.local");
let envOK = 0;
let envMissing = 0;

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf-8");

  environmentVariables.forEach((variable) => {
    if (envContent.includes(variable)) {
      const hasValue =
        envContent.includes(`${variable}=sk-ant-`) ||
        envContent.includes(`${variable}=`);
      if (hasValue) {
        console.log(`✅ ${variable}: Configured`);
        envOK++;
      } else {
        console.log(`⚠️  ${variable}: Found but empty`);
        envMissing++;
      }
    } else {
      console.log(`❌ ${variable}: NOT FOUND in .env.local`);
      envMissing++;
    }
  });
} else {
  console.log("⚠️  .env.local not found");
  console.log("   └─ You need to create it with ANTHROPIC_API_KEY");
  environmentVariables.forEach((v) => {
    console.log(`❌ ${v}: NOT CONFIGURED`);
    envMissing++;
  });
}

// Summary
console.log("\n" + "=".repeat(60));
console.log("\n📊 VERIFICATION SUMMARY\n");

console.log(`Files:        ${filesOK}/${Object.keys(requiredFiles).length} ✓`);
console.log(`Environment:  ${envOK}/${environmentVariables.length} ✓`);

const allGood = filesMissing === 0 && envMissing === 0;

if (allGood) {
  console.log("\n✅ ALL CHECKS PASSED - Ready to use!\n");
  console.log("Next steps:");
  console.log("1. Run: npm install");
  console.log("2. Run: npm run dev");
  console.log(
    "3. Test: curl -X POST http://localhost:3000/api/recommendation ...\n",
  );
  process.exit(0);
} else {
  console.log("\n❌ SOME CHECKS FAILED - See above for details\n");
  console.log("Required actions:");

  if (filesMissing > 0) {
    console.log(`• ${filesMissing} file(s) missing - check file paths`);
  }

  if (envMissing > 0) {
    console.log("• Add ANTHROPIC_API_KEY to .env.local");
    console.log("  Get key from: https://console.anthropic.com/");
  }

  console.log("\nFor help, see: AI_RECOMMENDATION_SYSTEM.md\n");
  process.exit(1);
}
