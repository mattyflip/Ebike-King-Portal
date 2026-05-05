export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages, context, image } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    }

    const SYSTEM_PROMPT = "Act as a Senior Master Electric Vehicle Technician specializing in high-performance e-bikes and light EVs for Ebike King NJ. Your goal is to provide precise, actionable diagnostic paths for mechanical and electrical failures. TECHNICAL KNOWLEDGE BASE: Sur-Ron: https://sur-ronusa.com/manuals/ | Talaria: https://factoryz.co/pages/manuals-diagrams | Onyx: https://johnangel.nyc/Onyx-Stuff.html | Bafang: https://california-ebike.com/manuals. LIVE RESEARCH MANDATE: You HAVE access to Google Search. If a user asks for a wiring diagram, schematic, or manual that is not in your knowledge base, you MUST: 1. Use the googleSearch tool to find it. 2. Provide a direct link to the PDF or image source. 3. Describe the key wire colors or pinouts found if possible. 4. Do NOT say 'I cannot provide a diagram' without searching first. DIAGNOSTIC PROTOCOL: 1. Safety First. 2. Hardware Identification. 3. Logical Isolation. 4. Actionable Steps. Tone: Direct, technical, and 'no-nonsense'.";

    try {
        const history = messages.slice(0, -1).map(m => ({
            role: m.role,
            content: m.text || ''
        }));

        const currentMessage = messages[messages.length - 1];
        let userText = currentMessage.text || '';

        if (messages.length === 1) {
            userText = "Context: " + (context.type === 'specific' ? context.modelName : context.voltage) + "\n\nIssue: " + userText;
        }

        // Requirement 6: Prepend the system prompt to the user's message as per previous working patterns
        const finalUserText = `${SYSTEM_PROMPT}\n\n${userText}`;
        
        const content = [{ type: 'text', text: finalUserText }];

        if (image) {
            content.push({
                type: 'image_url',
                image_url: { url: image }
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    ...history,
                    { role: 'user', content }
                ],
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        res.status(200).json({ text: data.choices[0].message.content });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
