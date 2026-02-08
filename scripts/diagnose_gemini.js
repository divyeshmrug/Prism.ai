const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.error("❌ API Key not found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];
    const versions = ["v1", "v1beta"];

    console.log("Starting diagnostic test...");

    for (const modelName of modelsToTest) {
        for (const version of versions) {
            try {
                console.log(`Testing [${modelName}] with [${version}]...`);
                const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: version });
                const result = await model.generateContent("Say 'System OK'");
                const response = await result.response;
                console.log(`✅ SUCCESS: [${modelName}] works with [${version}]. Response: ${response.text()}`);
                return; // Stop after first success
            } catch (e) {
                console.log(`❌ FAILED: [${modelName}] with [${version}] - ${e.message.split('\n')[0]}`);
            }
        }
    }
    console.log("No common models worked. Attempting to list all models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available models for this key:");
            data.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
        } else {
            console.log("Could not list models. Response:", JSON.stringify(data));
        }
    } catch (e) {
        console.log("Failed to list models via direct fetch:", e.message);
    }
}

diagnose();
