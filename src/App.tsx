import { useState, useEffect } from 'react';
import './App.css';
import ContextSetup from './components/ContextSetup';
import DiagnosticChat from './components/DiagnosticChat';
import PartsDatabase from './components/PartsDatabase';

type DiagnosticContext = 
  | { type: 'specific'; modelName: string; specs?: { voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string } }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

const DEFAULT_KEY = 'AIzaSyB8PezH64SHSPZXlM9-d-ghxjqcPmgCks8';

function App() {
  const [context, setContext] = useState<DiagnosticContext | null>(null);
  const [isPartsOpen, setIsPartsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('GEMINI_API_KEY') || DEFAULT_KEY;
  });
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
  }, [apiKey]);

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-flex">
          <div>
            <h1>Ebike King NJ</h1>
            <span className="subtitle">Master Tech Diagnostic Portal v2.1</span>
            <div className="key-status" onClick={() => setShowKeyInput(!showKeyInput)}>
              <span className="status-dot"></span> Direct Access Mode
            </div>
          </div>
          <button className="parts-toggle-btn" onClick={() => setIsPartsOpen(true)}>
            📦 Parts DB
          </button>
        </div>
        {showKeyInput && (
          <div className="key-config">
            <label>Master API Key:</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Paste AIza... key"
            />
            <button onClick={() => setShowKeyInput(false)}>Save</button>
          </div>
        )}
      </header>
      
      <main className="main-content">
        {!context ? (
          <ContextSetup onComplete={setContext} />
        ) : (
          <DiagnosticChat context={context} apiKey={apiKey} />
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
