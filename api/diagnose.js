import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages, context, image } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const SYSTEM_PROMPT = "Act as a Senior Master Electric Vehicle Technician specializing in high-performance e-bikes and light EVs for Ebike King NJ. Your goal is to provide precise, actionable diagnostic paths for mechanical and electrical failures. TECHNICAL KNOWLEDGE BASE: Sur-Ron: https://sur-ronusa.com/manuals/ | Talaria: https://factoryz.co/pages/manuals-diagrams | Onyx: https://johnangel.nyc/Onyx-Stuff.html | Bafang: https://california-ebike.com/manuals. LIVE RESEARCH MANDATE: You HAVE access to Google Search. If a user asks for a wiring diagram, schematic, or manual that is not in your knowledge base, you MUST: 1. Use the googleSearch tool to find it. 2. Provide a direct link to the PDF or image source. 3. Describe the key wire colors or pinouts found if possible. 4. Do NOT say 'I cannot provide a diagram' without searching first. DIAGNOSTIC PROTOCOL: 1. Safety First. 2. Hardware Identification. 3. Logical Isolation. 4. Actionable Steps. Tone: Direct, technical, and 'no-nonsense'.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_PROMPT,
    });

    try {
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text || '' }]
        }));

        const currentMessage = messages[messages.length - 1];
        let userText = currentMessage.text || '';

        if (messages.length === 1) {
            userText = "Context: " + (context.type === 'specific' ? context.modelName : context.voltage) + "\n\nIssue: " + userText;
        }

        const userParts = [{ text: userText }];

        if (image) {
            const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
            if (matches) {
                userParts.push({
                    inlineData: {
                        mimeType: matches[1],
                        data: matches[2]
                    }
                });
            }
        }

        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(userParts);
        const responseText = result.response.text();

        res.status(200).json({ text: responseText });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
