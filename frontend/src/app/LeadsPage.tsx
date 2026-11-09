import React, { useState, useEffect } from "react";
import { Users, Plus, Phone, Calendar, ArrowUpRight, DollarSign, X } from "lucide-react";
import { api } from "../lib/api";

interface Contact {
  id: string;
  name: string | null;
  phone: string;
  stage: string;
  source: string | null;
  lifetime_value: number;
  tags: string[];
  created_at?: string;
}

export default function LeadsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("lead");
  const [source, setSource] = useState("whatsapp");

  const loadContacts = () => {
    setLoading(true);
    api<Contact[]>("/api/contacts")
      .then((data) => {
        setContacts(data || []);
      })
      .catch((err) => {
        console.error("Failed to load contacts:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    try {
      await api("/api/contacts", {
        method: "POST",
        body: JSON.stringify({
          name: name || undefined,
          phone,
          stage,
          source,
          opted_in: true,
          tags: ["manual_entry"],
        }),
      });
      setShowModal(false);
      setName("");
      setPhone("");
      loadContacts();
    } catch (err) {
      alert("Error adding contact: " + err);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
            THE SHARED BRAIN · AI CRM
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Contacts & Customer Intelligence</h1>
          <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
            One unified customer record shared across Google, WhatsApp, and Marketing agents.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: "#B4590B", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "999px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {/* Table view */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#FBF3E6", borderBottom: "1px solid #EFE4D4", color: "#8A4408", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <th style={{ padding: "16px 20px" }}>Contact</th>
              <th style={{ padding: "16px 20px" }}>Source</th>
              <th style={{ padding: "16px 20px" }}>Stage</th>
              <th style={{ padding: "16px 20px" }}>Tags</th>
              <th style={{ padding: "16px 20px" }}>Lifetime Value</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#8A7A6A" }}>
                  Loading shared brain contacts...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#8A7A6A" }}>
                  No contacts recorded yet. Add your first contact or test an inbound WhatsApp message!
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #EFE4D4" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 700, color: "#2A1A0E" }}>{c.name || "Customer"}</div>
                    <div style={{ fontSize: "12px", color: "#6B5A4A" }}>{c.phone}</div>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#5C4A3A" }}>{c.source || "direct"}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: c.stage === "customer" ? "#E8F5E9" : "#FFF3E0",
                      color: c.stage === "customer" ? "#1F6B45" : "#B4590B",
                    }}>
                      {c.stage}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {(c.tags || []).map((t, idx) => (
                        <span key={idx} style={{ background: "#F5EFE6", color: "#5C4A3A", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontWeight: 800, color: "#2A1A0E" }}>
                    ₹{Number(c.lifetime_value || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(42,26,14,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#FFF", borderRadius: "20px", padding: "32px", width: "420px", maxWidth: "90%", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Add New Lead / Customer</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateContact} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>WhatsApp / Phone (E.164)</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98111 22233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>Stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px" }}>
                    <option value="lead">Lead</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>Source</label>
                  <select value={source} onChange={(e) => setSource(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px" }}>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="google">Google Search</option>
                    <option value="missed_call">Missed Call</option>
                    <option value="manual">Manual Import</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ marginTop: "12px", padding: "12px", background: "#B4590B", color: "#FFF", border: "none", borderRadius: "999px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}>
                Save to Shared Brain
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
