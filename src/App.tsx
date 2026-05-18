import { useState, useEffect } from "react";
import "./App.css";
import ContextSetup from "./components/ContextSetup";
import DiagnosticChat from "./components/DiagnosticChat";
import PartsDatabase from "./components/PartsDatabase";
import ErrorCodeDatabase from "./components/ErrorCodeDatabase";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";

const ADMIN_EMAIL = "MattyFlipTV@gmail.com";

type DiagnosticContext =
  | {
      type: "specific";
      modelName: string;
      specs?: {
        voltage: string;
        controller: string;
        motorType: string;
        motorWattage: string;
        displayModel: string;
      };
    }
  | {
      type: "custom";
      voltage: string;
      controller: string;
      motorType: string;
      motorWattage: string;
      displayModel: string;
    };

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<DiagnosticContext | null>(null);
  const [isPartsOpen, setIsPartsOpen] = useState(false);
  const [isCodesOpen, setIsCodesOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Register/Update user in Firestore for admin tracking
        try {
          await setDoc(doc(db, "users", currentUser.uid), {
            email: currentUser.email,
            lastLogin: serverTimestamp(),
            role: currentUser.email === ADMIN_EMAIL ? "admin" : "mechanic"
          }, { merge: true });
        } catch (err) {
          console.error("Error updating user record:", err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, "system", "status"),
        () => setDbConnected(true),
        (err) => {
          console.error("Firestore connection error:", err);
          setDbConnected(false);
        }
      );
      return () => unsubscribe();
    } else {
      setDbConnected(null);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setContext(null);
      setIsAdminView(false);
      setShowLogin(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--neon-cyan)",
        }}
      >
        Initializing Secure Connection...
      </div>
    );
  }

  // View 1: Landing Page (Public)
  if (!user && !showLogin) {
    return <LandingPage onLogin={() => setShowLogin(true)} />;
  }

  // View 2: Login Page (Public/Auth)
  if (!user && showLogin) {
    return (
      <div style={{ position: "relative" }}>
        <button 
          onClick={() => setShowLogin(false)}
          style={{ position: "absolute", top: "20px", left: "20px", background: "none", border: "1px solid var(--text-dim)", color: "var(--text-dim)", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
        >
          ← Back to Site
        </button>
        <Login />
      </div>
    );
  }

  // View 3: App (Authenticated)
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div className="app-wrapper">
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px",
          background: "rgba(0,0,0,0.5)",
          borderBottom: "1px solid var(--border-industrial)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '10px', paddingLeft: '8px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: dbConnected === true ? 'var(--neon-green)' : dbConnected === false ? 'var(--neon-red)' : 'var(--neon-amber)',
            boxShadow: dbConnected === true ? '0 0 5px var(--neon-green)' : 'none'
          }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
            {dbConnected === true ? "Cloud Live" : dbConnected === false ? "Cloud Error" : "Connecting..."}
          </span>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            style={{
              flex: 1,
              padding: "10px",
              background: isAdminView ? "var(--neon-cyan)" : "var(--neon-amber)",
              color: "#000",
              border: "none",
              borderRadius: "var(--radius-pill)",
              fontWeight: "900",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            {isAdminView ? "DIAGNOSTIC PORTAL" : "ADMIN DASHBOARD"}
          </button>
        )}

        {!isAdminView && (
          <>
            <button
              onClick={() => setIsCodesOpen(true)}
              style={{
                flex: 1,
                padding: "10px",
                background: "var(--neon-red)",
                color: "#000",
                border: "none",
                borderRadius: "var(--radius-pill)",
                fontWeight: "900",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              ERROR CODES
            </button>
            <button
              onClick={() => setIsPartsOpen(true)}
              style={{
                flex: 1,
                padding: "10px",
                background: "var(--neon-cyan)",
                color: "#000",
                border: "none",
                borderRadius: "var(--radius-pill)",
                fontWeight: "900",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              PARTS DB
            </button>
          </>
        )}
        
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "transparent",
            color: "var(--neon-red)",
            border: "1px solid var(--neon-red)",
            borderRadius: "var(--radius-pill)",
            fontWeight: "900",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          LOGOUT
        </button>
      </div>

      <header className="main-header" style={{ marginTop: "1rem" }}>
        <div className="header-flex">
          <div>
            <h1>Ebike King NJ</h1>
            <span className="subtitle">
              {isAdminView ? "Admin Operations Control" : "Master Tech Diagnostic Portal v2.6"}
            </span>
          </div>
          <div style={{ textAlign: "right", color: "var(--text-dim)", fontSize: "0.8rem" }}>
            {isAdmin ? "ADMIN" : "MECHANIC"}: {user?.email}
          </div>
        </div>
      </header>

      <main className="main-content">
        {isAdminView ? (
          <AdminDashboard />
        ) : !context ? (
          <ContextSetup onComplete={setContext} />
        ) : (
          <DiagnosticChat context={context} />
        )}
      </main>

      <PartsDatabase isOpen={isPartsOpen} onClose={() => setIsPartsOpen(false)} />
      <ErrorCodeDatabase isOpen={isCodesOpen} onClose={() => setIsCodesOpen(false)} />

      {!isAdminView && context && (
        <button
          className="reset-btn"
          onClick={() => setContext(null)}
          style={{ margin: "2rem auto", display: "block" }}
        >
          New Diagnostic Session
        </button>
      )}
    </div>
  );
}

export default App;


