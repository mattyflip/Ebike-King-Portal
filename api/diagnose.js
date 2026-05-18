import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages, context, image } = req.body;
    
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const SYSTEM_PROMPT = `Act as a Senior Master Electric Vehicle Technician specializing in high-performance e-bikes and light EVs for DiagOS. 

TECHNICAL KNOWLEDGE BASE (2026 MASTER LIST):
* High-Performance: Sur-Ron (Light Bee/Ultra), Talaria (Sting R/MX4), Onyx (RCR/CTY2), Super73 (R/S/Z-series). Focus on 72V conversions, BAC4000/8000 tuning, and phase wire optimization.
* Market Leaders: Aventon (Level/Aventure), Lectric (XP 3.0/4), Rad Power (RadRunner/Wagon). Prioritize Error 30 (Comm), torque sensor calibration, and proprietary controller handshakes.
* Amazon/Budget: Macfox (X1/X2), Ridstar, Happyrun, Ridingtimes, Meelod, Jasion, Ancheer. Focus on "Ghost Throttles," MOSFET failure, waterproofing issues, and generic SW900/S866 display error codes (E07, E10).
* Niche/Emerging: Goat Power, Vanpowers, Wired, E-Cells. Specialize in BMS deep-sleep recovery and dual-battery balancing logic.

DIAGNOSTIC PROTOCOL:
1. Safety First (HV isolation). 2. Hardware ID (Identify OEM vs Aftermarket). 3. Logical Isolation (Multimeter/Phase test). 4. Actionable Steps.

Tone: Direct, technical, and "no-nonsense." Assume the mechanic has high-end tools. If the bike is an "Amazon" brand, warn about non-UL battery safety first.`;

    const currentMessage = messages[messages.length - 1];
    let userText = currentMessage.text || '';
    if (messages.length === 1) {
        const contextStr = context.type === 'specific' ? context.modelName : `${context.voltage}V Custom Build`;
        userText = `Context: ${contextStr}\nIssue: ${userText}`;
    }

    // --- TIER 1: OPENROUTER (FREE MODELS) ---
    if (openrouterKey) {
        try {
            console.log("Attempting Tier 1: OpenRouter (Free Model)");
            const history = messages.slice(0, -1).map(m => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.text || ''
            }));

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openrouterKey}`,
                    "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
                    "X-Title": "Ebike King Diagnostic Portal", // Required by OpenRouter
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-flash-exp:free", // Example free model
                    "messages": [
                        { "role": "system", "content": SYSTEM_PROMPT },
                        ...history,
                        { "role": "user", "content": userText }
                    ]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return res.status(200).json({ 
                    text: data.choices[0].message.content, 
                    provider: 'openrouter-free' 
                });
            }
            console.warn("OpenRouter returned no choices, falling back...");
        } catch (error) {
            console.error('OpenRouter Error, falling back:', error);
        }
    }

    // --- TIER 2: NATIVE GEMINI (LOW COST) ---
    if (geminiKey) {
        try {
            console.log("Attempting Tier 2: Native Gemini");
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            let promptContent = [SYSTEM_PROMPT + "\n\n" + userText];
            
            if (image) {
                const base64Data = image.split(',')[1];
                promptContent.push({
                    inlineData: { data: base64Data, mimeType: "image/jpeg" }
                });
            }

            const result = await model.generateContent(promptContent);
            const response = await result.response;
            return res.status(200).json({ text: response.text(), provider: 'gemini-native' });
        } catch (error) {
            console.error('Gemini Native Error, falling back:', error);
        }
    }

    // --- TIER 3: OPENAI (FALLBACK) ---
    if (openaiKey) {
        try {
            console.log("Attempting Tier 3: OpenAI Fallback");
            const history = messages.slice(0, -1).map(m => ({
                role: m.role,
                content: m.text || ''
            }));

            const content = [{ type: 'text', text: SYSTEM_PROMPT + "\n\n" + userText }];
            if (image) content.push({ type: 'image_url', image_url: { url: image } });

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [...history, { role: 'user', content }],
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            return res.status(200).json({ text: data.choices[0].message.content, provider: 'openai' });
        } catch (error) {
            console.error('OpenAI Error:', error);
        }
    }

    // --- TIER 4: LOCAL OLLAMA (LAST RESORT) ---
    try {
        console.log("Attempting Tier 4: Local Ollama");
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'llama3',
                prompt: SYSTEM_PROMPT + "\n\n" + userText,
                stream: false
            })
        });
        const data = await ollamaResponse.json();
        return res.status(200).json({ text: data.response, provider: 'ollama-local' });
    } catch (error) {
        return res.status(500).json({ error: 'All AI providers failed including local fallback.' });
    }
}
