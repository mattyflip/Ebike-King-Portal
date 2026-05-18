import React from "react";

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="landing-container" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <section className="hero" style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1 style={{ fontSize: "3.5rem", color: "var(--neon-cyan)", marginBottom: "1rem" }}>
          The AI Master Tech for Your Shop
        </h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-dim)", maxWidth: "800px", margin: "0 auto 2rem" }}>
          Stop guessing. Start fixing. The world's most advanced AI diagnostic portal for high-performance 
          E-Bikes, Sur-Rons, Talarias, and Custom Builds.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button className="start-btn" onClick={onLogin} style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
            Launch Portal
          </button>
          <button style={{ 
            padding: "1rem 2rem", 
            fontSize: "1.1rem", 
            background: "transparent", 
            border: "1px solid var(--neon-cyan)", 
            color: "var(--neon-cyan)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer"
          }}>
            View Pricing
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
