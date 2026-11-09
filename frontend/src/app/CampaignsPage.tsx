import React, { useState, useEffect } from "react";
import { Send, Sparkles, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { api } from "../lib/api";

interface Campaign {
  id: string;
  name: string;
  goal: string;
  message_template: string;
  status: string;
  created_at: string;
}

interface RebookingItem {
  contact_id: string;
  name: string;
  phone: string;
  days_since_visit: number;
  recommended_action: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [opportunities, setOpportunities] = useState<RebookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("festive_offer");
  const [customOffer, setCustomOffer] = useState("");
  const [drafting, setDrafting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api<Campaign[]>("/api/campaigns").catch(() => []),
      api<RebookingItem[]>("/api/campaigns/rebooking-opportunities").catch(() => []),
    ]).then(([cList, oppList]) => {
      setCampaigns(cList || []);
      setOpportunities(oppList || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setDrafting(true);
    try {
      await api("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          name,
          goal,
          custom_offer: customOffer || undefined,
        }),
      });
      setName("");
      setCustomOffer("");
      loadData();
    } catch (err) {
      alert("Error drafting campaign: " + err);
    } finally {
      setDrafting(false);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      const res = await api<{ sent_count: number }>(`/api/campaigns/${campaignId}/send`, {
        method: "POST",
      });
      alert(`Campaign dispatched successfully to ${res.sent_count} opted-in customers!`);
      loadData();
    } catch (err) {
      alert("Failed to send campaign: " + err);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          WHATSAPP MARKETING AGENT
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Promotional Campaigns & Re-Marketing</h1>
        <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
          The AI figures out which customers are due for a repeat visit and drafts tailored promotions without blast spamming.
        </p>
      </div>

      {/* Repeat Purchase Opportunities */}
      {opportunities.length > 0 && (
        <div style={{ background: "#FBF3E6", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Sparkles size={18} color="#B4590B" />
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#2A1A0E" }}>
              Repeat-Purchase Revisit Radar ({opportunities.length} Customers Due)
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {opportunities.map((opp) => (
              <div key={opp.contact_id} style={{ background: "#FFF", padding: "16px", borderRadius: "12px", border: "1px solid #EFE4D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "#2A1A0E" }}>{opp.name}</div>
                  <div style={{ fontSize: "12px", color: "#6B5A4A" }}>{opp.phone} · Last visit {opp.days_since_visit} days ago</div>
                  <div style={{ fontSize: "11px", color: "#B4590B", fontWeight: 700, marginTop: "4px" }}>{opp.recommended_action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft New AI Campaign */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "28px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 800 }}>Draft New AI WhatsApp Campaign</h3>
        <form onSubmit={handleCreateCampaign} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: "12px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>Campaign Name</label>
            <input
              type="text"
              placeholder="e.g. Diwali Glamour Offer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>Campaign Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px" }}>
              <option value="festive_offer">Festive / Seasonal Offer</option>
              <option value="winback">Win-Back Dormant Clients</option>
              <option value="refill_reminder">Routine Care Rebooking</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>Offer Details</label>
            <input
              type="text"
              placeholder="e.g. 25% Off Hydra-Facial"
              value={customOffer}
              onChange={(e) => setCustomOffer(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            disabled={drafting}
            style={{ padding: "11px 20px", background: "#B4590B", color: "#FFF", border: "none", borderRadius: "999px", fontWeight: 800, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Sparkles size={16} /> {drafting ? "Drafting..." : "Generate AI Copy"}
          </button>
        </form>
      </div>

      {/* Campaigns List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Campaign History</h3>
        {campaigns.length === 0 ? (
          <div style={{ background: "#FFF", padding: "32px", borderRadius: "20px", border: "1px solid #EFE4D4", textAlign: "center", color: "#8A7A6A" }}>
            No campaigns drafted yet. Create your first campaign above!
          </div>
        ) : (
          campaigns.map((c) => (
            <div key={c.id} style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1, paddingRight: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>{c.name}</h4>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", background: c.status === "done" ? "#E8F5E9" : "#FFF3E0", color: c.status === "done" ? "#1F6B45" : "#B4590B" }}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "10px", padding: "14px", whiteSpace: "pre-line", fontSize: "13px", color: "#2A1A0E", lineHeight: 1.5 }}>
                  {c.message_template}
                </div>
              </div>
              <div>
                {c.status !== "done" && (
                  <button
                    onClick={() => handleSendCampaign(c.id)}
                    style={{ background: "#1F6B45", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "999px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <Send size={14} /> Send to Opted-in Audience
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
