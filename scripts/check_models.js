const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.error("API Key not found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // Note: The SDK doesn't have a direct listModels, but we can try to fetch them via the Google AI platform API
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-pro-vision"];

        for (const modelName of models) {
            try {
                console.log(`Testing ${modelName} with v1...`);
                const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });
                const result = await model.generateContent("hi");
                const response = await result.response;
                console.log(`✅ Model ${modelName} (v1) is working.`);
            } catch (e) {
                console.log(`❌ Model ${modelName} (v1) failed: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
