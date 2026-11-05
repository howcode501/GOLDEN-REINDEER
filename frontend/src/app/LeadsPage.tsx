import React, { useState } from "react";
import { Users, Filter, Plus, Phone, Calendar, ArrowUpRight, DollarSign } from "lucide-react";

export default function LeadsPage() {
  const [contacts, setContacts] = useState([
    { id: "1", name: "Pooja Sharma", phone: "+91 98112 34567", stage: "customer", source: "google", ltv: "₹4,800", lastPurchase: "2 days ago", tags: ["vip", "bridal"] },
    { id: "2", name: "Rahul Verma", phone: "+91 98223 45678", stage: "lead", source: "whatsapp", ltv: "₹0", lastPurchase: "-", tags: ["hot_lead", "price_query"] },
    { id: "3", name: "Sneha Patel", phone: "+91 98334 56789", stage: "customer", source: "missed_call", ltv: "₹1,850", lastPurchase: "3 weeks ago", tags: ["hair_spa"] },
    { id: "4", name: "Amit Joshi", phone: "+91 98445 67890", stage: "lead", source: "google", ltv: "₹0", lastPurchase: "-", tags: ["weekend_inquiry"] },
    { id: "5", name: "Kiran Rao", phone: "+91 98556 78901", stage: "customer", source: "whatsapp", ltv: "₹6,200", lastPurchase: "1 month ago", tags: ["loyal", "due_rebooking"] },
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
            THE SHARED BRAIN · AI CRM
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Contacts & Customer Intelligence</h1>
        </div>
        <button style={{ background: "#B4590B", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "999px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
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
              <th style={{ padding: "16px 20px" }}>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #EFE4D4" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#2A1A0E" }}>{c.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B5A4A" }}>{c.phone}</div>
                </td>
                <td style={{ padding: "16px 20px", color: "#5C4A3A" }}>{c.source}</td>
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
                    {c.tags.map((t) => (
                      <span key={t} style={{ background: "#F6E7CF", color: "#8A4408", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "16px 20px", fontWeight: 700, color: "#2A1A0E" }}>{c.ltv}</td>
                <td style={{ padding: "16px 20px", color: "#5C4A3A" }}>{c.lastPurchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
