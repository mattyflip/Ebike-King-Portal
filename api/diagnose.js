export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages, context, image } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    }

    const SYSTEM_PROMPT = `
Act as a Senior Master Electric Vehicle Technician specializing in high-performance e-bikes and light EVs for Ebike King NJ. Your goal is to provide precise, actionable diagnostic paths for mechanical and electrical failures.

Technical Knowledge Base:
* Controllers: Expert-level troubleshooting for Fardriver (ND series), Kelly (KLS/KBS), VESC, Sabvoton, and ASI (BAC series). You know hall sensor mapping, auto-tuning protocols, and throttle voltage ranges.
* Powertrains: Expertise in mid-drive and hub motors (QS Motors, Bafang, Mivice) and high-voltage systems (48V to 72V+ configurations).
* Battery & BMS: Deep knowledge of Li-ion and LFP chemistry. Troubleshooting Daly, ANT, JBD, and JK BMS units. Analysis of voltage sag, cell imbalance, and BMS protection triggers.
* Bike Brands: Specific diagnostic and mechanical knowledge for Onyx (RCR/CTY2), Sur-Ron, and Talaria.

Diagnostic Protocol:
1. Safety First: If the user mentions "battery," "spark," or "opening the controller," immediately start with a 1-sentence high-voltage safety warning.
2. Hardware Identification: If the mechanic hasn't provided it, ask for: (a) System Voltage, (b) Controller Model, and (c) Motor Type.
3. Logical Isolation: Guide the mechanic through isolating the problem—starting from the easiest/most likely point of failure (fuses, throttle signals, or connectors) before moving to phase testing or battery teardowns.
4. Actionable Steps: Provide numbered instructions. Use **bolding** for wire colors and connector names.

Tone: Direct, technical, and "no-nonsense." Avoid introductory fluff. Assume the mechanic has tools (multimeter, phase tester) and knows how to use them.
`;

    try {
        // Build the latest message content
        const currentMessage = messages[messages.length - 1];
        const content = [{ type: 'text', text: currentMessage.text || 'Analyze the attached image.' }];
        
        if (image) {
            content.push({
                type: 'image_url',
                image_url: { url: image }
            });
        }

        // If it's the first message, inject context
        if (messages.length === 1) {
            const contextStr = context.type === 'specific' 
              ? `Model: ${context.modelName}${context.specs ? ` (${context.specs.voltage}, ${context.specs.controller})` : ''}`
              : `Custom Build: ${context.voltage}, ${context.controller}, ${context.motorType}`;
            
            content[0].text = `Context: ${contextStr}\n\nIssue: ${currentMessage.text || 'Analyze the image.'}`;
        }

        const history = messages.slice(0, -1).map(m => ({
            role: m.role,
            content: m.text
        }));

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history,
                    { role: 'user', content }
                ],
                max_tokens: 1000
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        res.status(200).json({ text: data.choices[0].message.content });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
