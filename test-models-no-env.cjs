const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const key = "AIzaSyDhzRgh3Ev56MZRdgohO1topAlsYp2duqE";
    const genAI = new GoogleGenerativeAI(key);
    try {
        console.log("Listing models...");
        const result = await genAI.listModels();
        console.log("Models found:", result.models.map(m => m.name));
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

test();
