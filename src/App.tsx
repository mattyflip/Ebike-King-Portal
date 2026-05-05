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
      <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--border-industrial)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button
          onClick={() => setIsCodesOpen(true)}
          style={{ flex: 1, padding: '10px', background: 'var(--neon-red)', color: '#000', border: 'none', borderRadius: 'var(--radius-pill)', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          ERROR CODES
        </button>
        <button
          onClick={() => setIsPartsOpen(true)}
          style={{ flex: 1, padding: '10px', background: 'var(--neon-cyan)', color: '#000', border: 'none', borderRadius: 'var(--radius-pill)', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          PARTS DB
        </button>
      </div>

      <header className="main-header" style={{ marginTop: '1rem' }}>
        <div className="header-flex">
          <div>
            <h1>Ebike King NJ</h1>
            <span className="subtitle">Master Tech Diagnostic Portal v2.4</span>
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
        <button className="reset-btn" onClick={() => setContext(null)} style={{ margin: '2rem auto', display: 'block' }}>
          New Diagnostic Session
        </button>
      )}
    </div>
  );
}

export default App;
