import { useState, useEffect } from 'react';
import './App.css';
import ContextSetup from './components/ContextSetup';
import DiagnosticChat from './components/DiagnosticChat';
import PartsDatabase from './components/PartsDatabase';

type DiagnosticContext = 
  | { type: 'specific'; modelName: string; specs?: { voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string } }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

function App() {
  const [context, setContext] = useState<DiagnosticContext | null>(null);
  const [isPartsOpen, setIsPartsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('OPENAI_API_KEY') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('OPENAI_API_KEY', apiKey);
  }, [apiKey]);

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-flex">
          <div>
            <h1>Ebike King NJ</h1>
            <span className="subtitle">Master Tech Diagnostic Portal v2.2</span>
            <div className="key-status" onClick={() => setShowKeyInput(!showKeyInput)}>
              <span className={`status-dot ${apiKey ? 'active' : ''}`}></span> {apiKey ? 'OpenAI Engine Active' : 'Waiting for API Key...'}
            </div>
          </div>
          <button className="parts-toggle-btn" onClick={() => setIsPartsOpen(true)}>
            📦 Parts DB
          </button>
        </div>
        {(showKeyInput || !apiKey) && (
          <div className="key-config">
            <label>OpenAI API Key (sk-...):</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Paste sk-..."
            />
            <button onClick={() => setShowKeyInput(false)}>Save</button>
          </div>
        )}
      </header>
      
      <main className="main-content">
        {!context ? (
          <ContextSetup onComplete={setContext} />
        ) : (
          apiKey ? (
            <DiagnosticChat context={context} apiKey={apiKey} />
          ) : (
            <div className="setup-container">
              <h3>🔑 API Key Required</h3>
              <p>Please enter an OpenAI API key in the header to start diagnostics.</p>
              <button className="start-btn" onClick={() => setShowKeyInput(true)}>Enter Key</button>
            </div>
          )
        )}
      </main>

      <PartsDatabase isOpen={isPartsOpen} onClose={() => setIsPartsOpen(false)} />

      {context && (
        <button className="reset-btn" onClick={() => setContext(null)}>
          New Diagnostic Session
        </button>
      )}
    </div>
  );
}

export default App;
