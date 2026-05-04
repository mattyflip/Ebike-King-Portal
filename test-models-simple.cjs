const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        console.log("Listing models...");
        const result = await genAI.listModels();
        console.log("Models found:", result.models.map(m => m.name));
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

test();
