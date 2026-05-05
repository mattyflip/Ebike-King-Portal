import { useState } from 'react';
import './App.css';
import ContextSetup from './components/ContextSetup';
import DiagnosticChat from './components/DiagnosticChat';
import PartsDatabase from './components/PartsDatabase';
import ErrorCodeDatabase from './components/ErrorCodeDatabase';

type DiagnosticContext = 
  | { type: 'specific'; modelName: string; specs?: { voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string } }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

function App() {
  const [context, setContext] = useState<DiagnosticContext | null>(null);
  const [isPartsOpen, setIsPartsOpen] = useState(false);
  const [isCodesOpen, setIsCodesOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-flex" style={{ flexDirection: 'column', gap: '15px' }}>
          <div>
            <h1>Ebike King NJ</h1>
            <span className="subtitle">Master Tech Diagnostic Portal v2.3</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button 
              className="parts-toggle-btn" 
              onClick={() => setIsCodesOpen(true)} 
              style={{ flex: 1, borderColor: 'var(--neon-red)', color: 'var(--neon-red)', fontSize: '0.7rem' }}
            >
              ERR CODES
            </button>
            <button 
              className="parts-toggle-btn" 
              onClick={() => setIsPartsOpen(true)}
              style={{ flex: 1, fontSize: '0.7rem' }}
            >
              PARTS DB
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {!context ? (
          <ContextSetup onComplete={setContext} />
        ) : (
          <DiagnosticChat context={context} />
        )}
      </main>

      <PartsDatabase isOpen={isPartsOpen} onClose={() => setIsPartsOpen(false)} />
      <ErrorCodeDatabase isOpen={isCodesOpen} onClose={() => setIsCodesOpen(false)} />

      {context && (
        <button className="reset-btn" onClick={() => setContext(null)}>
          New Diagnostic Session
        </button>
      )}
    </div>
  );
}

export default App;
