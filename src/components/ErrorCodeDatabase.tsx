import React, { useState } from 'react';
import { COMMON_ERROR_CODES } from '../errorCodes';

interface ErrorCodeDatabaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErrorCodeDatabase: React.FC<ErrorCodeDatabaseProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCodes = COMMON_ERROR_CODES.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.meaning.toLowerCase().includes(search.toLowerCase()) ||
    c.brands.some(b => b.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="parts-drawer-overlay" onClick={onClose}>
      <div className="parts-drawer" onClick={e => e.stopPropagation()}>
        <div className="parts-header">
          <h2>Error Code Database</h2>
          <button className="close-drawer" onClick={onClose}>×</button>
        </div>

        <div className="parts-search">
          <input 
            type="text" 
            placeholder="Search code (e.g. E007) or brand (e.g. Macfox)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="parts-list">
          {filteredCodes.length === 0 && <div className="empty-state">No matching error codes found.</div>}
          {filteredCodes.map((c, idx) => (
            <div key={idx} className="part-card">
              <div className="part-badge" style={{ background: 'var(--neon-red)', color: 'white' }}>
                CODE: {c.code}
              </div>
              <h4>{c.meaning}</h4>
              <p><strong>Solution:</strong> {c.solution}</p>
              <div className="wiring-grid">
                <div className="wiring-row">
                  <span className="wire-key">Common Brands:</span>
                  <span className="wire-val">{c.brands.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorCodeDatabase;
