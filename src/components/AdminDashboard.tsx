import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const AdminDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming you have a 'users' collection in Firestore
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customerData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customerData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="setup-container" style={{ maxWidth: "1000px", margin: "2rem auto", padding: "2rem" }}>
      <h2 style={{ color: "var(--neon-cyan)", marginBottom: "2rem" }}>Admin Control Center</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-industrial)", borderRadius: "var(--radius-md)" }}>
          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Active Subscribers</span>
          <div style={{ fontSize: "2rem", color: "var(--neon-green)", fontWeight: "bold" }}>{customers.length}</div>
        </div>
        <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-industrial)", borderRadius: "var(--radius-md)" }}>
          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Monthly Revenue</span>
          <div style={{ fontSize: "2rem", color: "var(--neon-cyan)", fontWeight: "bold" }}>${customers.length * 49}</div>
        </div>
        <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-industrial)", borderRadius: "var(--radius-md)" }}>
          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>System Health</span>
          <div style={{ fontSize: "2rem", color: "var(--neon-green)", fontWeight: "bold" }}>100%</div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-main)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-industrial)", color: "var(--text-dim)" }}>
              <th style={{ textAlign: "left", padding: "1rem" }}>Customer Email</th>
              <th style={{ textAlign: "left", padding: "1rem" }}>Status</th>
              <th style={{ textAlign: "left", padding: "1rem" }}>Joined</th>
              <th style={{ textAlign: "left", padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>Loading customer data...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>No customers found.</td></tr>
            ) : (
              customers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem" }}>{customer.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "2px 8px", 
                      borderRadius: "10px", 
                      fontSize: "0.7rem", 
                      background: "rgba(0,255,0,0.1)", 
                      color: "var(--neon-green)" 
                    }}>Active</span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    {customer.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button style={{ background: "transparent", border: "1px solid var(--neon-red)", color: "var(--neon-red)", padding: "4px 8px", fontSize: "0.7rem", borderRadius: "4px" }}>Manage</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
