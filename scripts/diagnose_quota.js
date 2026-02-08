const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ API Key not found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = [
        { name: "gemini-1.5-flash-8b", version: "v1" },
        { name: "gemini-flash-latest", version: "v1" },
        { name: "gemini-1.5-flash-latest", version: "v1" },
        { name: "gemini-1.5-pro-latest", version: "v1" },
        { name: "gemini-2.0-flash-lite-001", version: "v1beta" }
    ];

    console.log("Starting quota diagnostic...");

    for (const test of modelsToTest) {
        try {
            console.log(`Testing [${test.name}] with [${test.version}]...`);
            const model = genAI.getGenerativeModel({ model: test.name }, { apiVersion: test.version });
            const result = await model.generateContent("hello");
            const text = result.response.text();
            console.log(`✅ SUCCESS: [${test.name}] works! Response: ${text}`);
            return;
        } catch (e) {
            console.log(`❌ FAILED: [${test.name}] - ${e.message.split('\n')[0]}`);
        }
    }
}

diagnose();
