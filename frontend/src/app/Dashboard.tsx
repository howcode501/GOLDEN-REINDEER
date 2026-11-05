import React, { useState } from "react";
import { 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  Star, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Flame 
} from "lucide-react";

export default function Dashboard() {
  const [stats] = useState({
    newLeads: 142,
    conversionRate: "28.4%",
    hotLeads: 18,
    monthlyRevenue: "₹2,84,500",
    avgRating: 4.8,
    reviewCount: 312,
  });

  const flywheelEvents = [
    { type: "review.received", text: "5★ review received from Neha K. via WhatsApp review link", time: "10 mins ago" },
    { type: "purchase.recorded", text: "Sale recorded: Hair Spa + Treatment (₹2,400) for Ananya S.", time: "45 mins ago" },
    { type: "lead.hot", text: "Hot lead detected: Rahul M. requested pricing for bridal package", time: "1 hr ago" },
    { type: "chat.replied", text: "WhatsApp AI Agent booked slot for Tomorrow 3:00 PM", time: "2 hrs ago" },
    { type: "lead.captured", text: "Lead captured from Google Business Profile call button", time: "3 hrs ago" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
            AUTONOMOUS MARKETING ENGINE
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Marketing Dashboard & Flywheel</h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ background: "#B4590B", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "999px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} /> Run Growth Audit
          </button>
        </div>
      </div>

      {/* Flywheel Banner */}
      <div style={{ background: "#FBF3E6", border: "1.5px solid #E3C79C", borderRadius: "20px", padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={20} color="#B4590B" />
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800 }}>The Autonomous Flywheel Status</h3>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#1F6B45", background: "#E8F5E9", padding: "4px 10px", borderRadius: "999px" }}>
            ● All 4 Agents Synchronized
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", textAlign: "center" }}>
          <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "14px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#8A4408", fontWeight: 700 }}>1. GBP SUITE</div>
            <div style={{ fontSize: "18px", fontWeight: 800, marginTop: "4px" }}>+32% Searches</div>
            <div style={{ fontSize: "11px", color: "#5C4A3A" }}>Weekly posts active</div>
          </div>
          <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "14px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#8A4408", fontWeight: 700 }}>2. CHAT AGENT</div>
            <div style={{ fontSize: "18px", fontWeight: 800, marginTop: "4px" }}>100% 24/7 Replied</div>
            <div style={{ fontSize: "11px", color: "#5C4A3A" }}>Instant response in 3s</div>
          </div>
          <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "14px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#8A4408", fontWeight: 700 }}>3. SHARED BRAIN</div>
            <div style={{ fontSize: "18px", fontWeight: 800, marginTop: "4px" }}>524 Contacts</div>
            <div style={{ fontSize: "11px", color: "#5C4A3A" }}>Purchase history remembered</div>
          </div>
          <div style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "14px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#8A4408", fontWeight: 700 }}>4. REVIEW FLYWHEEL</div>
            <div style={{ fontSize: "18px", fontWeight: 800, marginTop: "4px" }}>+48 Reviews</div>
            <div style={{ fontSize: "11px", color: "#5C4A3A" }}>Compliant post-visit nudges</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#5C4A3A" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Captured Leads (30d)</span>
            <Users size={18} color="#8A4408" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 4px" }}>{stats.newLeads}</div>
          <div style={{ fontSize: "12px", color: "#1F6B45", fontWeight: 600 }}>↑ +18% vs last month</div>
        </div>

        <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#5C4A3A" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Hot Leads (Ready to Book)</span>
            <Flame size={18} color="#B4590B" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 4px", color: "#B4590B" }}>{stats.hotLeads}</div>
          <div style={{ fontSize: "12px", color: "#8A4408", fontWeight: 600 }}>Auto-tagged from chat intent</div>
        </div>

        <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#5C4A3A" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Recorded Revenue</span>
            <ShoppingBag size={18} color="#8A4408" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 4px" }}>{stats.monthlyRevenue}</div>
          <div style={{ fontSize: "12px", color: "#1F6B45", fontWeight: 600 }}>Across 74 verified bookings</div>
        </div>

        <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#5C4A3A" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Google Reputation</span>
            <Star size={18} fill="#F59E0B" color="#F59E0B" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 4px" }}>{stats.avgRating} ★</div>
          <div style={{ fontSize: "12px", color: "#5C4A3A", fontWeight: 600 }}>{stats.reviewCount} total Google reviews</div>
        </div>
      </div>

      {/* Flywheel Real-Time Activity Feed */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "24px 28px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 800 }}>Live Shared Brain Activity Feed</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {flywheelEvents.map((evt, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={16} color="#1F6B45" />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#2A1A0E" }}>{evt.text}</span>
              </div>
              <span style={{ fontSize: "12px", color: "#8A4408", fontWeight: 600 }}>{evt.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
