import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "../lib/api";

const VERTICALS = [
  { id: "salon", label: "Beauty Salon & Spa", desc: "Haircuts, facials, bridal packages, treatments" },
  { id: "clinic", label: "Skin, Dental & Wellness Clinic", desc: "Consultations, treatments, patient follow-ups" },
  { id: "gym", label: "Gym & Fitness Studio", desc: "Calisthenics, personal training, memberships" },
  { id: "restaurant", label: "Restaurant & Cafe", desc: "Dining reservations, catering, specials" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [vertical, setVertical] = useState("salon");
  const [phone, setPhone] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) return;
    setLoading(true);

    try {
      await api("/api/onboarding", {
        method: "POST",
        body: JSON.stringify({
          business_name: businessName,
          vertical,
          phone: phone || undefined,
          google_place_id: placeId || undefined,
          plan: "ai_team",
        }),
      });
      navigate("/app");
    } catch (err) {
      alert("Error completing onboarding: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          ASSISTED SETUP · 3 MINUTES
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: "12px 0 6px" }}>Welcome to Golden Reindeer</h1>
        <p style={{ margin: 0, color: "#5C4A3A", fontSize: "16px" }}>
          Connect your business profile and let your 4 AI marketing agents get to work.
        </p>
      </div>

      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "24px", padding: "36px", boxShadow: "0 12px 32px rgba(42,26,14,0.06)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#2A1A0E", marginBottom: "8px" }}>
              Business Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Radiance Salon & Clinic"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #EFE4D4", fontSize: "15px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#2A1A0E", marginBottom: "8px" }}>
              Industry Vertical (Configures AI Agent tone & rebooking timers)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {VERTICALS.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setVertical(v.id)}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: vertical === v.id ? "2px solid #B4590B" : "1px solid #EFE4D4",
                    background: vertical === v.id ? "#FBF3E6" : "#FFFBF5",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#2A1A0E" }}>{v.label}</div>
                  <div style={{ fontSize: "12px", color: "#6B5A4A", marginTop: "4px" }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#2A1A0E", marginBottom: "8px" }}>
                WhatsApp Contact Phone
              </label>
              <input
                type="text"
                placeholder="+91 98111 22233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#2A1A0E", marginBottom: "8px" }}>
                Google Place ID (Optional)
              </label>
              <input
                type="text"
                placeholder="ChIJ... (or leave blank for demo)"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ background: "#FBF3E6", border: "1px solid #EFE4D4", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#5C4A3A", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Sparkles size={20} color="#B4590B" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>What happens next:</strong> We will automatically seed your knowledge base with {vertical} price and service presets, enable the 6 flywheel automation switches, and configure your WhatsApp Chat and Google AI Agents.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px",
              background: "#B4590B",
              color: "#FFF",
              border: "none",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 8px 24px rgba(180,89,11,0.25)",
            }}
          >
            {loading ? "Configuring AI Suite..." : "Complete Setup & Launch Dashboard"} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
