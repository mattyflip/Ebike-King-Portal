import React from "react";
import Logo from "./Logo";

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="landing-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
        <Logo scale={1.2} />
        <button className="start-btn" onClick={onLogin} style={{ padding: "0.5rem 1.5rem" }}>
          Login
        </button>
      </nav>

      <section className="hero" style={{ textAlign: "center", padding: "6rem 0" }}>
        <h1 style={{ fontSize: "4.5rem", color: "var(--neon-cyan)", marginBottom: "1rem", lineHeight: 1 }}>
          DIAG<span style={{ color: "var(--text-primary)" }}>OS</span>
        </h1>
        <h2 style={{ fontSize: "1.5rem", color: "var(--neon-green)", marginBottom: "2rem" }}>
          The Intelligent Backbone for E-Bike Shops
        </h2>
        <p style={{ fontSize: "1.2rem", color: "var(--text-dim)", maxWidth: "700px", margin: "0 auto 3rem" }}>
          A high-performance diagnostic ecosystem for Sur-Ron, Talaria, Onyx, and beyond. 
          Powered by specialized AI trained on thousands of hours of master-tech repair data.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="start-btn" onClick={onLogin} style={{ padding: "1.2rem 2.5rem", fontSize: "1.1rem" }}>
            Get Started
          </button>
          <button style={{ 
            padding: "1.2rem 2.5rem", 
            fontSize: "1.1rem", 
            background: "transparent", 
            border: "1px solid var(--border-industrial)", 
            color: "var(--text-primary)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontWeight: "bold"
          }}>
            Explore Docs
          </button>
        </div>
      </section>

      <section className="features" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", padding: "4rem 0" }}>
        <div className="feature-card" style={{ padding: "2rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-industrial)", borderRadius: "var(--radius-lg)" }}>
          <h3 style={{ color: "var(--neon-green)" }}>⚡ Real-Time Diagnostics</h3>
          <p>Instant troubleshooting for Bafang, Bosch, and custom controller error codes.</p>
        </div>
        <div className="feature-card" style={{ padding: "2rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-industrial)", borderRadius: "var(--radius-lg)" }}>
          <h3 style={{ color: "var(--neon-cyan)" }}>📸 Vision Analysis</h3>
          <p>Upload photos of wiring or burnt components for AI-powered failure identification.</p>
        </div>
        <div className="feature-card" style={{ padding: "2rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-industrial)", borderRadius: "var(--radius-lg)" }}>
          <h3 style={{ color: "var(--neon-red)" }}>🛠️ Performance Recipes</h3>
          <p>Step-by-step guides for 72V conversions, controller swaps, and BMS bypassing.</p>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-dim)", borderTop: "1px solid var(--border-industrial)" }}>
        <p>© 2026 Ebike King NJ. Built for Mechanics, by Mechanics.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
