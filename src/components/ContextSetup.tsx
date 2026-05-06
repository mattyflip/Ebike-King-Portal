import React, { useState, useEffect } from "react";
import { EBIKE_MODELS } from "../models";
import type { EbikeModel } from "../models";
import { db, storage } from "../firebase";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type DiagnosticContext =
  | { type: "specific"; modelName: string; specs?: EbikeModel["specs"]; imageUrl?: string }
  | {
      type: "custom";
      voltage: string;
      controller: string;
      motorType: string;
      motorWattage: string;
      displayModel: string;
      imageUrl?: string;
    }
  | { type: "general" };

interface ContextSetupProps {
  onComplete: (context: DiagnosticContext) => void;
}

const ContextSetup: React.FC<ContextSetupProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<"specific" | "custom" | "general">("specific");
  const [modelName, setModelName] = useState("");
  const [selectedLibraryModel, setSelectedLibraryModel] = useState<any>(null);
  const [savedBikes, setSavedBikes] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);

  // Custom build states
  const [voltage, setVoltage] = useState("48V");
  const [controller, setController] = useState("");
  const [motorType, setMotorType] = useState("");
  const [motorWattage, setMotorWattage] = useState("");
  const [displayModel, setDisplayModel] = useState("");

  useEffect(() => {
    // Real-time listener for Firestore "bikes" collection
    const q = query(collection(db, "bikes"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const bikes: any[] = [];
        querySnapshot.forEach((doc) => {
          bikes.push({ id: doc.id, ...doc.data() });
        });
        setSavedBikes(bikes);
      },
      (error) => {
        console.error("Error listening to bikes collection:", error);
        alert("Real-time sync error: " + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = [...EBIKE_MODELS, ...savedBikes].find(
      (m) => m.id === e.target.value || m.name === e.target.value
    );
    if (model) {
      setSelectedLibraryModel(model);
      setModelName(model.name);
    } else {
      setSelectedLibraryModel(null);
      setModelName("");
    }
  };

  const handleSaveBike = async () => {
    if (!modelName) return alert("Please enter a model name first.");
    setIsSaving(true);
    try {
      let imageUrl = "";
      if (photo) {
        const storageRef = ref(storage, "bikes/" + Date.now() + "_" + photo.name);
        const snapshot = await uploadBytes(storageRef, photo);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const bikeData = {
        name: modelName,
        specs: { voltage, controller, motorType, motorWattage, displayModel },
        imageUrl,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "bikes"), bikeData);

      alert("Bike specifications saved successfully to cloud library!");
      setPhoto(null);
    } catch (err: any) {
      console.error("Failed to save bike:", err);
      alert("Failed to save bike: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "specific") {
      onComplete({
        type: "specific",
        modelName: modelName,
        specs: selectedLibraryModel?.specs,
        imageUrl: selectedLibraryModel?.imageUrl,
      });
    } else if (mode === "custom") {
      onComplete({
        type: "custom",
        voltage,
        controller,
        motorType,
        motorWattage,
        displayModel,
        imageUrl: "", // Custom unsaved builds don"t have imageUrl passed yet unless saved    
      });
    } else {
      onComplete({ type: "general" });
    }
  };

  return (
    <div className="setup-container">
      <div className="mode-toggle">
        <button className={mode === "specific" ? "active" : ""} onClick={() => setMode("specific")}>
          Model Library
        </button>
        <button className={mode === "custom" ? "active" : ""} onClick={() => setMode("custom")}>
          Custom Build
        </button>
        <button className={mode === "general" ? "active" : ""} onClick={() => setMode("general")}>
          General Question
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "specific" ? (
          <div className="form-group">
            <label>Select Shop Model</label>
            <select onChange={handleLibrarySelect} style={{ marginBottom: "1rem" }}>
              <option value="">-- Choose a standard or saved model --</option>
              
              <optgroup label="Popular Commuter & Everyday">
                {EBIKE_MODELS.filter(m => m.category === 'commuter').map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              
              <optgroup label="Delivery Models">
                {EBIKE_MODELS.filter(m => m.category === 'delivery').map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              
              <optgroup label="High-Performance">
                {EBIKE_MODELS.filter(m => m.category === 'performance').map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
              
              {/* Fallback for uncategorized models if any */}
              {EBIKE_MODELS.some(m => !m.category) && (
                <optgroup label="Other Standard Models">
                  {EBIKE_MODELS.filter(m => !m.category).map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </optgroup>
              )}

              {savedBikes.length > 0 && (
                <optgroup label="Mechanic Saved Library">
                  {savedBikes.map((m) => (
                    <option key={m.id || m.name} value={m.name}>
                      {m.imageUrl ? "📷 " : ""}
                      {m.name}
                    </option>
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
              <div style={{ marginTop: "10px" }}>
                <div className="hint" style={{ color: "var(--neon-green)" }}>
                  Tech Specs Loaded: {selectedLibraryModel.specs.voltage} |{" "}
                  {selectedLibraryModel.specs.controller}
                </div>
                {selectedLibraryModel.imageUrl && (
                  <img
                    src={selectedLibraryModel.imageUrl}
                    alt="Bike Thumbnail"
                    style={{
                      marginTop: "10px",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--neon-cyan)",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : mode === "custom" ? (
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
                  setMotorType(e.target.value);
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
            <div className="form-group">
              <label>Bike Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "8px",
                  borderRadius: "4px",
                  color: "var(--text-dim)",
                }}
              />
            </div>
            <button
              type="button"
              className="parts-toggle-btn"
              style={{
                width: "100%",
                marginBottom: "1rem",
                borderColor: "var(--neon-amber)",
                color: "var(--neon-amber)",
                borderRadius: "var(--radius-pill)",
              }}
              onClick={handleSaveBike}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save to Mechanic Library"}
            </button>
          </>
        ) : (
          <div className="form-group">
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Skip bike selection to ask general questions about electrical systems, components, or diagnostic procedures.
            </p>
          </div>
        )}
        <button type="submit" className="start-btn">
          {mode === "general" ? "Start General Session" : "Initialize Diagnostic Path"}
        </button>
      </form>
    </div>
  );
};

export default ContextSetup;