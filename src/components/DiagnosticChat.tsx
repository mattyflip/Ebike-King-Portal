import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
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
      // Build OpenAI-style content
      const content: any[] = [{ type: 'text', text: input || 'Please analyze the attached image.' }];
      
      if (image) {
        content.push({
          type: 'image_url',
          image_url: { url: image }
        });
      }

      // First message context
      const historyMessages = messages.map(m => ({
        role: m.role,
        content: m.text
      }));

      if (messages.length === 0) {
        const contextStr = context.type === 'specific' 
          ? `Model: ${context.modelName}${context.specs ? ` (${context.specs.voltage}, ${context.specs.controller})` : ''}`
          : `Custom Build: ${context.voltage}, ${context.controller}, ${context.motorType}`;
        
        content[0].text = `Context: ${contextStr}\n\nIssue: ${input || 'Analyze the image.'}`;
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
            { role: 'system', content: SYSTEM_PROMPT },
            ...historyMessages,
            { role: 'user', content }
          ],
          max_tokens: 1000
        })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const modelText = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'assistant', text: modelText }]);
    } catch (error: any) {
      console.error('OpenAI Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        text: `**DIAGNOSTIC FAILURE:** ${error.message || 'Check your OpenAI API key and balance.'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{getHeader()}</h3>
        <span className="direct-badge">GPT-4o Active</span>
      </div>
      <div className="messages-list">
        {messages.length === 0 && (
          <div className="empty-state">
            Describe the failure or upload a photo of the component to begin.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'model'}`}>
            <div className="message-content">
              {msg.image && (
                <img src={msg.image} alt="Diagnostic attachment" className="chat-image" />
              )}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
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
