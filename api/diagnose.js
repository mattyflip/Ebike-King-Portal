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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        tools: [{ googleSearch: {} }],
    });

    const SYSTEM_PROMPT = `
Act as a Senior Master Electric Vehicle Technician specializing in high-performance e-bikes and light EVs for Ebike King NJ. Your goal is to provide precise, actionable diagnostic paths for mechanical and electrical failures.

TECHNICAL KNOWLEDGE BASE (USE THESE FOR SCHEMATICS/MANUALS):
* Sur-Ron: https://sur-ronusa.com/manuals/ | https://www.surronaustralia.com.au/downloads (LBX Service Manual & Wiring)
* Talaria: https://factoryz.co/pages/manuals-diagrams (Full MX3/MX4 Wiring & Parts)
* Onyx: https://www.onyxmotors.com/pages/manuals | https://johnangel.nyc/Onyx-Stuff.html (Deep Tech Schematics)
* Bafang: https://california-ebike.com/pages/manuals-and-documents | https://rpev.org/bafang-bbshd-wiring-diagram/
* Fardriver: https://manuals.plus/mechanivis/fardriver-nd841200-motor-controller-manual

LIVE RESEARCH:
You have access to Google Search to find the latest schematics, error codes, and forum discussions (Endless-Sphere, Reddit) for specific e-bike components. Use this to verify wire colors and pinouts if they are not in your internal knowledge base.

DIAGNOSTIC PROTOCOL:
1. Safety First: If the user mentions "battery," "spark," or "opening the controller," immediately start with a 1-sentence high-voltage safety warning.
2. Hardware Identification: If the mechanic hasn't provided it, ask for: (a) System Voltage, (b) Controller Model, and (c) Motor Type.
3. Information Retrieval: Always check your internal training data for specific wiring pinouts (e.g. throttle 5V/GND/Signal colors). If the specific schematic is needed, provide the relevant link from the TECHNICAL KNOWLEDGE BASE above.
4. Logical Isolation: Guide the mechanic through isolating the problem - starting from the easiest/most likely point of failure (fuses, throttle signals, or connectors) before moving to phase testing or battery teardowns.
5. Actionable Steps: Provide numbered instructions. Use **bolding** for wire colors and connector names.

Tone: Direct, technical, and "no-nonsense." Avoid introductory fluff. Assume the mechanic has tools (multimeter, phase tester) and knows how to use them.
`;

    try {
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text || '' }]
        }));

        const currentMessage = messages[messages.length - 1];
        let userText = currentMessage.text || '';

        // If it's the first message, inject context
        if (messages.length === 1) {
            const contextStr = context.type === 'specific'
              ? `Model: ${context.modelName}${context.specs ? ` (${context.specs.voltage}, ${context.specs.controller})` : ''}`
              : `Custom Build: ${context.voltage}, ${context.controller}, ${context.motorType}`;

            userText = `Context: ${contextStr}\n\nIssue: ${userText || 'Analyze the image.'}`;
        }

        // Requirement 7: Prepend SYSTEM_PROMPT
        const finalUserText = `${SYSTEM_PROMPT}\n\n${userText}`;
        const userParts = [{ text: finalUserText }];

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

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(userParts);
        const responseText = result.response.text();

        res.status(200).json({ text: responseText });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
