import React from "react";
import logoImg from "../assets/logo.svg";

const Logo: React.FC<{ height?: number }> = ({ height = 40 }) => {
  return (
    <div className="diagos-logo-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img 
        src={logoImg} 
        alt="DiagOS Logo" 
        style={{ 
          height: `${height}px`, 
          width: 'auto',
          display: 'block'
        }} 
      />
    </div>
  );
};

export default Logo;
