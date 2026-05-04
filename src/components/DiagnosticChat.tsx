import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

type DiagnosticContext = 
  | { type: 'specific'; modelName: string }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

interface DiagnosticChatProps {
  context: DiagnosticContext;
}

const DiagnosticChat: React.FC<DiagnosticChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const backendUrl = '/api/diagnose';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: context,
          history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
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
            Describe the failure to begin.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
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
        {loading && <div className="message model loading">Analyzing electrical data...</div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Throttle is dead, getting hall error..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
};

export default DiagnosticChat;
