import { useState } from 'react';
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

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-flex">
          <div>
            <h1>Ebike King NJ</h1>
            <span className="subtitle">Master Tech Diagnostic Portal v2.0</span>
          </div>
          <button className="parts-toggle-btn" onClick={() => setIsPartsOpen(true)}>
            📦 Parts DB
          </button>
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

      {context && (
        <button className="reset-btn" onClick={() => setContext(null)}>
          New Diagnostic Session
        </button>
      )}
    </div>
  );
}

export default App;
