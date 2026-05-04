import { GoogleGenerativeAI } from '@google/generative-ai';

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, image, context, history } = req.body;

    try {
        const chat = model.startChat({
            history: history || [],
        });

        // Prepare message parts
        const parts = [];
        
        // Handle context for the first message
        let textContent = message;
        if (context && (!history || history.length === 0)) {
            if (context.type === 'specific') {
                const specs = context.specs ? 
                    ` (Specs: ${context.specs.voltage}, Controller: ${context.specs.controller}, Motor: ${context.specs.motorType}, Display: ${context.specs.displayModel})` : 
                    '';
                textContent = `The mechanic is working on a specific model: ${context.modelName}${specs}. 
                1. Please provide the key mechanical and electrical specifications for this bike (or confirm the provided ones).
                2. Then, address the following issue: ${message || 'Check the attached image for details.'}`;
            } else {
                textContent = `Context: Generic Build. Voltage: ${context.voltage}, Controller: ${context.controller || 'Unknown'}, Motor: ${context.motorType || 'Unknown'}, Display: ${context.displayModel || 'None'}. 
                Issue: ${message || 'Check the attached image for details.'}`;
            }
        }
        
        parts.push({ text: textContent });

        // Add image part if provided
        if (image) {
            const [header, data] = image.split(',');
            const mimeType = header.split(':')[1].split(';')[0];
            parts.push({
                inlineData: {
                    data: data,
                    mimeType: mimeType
                }
            });
        }

        const result = await chat.sendMessage(parts);
        const response = await result.response;
        res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(200).json({ text: "DIAGNOSTIC ENGINE ERROR: " + (error.message || "Unknown error. Check API key and model availability.") });
    }
}
