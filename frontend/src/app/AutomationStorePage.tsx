import React, { useState } from "react";
import { Zap, Check, AlertCircle } from "lucide-react";

interface AutomationItem {
  key: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

export default function AutomationStorePage() {
  const [automations, setAutomations] = useState<AutomationItem[]>([
    {
      key: "missed_call_textback",
      title: "Missed-Call Text-Back",
      description: "When a potential client calls and you can't pick up, immediately text back via WhatsApp with booking options.",
      trigger: "Inbound call missed / unanswered",
      action: "Send automated WhatsApp message within 5 seconds",
      enabled: true,
    },
    {
      key: "no_show_reminders",
      title: "No-Show Reminders",
      description: "Cut salon/clinic no-shows by 70% with automated reminder messages 24h and 2h prior to booked appointment.",
      trigger: "Appointment scheduled in next 24h / 2h",
      action: "Send appointment confirmation with reschedule link",
      enabled: true,
    },
    {
      key: "rebooking_timer",
      title: "Rebooking Timer",
      description: "Detects service cycles (e.g. hair trim 4-6 weeks) and prompts the customer to rebook automatically.",
      trigger: "Last purchase was X weeks ago",
      action: "Personalized WhatsApp rebooking invite",
      enabled: false,
    },
    {
      key: "review_requests",
      title: "Review Requests Flywheel",
      description: "Compliantly solicit 5-star Google reviews from every visiting customer 24 hours after their appointment.",
      trigger: "Purchase or appointment completed + 24 hours",
      action: "Send 1-click Google Review direct link via WhatsApp",
      enabled: true,
    },
    {
      key: "winback_offers",
      title: "Win-Back Offers",
      description: "Re-engage dormant customers who haven't visited in 60+ days with custom offers tailored to their purchase history.",
      trigger: "Customer inactive > 60 days with lifetime value > ₹1,000",
      action: "WhatsApp promotion with time-limited discount",
      enabled: false,
    },
    {
      key: "hot_lead_alerts",
      title: "Hot-Lead Alerts",
      description: "Detect buying intent in WhatsApp chats and instantly notify the business owner or manager to close the sale.",
      trigger: "Customer asks about pricing or expresses high booking intent",
      action: "Push alert & SMS to business owner mobile",
      enabled: true,
    },
  ]);

  const toggleSwitch = (key: string) => {
    setAutomations((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          THE 6 MODULAR SWITCHES
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Automation Store</h1>
        <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
          Turn features on and off with one click. Each automation listens to events in the shared brain.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "20px" }}>
        {automations.map((item) => (
          <div
            key={item.key}
            style={{
              background: "#FFF",
              border: item.enabled ? "1.5px solid #E3C79C" : "1px solid #EFE4D4",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "18px",
              boxShadow: item.enabled ? "0 4px 16px rgba(180, 89, 11, 0.06)" : "none",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#2A1A0E" }}>{item.title}</h3>
                {/* Switch toggle UI */}
                <button
                  type="button"
                  onClick={() => toggleSwitch(item.key)}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: item.enabled ? "#1F6B45" : "#D9BE93",
                    border: "none",
                    position: "relative",
                    cursor: "pointer",
                    padding: "2px",
                    transition: "background 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "#FFF",
                      transform: item.enabled ? "translateX(22px)" : "translateX(0px)",
                      transition: "transform 0.2s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#5C4A3A", lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "12px", padding: "12px 14px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div><strong style={{ color: "#8A4408" }}>Trigger:</strong> {item.trigger}</div>
              <div><strong style={{ color: "#1F6B45" }}>Action:</strong> {item.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
