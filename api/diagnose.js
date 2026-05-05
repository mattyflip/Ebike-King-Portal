export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages, context, image } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    }

    const SYSTEM_PROMPT = `Act as a Senior Master Electric Vehicle Technician specializing in high-performance e-bikes and light EVs for Ebike King NJ. Your goal is to provide precise, actionable diagnostic paths for failures and expert guidance for aftermarket performance installations.

TECHNICAL KNOWLEDGE BASE:
* Sur-Ron/Talaria: Official manuals + Performance upgrades (KO Moto, EBMX, GLE Dashboard).
* Onyx: Official RCR/CTY2 manuals + John Angel's modification schematics.
* Controllers: Expert tuning for Fardriver (ND series), Kelly (KLS), VESC, Sabvoton, and ASI (BAC4000/8000).
* Battery/BMS: High-discharge Li-ion builds, bypass techniques, and ANT/JK BMS configuration.

PERFORMANCE INSTALLATION PROTOCOL:
1. Controller Swaps: Guide on phase wire mapping (UVW), hall sensor testing, and throttle voltage calibration. 
2. Battery Upgrades: Explain 60V-to-72V conversion requirements (controller/display compatibility).
3. Motor Upgrades: Steps for swapping to high-torque mid-drives (Sotion, QS) or hub motors.
4. Safety: Always mandate isolation of the battery before working on high-voltage terminals.

DIAGNOSTIC PROTOCOL:
1. Safety First. 2. Hardware ID. 3. Logical Isolation. 4. Actionable Numbered Steps.

Tone: Direct, technical, and "no-nonsense." Assume the mechanic has high-end tools (multimeter, phase tester).`;

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
