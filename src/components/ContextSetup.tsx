import React, { useState } from 'react';

type DiagnosticContext = 
  | { type: 'specific'; modelName: string }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

interface ContextSetupProps {
  onComplete: (context: DiagnosticContext) => void;
}

const ContextSetup: React.FC<ContextSetupProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'specific' | 'custom'>('specific');
  const [modelName, setModelName] = useState('');
  
  // Custom build states
  const [voltage, setVoltage] = useState('48V');
  const [controller, setController] = useState('');
  const [motorType, setMotorType] = useState('');
  const [motorWattage, setMotorWattage] = useState('');
  const [displayModel, setDisplayModel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'specific') {
      onComplete({ type: 'specific', modelName });
    } else {
      onComplete({ 
        type: 'custom', 
        voltage, 
        controller, 
        motorType, 
        motorWattage, 
        displayModel 
      });
    }
  };

  return (
    <div className="setup-container">
      <div className="mode-toggle">
        <button 
          className={mode === 'specific' ? 'active' : ''} 
          onClick={() => setMode('specific')}
        >
          Specific Model
        </button>
        <button 
          className={mode === 'custom' ? 'active' : ''} 
          onClick={() => setMode('custom')}
        >
          Custom/Generic Build
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'specific' ? (
          <div className="form-group">
            <label>Bike Model Name</label>
            <input 
              type="text" 
              placeholder="e.g. Onyx RCR, Sur-Ron X, Talaria Sting" 
              value={modelName} 
              onChange={(e) => setModelName(e.target.value)}
              required
            />
            <p className="hint">Master Tech will provide mechanical specs for known models.</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>System Voltage</label>
              <select value={voltage} onChange={(e) => setVoltage(e.target.value)}>
                <option value="36V">36V</option>
                <option value="48V">48V</option>
                <option value="52V">52V</option>
                <option value="60V">60V</option>
                <option value="72V">72V</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="form-group">
              <label>Controller Type</label>
              <input 
                type="text" 
                placeholder="e.g. KT, Lishui, Fardriver" 
                value={controller} 
                onChange={(e) => setController(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Motor Wattage & Type</label>
              <input 
                type="text" 
                placeholder="e.g. 750W Bafang Hub, 3000W QS Mid" 
                value={motorWattage} 
                onChange={(e) => {
                  setMotorWattage(e.target.value);
                  setMotorType(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Display Model (if any)</label>
              <input 
                type="text" 
                placeholder="e.g. SW900, Eggrider, S2" 
                value={displayModel} 
                onChange={(e) => setDisplayModel(e.target.value)}
              />
            </div>
          </>
        )}
        <button type="submit" className="start-btn">Start Diagnostics</button>
      </form>
    </div>
  );
};

export default ContextSetup;
