import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, CheckCircle, Clock } from "lucide-react";

export default function InboxPage() {
  const [conversations] = useState([
    {
      id: "1",
      contactName: "Rahul Verma",
      phone: "+91 98223 45678",
      status: "bot",
      lastMsg: "Can you confirm the price for bridal package?",
      time: "10m ago",
      hot: true,
    },
    {
      id: "2",
      contactName: "Sneha Patel",
      phone: "+91 98334 56789",
      status: "bot",
      lastMsg: "Yes, tomorrow 3:00 PM works for me!",
      time: "45m ago",
      hot: false,
    },
    {
      id: "3",
      contactName: "Vikram Malhotra",
      phone: "+91 98445 11223",
      status: "human",
      lastMsg: "Thank you for the quick assistance.",
      time: "2h ago",
      hot: false,
    },
  ]);

  const [activeChat, setActiveChat] = useState("1");
  const [replyText, setReplyText] = useState("");

  const messages = [
    { sender: "customer", text: "Hi, I saw your Google listing. Do you do bridal makeups?", time: "10:14 AM" },
    { sender: "bot", text: "Hello Rahul! Yes, we have specialized Bridal and Pre-Bridal packages starting at ₹8,500. All our artists use premium international products. Would you like to view our package brochure or schedule a free consultation?", time: "10:14 AM" },
    { sender: "customer", text: "Can you confirm the price for bridal package?", time: "10:16 AM" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          WHATSAPP LEAD CONVERSION AGENT
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Conversations & Human Takeover</h1>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "340px 1fr", background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", overflow: "hidden" }}>
        {/* Chat List */}
        <div style={{ borderRight: "1px solid #EFE4D4", overflowY: "auto", background: "#FFFBF5" }}>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveChat(c.id)}
              style={{
                padding: "16px",
                borderBottom: "1px solid #EFE4D4",
                cursor: "pointer",
                background: activeChat === c.id ? "#FBF3E6" : "transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "15px", color: "#2A1A0E" }}>{c.contactName}</strong>
                <span style={{ fontSize: "11px", color: "#8A4408" }}>{c.time}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#5C4A3A", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.lastMsg}
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "8px", alignItems: "center" }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: c.status === "bot" ? "#E8F5E9" : "#FFF3E0",
                  color: c.status === "bot" ? "#1F6B45" : "#B4590B",
                }}>
                  {c.status === "bot" ? "AI Bot Active" : "Human Takeover"}
                </span>
                {c.hot && (
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#FFEBEE", color: "#C62828" }}>
                    🔥 Hot Lead
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Thread */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EFE4D4", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFF" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "16px" }}>Rahul Verma (+91 98223 45678)</div>
              <div style={{ fontSize: "12px", color: "#1F6B45", fontWeight: 600 }}>Bot answering from knowledge docs</div>
            </div>
            <button style={{ background: "#FFFBF5", border: "1.5px solid #E3C79C", padding: "8px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, color: "#8A4408", cursor: "pointer" }}>
              Take Over Conversation
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#FBF3E6" }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === "customer" ? "flex-start" : "flex-end",
                  maxWidth: "70%",
                  background: m.sender === "customer" ? "#FFF" : "#F6E7CF",
                  border: "1px solid #EFE4D4",
                  borderRadius: "16px",
                  padding: "12px 16px",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: m.sender === "customer" ? "#5C4A3A" : "#8A4408", marginBottom: "4px" }}>
                  {m.sender === "customer" ? "Customer" : "AI Marketing Agent"}
                </div>
                <div style={{ fontSize: "14px", color: "#2A1A0E", lineHeight: 1.5 }}>{m.text}</div>
                <div style={{ fontSize: "10px", color: "#8A4408", textAlign: "right", marginTop: "4px" }}>{m.time}</div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #EFE4D4", background: "#FFF", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Type message to take over or reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ flex: 1, padding: "12px 16px", borderRadius: "999px", border: "1px solid #D9BE93", fontSize: "14px", outline: "none" }}
            />
            <button style={{ background: "#B4590B", color: "#FFF", border: "none", width: "42px", height: "42px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
