import React from "react";

const Logo: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  return (
    <div className="diagos-logo" style={{ transform: `scale(${scale})`, transformOrigin: 'left' }}>
      <div className="logo-icon">
        <div className="logo-mark"></div>
      </div>
      <div className="logo-text">
        DIAG<span className="logo-os">OS</span>
      </div>
    </div>
  );
};

export default Logo;
