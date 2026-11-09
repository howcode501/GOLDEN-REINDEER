import React, { useState, useEffect } from "react";
import { Zap, Check, AlertCircle, RefreshCw } from "lucide-react";
import { api } from "../lib/api";

interface AutomationItem {
  key: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

const DEFAULT_DEFINITIONS: Omit<AutomationItem, "enabled">[] = [
  {
    key: "missed_call_textback",
    title: "Missed-Call Text-Back",
    description: "When a potential client calls and you can't pick up, immediately text back via WhatsApp with booking options.",
    trigger: "Inbound call missed / unanswered",
    action: "Send automated WhatsApp message within 5 seconds",
  },
  {
    key: "no_show_reminders",
    title: "No-Show Reminders",
    description: "Cut salon/clinic no-shows by 70% with automated reminder messages 24h and 2h prior to booked appointment.",
    trigger: "Appointment scheduled in next 24h / 2h",
    action: "Send appointment confirmation with reschedule link",
  },
  {
    key: "rebooking_timer",
    title: "Rebooking Timer",
    description: "Detects service cycles (e.g. hair trim 4-6 weeks) and prompts the customer to rebook automatically.",
    trigger: "Last purchase was X weeks ago",
    action: "Personalized WhatsApp rebooking invite",
  },
  {
    key: "review_requests",
    title: "Review Requests Flywheel",
    description: "Compliantly solicit 5-star Google reviews from every visiting customer 24 hours after their appointment.",
    trigger: "Purchase or appointment completed + 24 hours",
    action: "Send 1-click Google Review direct link via WhatsApp",
  },
  {
    key: "winback_offers",
    title: "Win-Back Offers",
    description: "Re-engage dormant customers who haven't visited in 60+ days with custom offers tailored to their purchase history.",
    trigger: "Customer inactive > 60 days with lifetime value > ₹1,000",
    action: "WhatsApp promotion with time-limited discount",
  },
  {
    key: "hot_lead_alerts",
    title: "Hot-Lead Alerts",
    description: "Detect buying intent in WhatsApp chats and instantly notify the business owner or manager to close the sale.",
    trigger: "Customer asks about pricing or expresses high booking intent",
    action: "Push alert & notification to business owner mobile",
  },
];

export default function AutomationStorePage() {
  const [automations, setAutomations] = useState<AutomationItem[]>(() =>
    DEFAULT_DEFINITIONS.map((d) => ({ ...d, enabled: true }))
  );
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    api<Array<{ key: string; enabled: boolean }>>("/api/automations")
      .then((serverItems) => {
        if (serverItems && serverItems.length > 0) {
          const map = new Map(serverItems.map((s) => [s.key, s.enabled]));
          setAutomations((prev) =>
            prev.map((item) => ({
              ...item,
              enabled: map.has(item.key) ? map.get(item.key)! : item.enabled,
            }))
          );
        }
      })
      .catch((err) => console.log("Using initial automation state", err));
  }, []);

  const toggleSwitch = async (key: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    // Optimistic update
    setAutomations((prev) =>
      prev.map((item) => (item.key === key ? { ...item, enabled: nextState } : item))
    );
    setSavingKey(key);

    try {
      await api("/api/automations", {
        method: "PUT",
        body: JSON.stringify({ key, enabled: nextState }),
      });
    } catch (err) {
      console.error("Failed to persist toggle:", err);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          THE 6 MODULAR SWITCHES
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Automation Store</h1>
        <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
          Turn features on or off like light switches. Each automation connects directly to the shared brain and flywheel.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {automations.map((item) => (
          <div
            key={item.key}
            style={{
              background: "#FFF",
              border: item.enabled ? "1px solid #B4590B" : "1px solid #EFE4D4",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: item.enabled ? "0 8px 24px rgba(180,89,11,0.08)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: item.enabled ? "#FBF3E6" : "#F5EFE6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.enabled ? "#B4590B" : "#8A7A6A",
                    }}
                  >
                    <Zap size={20} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>{item.title}</h3>
                </div>

                {/* The Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleSwitch(item.key, item.enabled)}
                  style={{
                    width: "52px",
                    height: "30px",
                    borderRadius: "999px",
                    background: item.enabled ? "#B4590B" : "#D8C7B5",
                    position: "relative",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#FFF",
                      position: "absolute",
                      top: "3px",
                      left: item.enabled ? "25px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    }}
                  >
                    {savingKey === item.key ? (
                      <RefreshCw size={12} color="#B4590B" className="spin" />
                    ) : item.enabled ? (
                      <Check size={14} color="#B4590B" />
                    ) : null}
                  </div>
                </button>
              </div>

              <p style={{ margin: "0 0 16px", color: "#5C4A3A", fontSize: "14px", lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "12px", padding: "12px 14px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#8A4408" }}>Trigger: </span>
                <span style={{ color: "#2A1A0E" }}>{item.trigger}</span>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: "#1F6B45" }}>Action: </span>
                <span style={{ color: "#2A1A0E" }}>{item.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
