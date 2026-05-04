import { useState } from 'react';
import './App.css';
import ContextSetup from './components/ContextSetup';
import DiagnosticChat from './components/DiagnosticChat';

type DiagnosticContext = 
  | { type: 'specific'; modelName: string }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

function App() {
  const [context, setContext] = useState<DiagnosticContext | null>(null);

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <h1>Ebike King NJ</h1>
        <span className="subtitle">Master Tech Diagnostic Portal</span>
      </header>
      
      <main className="main-content">
        {!context ? (
          <ContextSetup onComplete={setContext} />
        ) : (
          <DiagnosticChat context={context} />
        )}
      </main>

      {context && (
        <button className="reset-btn" onClick={() => setContext(null)}>
          New Diagnostic Session
        </button>
      )}
    </div>
  );
}

export default App;
