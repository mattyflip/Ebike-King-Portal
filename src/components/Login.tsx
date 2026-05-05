import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container" style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2 style={{ textAlign: "center", color: "var(--neon-cyan)" }}>
        {isRegistering ? "Mechanic Registration" : "Mechanic Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="mechanic@ebikeking.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p style={{ color: "var(--neon-red)", fontSize: "0.8rem" }}>{error}</p>}
        <button type="submit" className="start-btn" disabled={loading}>
          {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-dim)",
          cursor: "pointer",
          width: "100%",
          marginTop: "1rem",
          textDecoration: "underline",
        }}
      >
        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
      </button>
    </div>
  );
};

export default Login;

