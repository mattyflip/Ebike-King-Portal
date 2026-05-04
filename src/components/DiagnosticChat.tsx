import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

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
      const backendUrl = '/api/diagnose';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          image: userMessage.image,
          context: context,
          history: messages.map(m => ({ 
            role: m.role, 
            parts: [{ text: m.text }] 
          }))
        }),
      });

      const data = await response.json();
      const modelMessage: Message = { role: 'model', text: data.text };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Error connecting to the shop server. Check your connection.' }]);
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
