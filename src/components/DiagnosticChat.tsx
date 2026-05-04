import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64
}

type DiagnosticContext = 
  | { type: 'specific'; modelName: string; specs?: { voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string } }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

interface DiagnosticChatProps {
  context: DiagnosticContext;
  apiKey: string;
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

const DiagnosticChat: React.FC<DiagnosticChatProps> = ({ context, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize AI locally
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    systemInstruction: SYSTEM_PROMPT
  });

  const getHeader = () => {
    if (context.type === 'specific') return context.modelName;
    return `${context.voltage} | ${context.controller || 'Generic Controller'} | ${context.motorType || 'Generic Motor'}`;
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !image) || loading) return;

    const userMessage: Message = { role: 'user', text: input, image: image || undefined };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const chat = model.startChat({
        history: messages.map(m => ({ 
          role: m.role === 'user' ? 'user' : 'model', 
          parts: [{ text: m.text }] 
        }))
      });

      const parts: any[] = [];
      
      // Prepend context for the first message
      let textContent = input;
      if (messages.length === 0) {
        if (context.type === 'specific') {
          const specs = context.specs ? 
            ` (Specs: ${context.specs.voltage}, Controller: ${context.specs.controller}, Motor: ${context.specs.motorType}, Display: ${context.specs.displayModel})` : 
            '';
          textContent = `The mechanic is working on a specific model: ${context.modelName}${specs}. 
          1. Please provide the key mechanical and electrical specifications for this bike (or confirm the provided ones).
          2. Then, address the following issue: ${input || 'Check the attached image for details.'}`;
        } else {
          textContent = `Context: Generic Build. Voltage: ${context.voltage}, Controller: ${context.controller || 'Unknown'}, Motor: ${context.motorType || 'Unknown'}, Display: ${context.displayModel || 'None'}. 
          Issue: ${input || 'Check the attached image for details.'}`;
        }
      }
      
      parts.push({ text: textContent });

      if (userMessage.image) {
        const [header, data] = userMessage.image.split(',');
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
      const modelMessage: Message = { role: 'model', text: response.text() };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error: any) {
      console.error('AI Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'model', 
        text: `**DIAGNOSTIC FAILURE:** ${error.message || 'The AI encountered a critical error. Check your API key and network connection.'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{getHeader()}</h3>
        <span className="direct-badge">Direct Access Active</span>
      </div>
      <div className="messages-list">
        {messages.length === 0 && (
          <div className="empty-state">
            Describe the failure or upload a photo of the component to begin.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.image && (
                <img src={msg.image} alt="Diagnostic attachment" className="chat-image" />
              )}
              {msg.role === 'model' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))
              )}
            </div>
          </div>
        ))}
        {loading && <div className="message model loading">Analyzing electrical data & visual inputs...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="input-preview">
        {image && (
          <div className="image-preview-container">
            <img src={image} alt="Preview" />
            <button onClick={() => setImage(null)} className="remove-img">×</button>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="input-area">
        <input 
          type="file" 
          accept="image/*" 
          hidden 
          ref={fileInputRef} 
          onChange={handleImageChange}
        />
        <button 
          type="button" 
          className="attach-btn" 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          📷
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={image ? "Describe the photo..." : "e.g. Throttle is dead..."}
          disabled={loading}
        />
        <button type="submit" disabled={loading || (!input.trim() && !image)}>Send</button>
      </form>
    </div>
  );
};

export default DiagnosticChat;
