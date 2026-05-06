import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  image?: string; // Base64
}

type DiagnosticContext = 
  | { type: 'specific'; modelName: string; specs?: { voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string; batteryCapacity?: string } }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string; batteryCapacity?: string }
  | { type: 'general' };

interface DiagnosticChatProps {
  context: DiagnosticContext;
}

const DiagnosticChat: React.FC<DiagnosticChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getHeader = () => {
    if (context.type === 'specific') return context.modelName;
    if (context.type === 'custom') return `${context.voltage} | ${context.controller || 'Generic Controller'} | ${context.motorType || 'Generic Motor'}`;
    return "General Tech Support";
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
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: context,
          image: userMessage.image
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error: any) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        text: `**DIAGNOSTIC FAILURE:** ${error.message || 'The shop server encountered an error.'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{getHeader()}</h3>
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
