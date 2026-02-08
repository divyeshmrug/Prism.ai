const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-flash-latest",
        "gemini-1.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite-preview",
        "gemini-2.5-flash",
        "gemini-1.5-flash-8b"
    ];
    const versions = ["v1beta", "v1"];

    console.log("Exhaustive Diagnostic Start...");

    for (const modelName of models) {
        for (const apiVersion of versions) {
            try {
                console.log(`Testing [${modelName}] with [${apiVersion}]...`);
                const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
                const result = await model.generateContent("hi");
                console.log(`✅ SUCCESS: [${modelName}] with [${apiVersion}] WORKS!`);
                return;
            } catch (e) {
                console.log(`❌ FAILED [${modelName}] [${apiVersion}]: ${e.message.split('\n')[0]}`);
            }
        }
    }
}

diagnose();
