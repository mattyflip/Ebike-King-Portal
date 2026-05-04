import React, { useState } from 'react';
import { PARTS_DATABASE } from '../parts';

interface PartsDatabaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const PartsDatabase: React.FC<PartsDatabaseProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParts = PARTS_DATABASE.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="parts-drawer-overlay" onClick={onClose}>
      <div className="parts-drawer" onClick={e => e.stopPropagation()}>
        <div className="parts-header">
          <h3>Component Reference</h3>
          <button onClick={onClose} className="close-drawer">×</button>
        </div>
        
        <div className="parts-search">
          <input 
            type="text" 
            placeholder="Search pinouts (e.g. Hall, BMS)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="parts-list">
          {filteredParts.map(part => (
            <div key={part.id} className="part-card">
              <div className="part-badge">{part.category}</div>
              <h4>{part.name}</h4>
              <p>{part.description}</p>
              <div className="wiring-grid">
                {Object.entries(part.wiring).map(([key, value]) => (
                  <div key={key} className="wiring-row">
                    <span className="wire-key">{key}:</span>
                    <span className="wire-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartsDatabase;
