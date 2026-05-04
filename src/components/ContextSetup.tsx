import React, { useState } from 'react';
import { EBIKE_MODELS } from '../models';
import type { EbikeModel } from '../models';

type DiagnosticContext = 
  | { type: 'specific'; modelName: string; specs?: EbikeModel['specs'] }
  | { type: 'custom'; voltage: string; controller: string; motorType: string; motorWattage: string; displayModel: string };

interface ContextSetupProps {
  onComplete: (context: DiagnosticContext) => void;
}

const ContextSetup: React.FC<ContextSetupProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'specific' | 'custom'>('specific');
  const [modelName, setModelName] = useState('');
  const [selectedLibraryModel, setSelectedLibraryModel] = useState<EbikeModel | null>(null);
  
  // Custom build states
  const [voltage, setVoltage] = useState('48V');
  const [controller, setController] = useState('');
  const [motorType, setMotorType] = useState('');
  const [motorWattage, setMotorWattage] = useState('');
  const [displayModel, setDisplayModel] = useState('');

  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = EBIKE_MODELS.find(m => m.id === e.target.value);
    if (model) {
      setSelectedLibraryModel(model);
      setModelName(model.name);
    } else {
      setSelectedLibraryModel(null);
      setModelName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'specific') {
      onComplete({ 
        type: 'specific', 
        modelName: modelName,
        specs: selectedLibraryModel?.specs 
      });
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
          Model Library
        </button>
        <button 
          className={mode === 'custom' ? 'active' : ''} 
          onClick={() => setMode('custom')}
        >
          Custom Build
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'specific' ? (
          <div className="form-group">
            <label>Select Shop Model</label>
            <select onChange={handleLibrarySelect} style={{ marginBottom: '1rem' }}>
              <option value="">-- Choose a standard model --</option>
              {EBIKE_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
              <option value="other">Other / Manual Entry</option>
            </select>

            <label>Bike Model Name</label>
            <input 
              type="text" 
              placeholder="e.g. Onyx RCR, Sur-Ron X, Talaria Sting" 
              value={modelName} 
              onChange={(e) => {
                setModelName(e.target.value);
                if (selectedLibraryModel?.name !== e.target.value) setSelectedLibraryModel(null);
              }}
              required
            />
            {selectedLibraryModel && (
              <div className="hint" style={{ color: 'var(--neon-green)', marginTop: '10px' }}>
                ✓ Verified Tech Specs Loaded: {selectedLibraryModel.specs.voltage} | {selectedLibraryModel.specs.controller}
              </div>
            )}
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
        <button type="submit" className="start-btn">Initialize Diagnostic Path</button>
      </form>
    </div>
  );
};

export default ContextSetup;
