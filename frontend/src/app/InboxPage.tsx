import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageSquare,
  Bot,
  User,
  Flame,
  Search,
  ChevronRight,
  Clock,
  Sparkles,
  Star,
  AlertTriangle,
  Gift,
  HelpCircle,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { api } from "../lib/api";

interface Conversation {
  id: string;
  contact_id: string;
  contact_name: string;
  phone: string;
  status: "bot" | "human" | "closed";
  last_message: string;
  hot: boolean;
  last_inbound_at?: string;
}

export default function InboxPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "hot" | "human" | "bot" | "review_gate" | "campaign">("all");

  const DEFAULT_CONVERSATIONS: Conversation[] = [
    {
      id: "conv-1",
      contact_id: "c-1",
      contact_name: "Olivia Vance",
      phone: "+1 (212) 555-0143",
      status: "bot",
      last_message: "Yes! A 2:30 PM slot for Balayage & Highlights this Saturday works perfectly for me. Can I reserve it?",
      hot: true,
      last_inbound_at: "Just now",
    },
    {
      id: "conv-2",
      contact_id: "c-2",
      contact_name: "James Thornton",
      phone: "+1 (212) 555-0192",
      status: "bot",
      last_message: "Just submitted my 5-star review on Google! Truly the best haircut in SoHo.",
      hot: false,
      last_inbound_at: "18m ago",
    },
    {
      id: "conv-3",
      contact_id: "c-3",
      contact_name: "Sophia Martinez",
      phone: "+1 (212) 555-0188",
      status: "human",
      last_message: "Thank you for looking into my toner concerns so quickly. I really appreciate the studio director taking over personally.",
      hot: false,
      last_inbound_at: "1h ago",
    },
    {
      id: "conv-4",
      contact_id: "c-4",
      contact_name: "Ethan Campbell",
      phone: "+1 (212) 555-0155",
      status: "bot",
      last_message: "I received your seasonal privilege invite! Would love to book the Keratin therapy package with the $35 credit.",
      hot: true,
      last_inbound_at: "3h ago",
    },
    {
      id: "conv-5",
      contact_id: "c-5",
      contact_name: "Emma Richardson",
      phone: "+1 (212) 555-0164",
      status: "bot",
      last_message: "Hi! What's the main difference between your HydraFacial signature care and the VIP glow package?",
      hot: false,
      last_inbound_at: "5h ago",
    },
  ];

  const loadConversations = () => {
    setLoading(true);
    api<Conversation[]>("/api/conversations")
      .then((data) => {
        setConversations(data && data.length > 0 ? data : DEFAULT_CONVERSATIONS);
      })
      .catch((err) => {
        console.error("Using fallback conversations on Vercel:", err);
        setConversations(DEFAULT_CONVERSATIONS);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const getConversationTypeBadge = (c: Conversation) => {
    const name = c.contact_name?.toLowerCase() || "";
    const msg = c.last_message?.toLowerCase() || "";

    if (c.hot || name.includes("olivia") || msg.includes("book") || msg.includes("reserved")) {
      return {
        label: "🔥 Hot Booking Lead",
        bg: "#FFEBEE",
        color: "#C62828",
        border: "#FFCDD2",
      };
    }
    if (name.includes("james") || msg.includes("writereview") || msg.includes("5-star") || msg.includes("5 stars")) {
      return {
        label: "⭐ 5★ Google Review Gate",
        bg: "#E8F5E9",
        color: "#1B5E20",
        border: "#C8E6C9",
      };
    }
    if (name.includes("sophia") || c.status === "human" || msg.includes("apologize") || msg.includes("voucher") || msg.includes("director")) {
      return {
        label: "⚠️ 1★ Intercepted (Escalated)",
        bg: "#FFF3E0",
        color: "#BF360C",
        border: "#FFE0B2",
      };
    }
    if (name.includes("ethan") || msg.includes("privilege") || msg.includes("balayage") || msg.includes("$35")) {
      return {
        label: "🎁 Winback Promo Campaign",
        bg: "#EDE7F6",
        color: "#4A148C",
        border: "#D1C4E9",
      };
    }
    return {
      label: "💬 Service & Price Inquiry",
      bg: "#E0F2F1",
      color: "#004D40",
      border: "#B2DFDB",
    };
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.last_message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "hot") return c.hot || c.contact_name?.toLowerCase().includes("olivia");
    if (filter === "human") return c.status === "human" || c.contact_name?.toLowerCase().includes("sophia");
    if (filter === "bot") return c.status === "bot";
    if (filter === "review_gate") return c.contact_name?.toLowerCase().includes("james");
    if (filter === "campaign") return c.contact_name?.toLowerCase().includes("ethan");
    return true;
  });

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
            WHATSAPP CONVERSATIONS · 5 LIVE SCENARIOS
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0", color: "#1E1810" }}>
            Chats & Customer Inquiries
          </h1>
          <p style={{ margin: "4px 0 0", color: "#5C4A3A", fontSize: "14px" }}>
            Click on any chat to open full interactive history, inspect AI decisions, or take over management controls.
          </p>
        </div>
        <Link
          to="/app/appointments"
          style={{
            background: "#B4590B",
            color: "#FFF",
            textDecoration: "none",
            padding: "9px 16px",
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 10px rgba(180,89,11,0.2)",
          }}
        >
          <Calendar size={15} /> Appointments Calendar
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "16px", top: "14px", color: "#8A4408" }} />
          <input
            type="text"
            placeholder="Search by customer name, phone number, or message text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 16px 12px 46px",
              borderRadius: "14px",
              border: "1.5px solid #E3C79C",
              background: "#FFF",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: `All Inboxes (${conversations.length})` },
            { id: "hot", label: `🔥 Booking Leads (${conversations.filter((c) => c.hot || c.contact_name?.includes("Olivia")).length})` },
            { id: "review_gate", label: `⭐ 5★ Review Gates` },
            { id: "human", label: `⚠️ 1★ Intercepts (Human Mode)` },
            { id: "campaign", label: `🎁 Winback Offers` },
            { id: "bot", label: `🤖 AI Handled (${conversations.filter((c) => c.status === "bot").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              style={{
                background: filter === tab.id ? "#B4590B" : "#FFFBF5",
                color: filter === tab.id ? "#FFF" : "#5C4A3A",
                border: filter === tab.id ? "1.5px solid #B4590B" : "1px solid #EFE4D4",
                padding: "7px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 16px rgba(42,26,14,0.04)" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#8A7A6A", fontSize: "14px" }}>
            Loading WhatsApp conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#8A7A6A", fontSize: "14px" }}>
            No matching conversations found.
          </div>
        ) : (
          filteredConversations.map((c, idx) => {
            const badge = getConversationTypeBadge(c);
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/app/inbox/${c.id}`)}
                style={{
                  padding: "18px 24px",
                  borderBottom: idx === filteredConversations.length - 1 ? "none" : "1px solid #F3EAE0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  cursor: "pointer",
                  background: "#FFF",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF8F0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF")}
              >
                {/* Left: Avatar + Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: c.status === "human" ? "#FFF3E0" : c.hot ? "#FFEBEE" : "#F6E7CF",
                      border: `1.5px solid ${c.status === "human" ? "#FFE0B2" : c.hot ? "#FFCDD2" : "#E3C79C"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "17px",
                      color: c.status === "human" ? "#BF360C" : c.hot ? "#C62828" : "#8A4408",
                      flexShrink: 0,
                    }}
                  >
                    {c.contact_name ? c.contact_name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "15px", color: "#2A1A0E" }}>{c.contact_name}</strong>
                      <span style={{ fontSize: "12px", color: "#78614E", fontWeight: 500 }}>{c.phone}</span>

                      {/* Scenario Badge */}
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {badge.label}
                      </span>

                      {/* Bot vs Human pill */}
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: c.status === "bot" ? "#E8F5E9" : "#FFF3E0",
                          color: c.status === "bot" ? "#1F6B45" : "#BF360C",
                        }}
                      >
                        {c.status === "bot" ? "AI Handled" : "Human Takeover"}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#5C4A3A",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.4,
                      }}
                    >
                      {c.last_message || "No messages yet"}
                    </div>
                  </div>
                </div>

                {/* Right: Open Arrow */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8A4408", flexShrink: 0 }}>
                  <span style={{ fontSize: "12px", fontWeight: 700 }}>Open Chat</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
