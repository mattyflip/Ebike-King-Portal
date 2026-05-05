import React, { useState, useEffect } from 'react';
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
  const [savedBikes, setSavedBikes] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Custom build states
  const [voltage, setVoltage] = useState('48V');
  const [controller, setController] = useState('');
  const [motorType, setMotorType] = useState('');
  const [motorWattage, setMotorWattage] = useState('');
  const [displayModel, setDisplayModel] = useState('');

  useEffect(() => {
    fetch('/api/bikes')
      .then(res => res.json())
      .then(data => setSavedBikes(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching bikes:', err));
  }, []);

  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = [...EBIKE_MODELS, ...savedBikes].find(m => (m.id === e.target.value || m.name === e.target.value));
    if (model) {
      setSelectedLibraryModel(model);
      setModelName(model.name);
    } else {
      setSelectedLibraryModel(null);
      setModelName('');
    }
  };

  const handleSaveBike = async () => {
    if (!modelName) return alert('Please enter a model name first.');
    setIsSaving(true);
    try {
      const bikeData = {
        name: modelName,
        specs: { voltage, controller, motorType, motorWattage, displayModel }
      };
      const res = await fetch('/api/bikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bikeData)
      });
      const saved = await res.json();
      setSavedBikes([...savedBikes, saved]);
      alert('Bike specifications saved successfully!');
    } catch (err) {
      alert('Failed to save bike.');
    } finally {
      setIsSaving(false);
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
              <option value="">-- Choose a standard or saved model --</option>
              <optgroup label="Shop Models">
                {EBIKE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              {savedBikes.length > 0 && (
                <optgroup label="Mechanic Saved Library">
                  {savedBikes.map(m => (
                    <option key={m.id || m.name} value={m.name}>{m.name}</option>
                  ))}
                </optgroup>
              )}
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
                Tech Specs Loaded: {selectedLibraryModel.specs.voltage} | {selectedLibraryModel.specs.controller}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Model / Brand Name</label>
              <input
                type="text"
                placeholder="e.g. CUSTOM BUILD #1"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
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
            <button
              type="button"
              className="parts-toggle-btn"
              style={{ width: '100%', marginBottom: '1rem', borderColor: 'var(--neon-amber)', color: 'var(--neon-amber)', borderRadius: 'var(--radius-pill)' }}
              onClick={handleSaveBike}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save to Mechanic Library'}
            </button>
          </>
        )}
        <button type="submit" className="start-btn">Initialize Diagnostic Path</button>
      </form>
    </div>
  );
};

export default ContextSetup;
