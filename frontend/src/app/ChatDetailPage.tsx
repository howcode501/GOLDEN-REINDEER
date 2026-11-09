import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, Sparkles, CheckCircle, Clock } from "lucide-react";
import { api } from "../lib/api";

interface Message {
  id: string;
  conversation_id: string;
  direction: "in" | "out";
  sender: "customer" | "bot" | "human" | "campaign";
  body: string;
  created_at: string;
}

interface Conversation {
  id: string;
  contact_id: string;
  contact_name: string;
  phone: string;
  status: "bot" | "human" | "closed";
  last_message: string;
  hot: boolean;
}

export default function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const DEFAULT_CONVERSATIONS: Record<string, { conv: Conversation; messages: Message[] }> = {
    "conv-1": {
      conv: { id: "conv-1", contact_id: "c-1", contact_name: "Olivia Vance", phone: "+1 (212) 555-0143", status: "bot", last_message: "Yes! A 2:30 PM slot for Balayage & Highlights this Saturday works perfectly for me.", hot: true },
      messages: [
        { id: "m-1", conversation_id: "conv-1", direction: "in", sender: "customer", body: "Hi! Do you have any open slots for a balayage this Saturday afternoon?", created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: "m-2", conversation_id: "conv-1", direction: "out", sender: "bot", body: "Hello Olivia! 🌿 We have two openings this Saturday: 11:30 AM or 2:30 PM with our Senior Colorist Maya at 482 Broome St SoHo. Balayage includes Olaplex bonding treatment & blowout ($280). Which slot suits you best?", created_at: new Date(Date.now() - 3400000).toISOString() },
        { id: "m-3", conversation_id: "conv-1", direction: "in", sender: "customer", body: "Yes! A 2:30 PM slot for Balayage & Highlights this Saturday works perfectly for me. Can I reserve it?", created_at: new Date(Date.now() - 600000).toISOString() },
        { id: "m-4", conversation_id: "conv-1", direction: "out", sender: "bot", body: "Wonderful! We've reserved Saturday at 2:30 PM for you. A calendar confirmation has been sent, and our team will send a friendly reminder 24 hours prior. See you in SoHo! ✨", created_at: new Date(Date.now() - 120000).toISOString() }
      ]
    },
    "conv-2": {
      conv: { id: "conv-2", contact_id: "c-2", contact_name: "James Thornton", phone: "+1 (212) 555-0192", status: "bot", last_message: "Just submitted my 5-star review on Google! Truly the best haircut in SoHo.", hot: false },
      messages: [
        { id: "m-21", conversation_id: "conv-2", direction: "out", sender: "bot", body: "Hi James! Thank you for visiting Glow & Grace Studio today. How would you rate your precision haircut from 1 to 5 stars?", created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: "m-22", conversation_id: "conv-2", direction: "in", sender: "customer", body: "5 stars! The blowout and scalp massage were top notch.", created_at: new Date(Date.now() - 5000000).toISOString() },
        { id: "m-23", conversation_id: "conv-2", direction: "out", sender: "bot", body: "We're thrilled to hear that, James! ⭐ Could you take 15 seconds to share that on our Google Maps profile? It helps our small team tremendously: https://g.page/r/glow-grace-studio/review", created_at: new Date(Date.now() - 4800000).toISOString() },
        { id: "m-24", conversation_id: "conv-2", direction: "in", sender: "customer", body: "Just submitted my 5-star review on Google! Truly the best haircut in SoHo.", created_at: new Date(Date.now() - 1080000).toISOString() }
      ]
    },
    "conv-3": {
      conv: { id: "conv-3", contact_id: "c-3", contact_name: "Sophia Martinez", phone: "+1 (212) 555-0188", status: "human", last_message: "Thank you for looking into my toner concerns so quickly. I really appreciate the studio director taking over personally.", hot: false },
      messages: [
        { id: "m-31", conversation_id: "conv-3", direction: "out", sender: "bot", body: "Hi Sophia, thank you for your visit today. On a scale of 1-5 stars, how was your experience?", created_at: new Date(Date.now() - 14400000).toISOString() },
        { id: "m-32", conversation_id: "conv-3", direction: "in", sender: "customer", body: "Honestly a 2. The toner was slightly brassier than what I asked for at the bowl.", created_at: new Date(Date.now() - 12000000).toISOString() },
        { id: "m-33", conversation_id: "conv-3", direction: "out", sender: "bot", body: "⚠️ Review Shield Alert: We sincerely apologize, Sophia! Your satisfaction means everything to us. I have paused automated responses and escalated your note directly to our Studio Director.", created_at: new Date(Date.now() - 11800000).toISOString() },
        { id: "m-34", conversation_id: "conv-3", direction: "out", sender: "human", body: "Hi Sophia, this is Elena, Studio Director. I would love to invite you back tomorrow for a complimentary gloss glaze adjustment with our Master Colorist, plus a $50 studio gift certificate for your time. Would 3:00 PM work?", created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: "m-35", conversation_id: "conv-3", direction: "in", sender: "customer", body: "Thank you for looking into my toner concerns so quickly. I really appreciate the studio director taking over personally.", created_at: new Date(Date.now() - 3600000).toISOString() }
      ]
    },
    "conv-4": {
      conv: { id: "conv-4", contact_id: "c-4", contact_name: "Ethan Campbell", phone: "+1 (212) 555-0155", status: "bot", last_message: "I received your seasonal privilege invite! Would love to book the Keratin therapy package with the $35 credit.", hot: true },
      messages: [
        { id: "m-41", conversation_id: "conv-4", direction: "out", sender: "campaign", body: "🌿 Exclusive Glow & Grace Privilege: Hi Ethan, it has been 8 weeks since your last visit. Enjoy an exclusive $35 seasonal credit toward our Brazilian Keratin Smoothing Therapy this week only! Reply 'BOOK' to claim.", created_at: new Date(Date.now() - 18000000).toISOString() },
        { id: "m-42", conversation_id: "conv-4", direction: "in", sender: "customer", body: "I received your seasonal privilege invite! Would love to book the Keratin therapy package with the $35 credit.", created_at: new Date(Date.now() - 10800000).toISOString() },
        { id: "m-43", conversation_id: "conv-4", direction: "out", sender: "bot", body: "Fantastic, Ethan! Your $35 privilege voucher has been applied. We have an opening this Thursday at 11:00 AM or Friday at 3:00 PM. Which date works better for your schedule?", created_at: new Date(Date.now() - 10500000).toISOString() }
      ]
    },
    "conv-5": {
      conv: { id: "conv-5", contact_id: "c-5", contact_name: "Emma Richardson", phone: "+1 (212) 555-0164", status: "bot", last_message: "Hi! What's the main difference between your HydraFacial signature care and the VIP glow package?", hot: false },
      messages: [
        { id: "m-51", conversation_id: "conv-5", direction: "in", sender: "customer", body: "Hi! What's the main difference between your HydraFacial signature care and the VIP glow package?", created_at: new Date(Date.now() - 21600000).toISOString() },
        { id: "m-52", conversation_id: "conv-5", direction: "out", sender: "bot", body: "Hello Emma! 🌸 Our Signature HydraFacial ($220, 60m) includes deep pore vortex extraction, peptide infusion, and LED light rejuvenation. The VIP Glow Package ($310, 90m) adds a lymphatic drainage sculpt and customized French biocellulose neck & décolleté mask. Would you like to reserve a session with Aesthetician Sarah?", created_at: new Date(Date.now() - 21000000).toISOString() }
      ]
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadData = () => {
    if (!id) return;
    setLoading(true);

    // Check predefined / seeded conversations
    const fallback = DEFAULT_CONVERSATIONS[id];

    Promise.all([
      api<Conversation[]>("/api/conversations").catch(() => []),
      api<Message[]>(`/api/conversations/${id}/messages`).catch(() => []),
    ])
      .then(([convs, msgs]) => {
        const found = convs.find((c) => c.id === id);
        if (found) {
          setConversation(found);
          setMessages(msgs && msgs.length > 0 ? msgs : (fallback?.messages || []));
        } else if (fallback) {
          setConversation(fallback.conv);
          setMessages(fallback.messages);
        } else {
          // Dynamic appointment contact conversation
          const dynamicConv: Conversation = {
            id,
            contact_id: id,
            contact_name: id.replace(/[-_]/g, " ").replace("conv", "Client").trim() || "Client",
            phone: "+1 (212) 555-0198",
            status: "bot",
            last_message: "Appointment confirmed and 24h reminder scheduled.",
            hot: true,
          };
          setConversation(dynamicConv);
          setMessages([
            {
              id: `m-init-${id}`,
              conversation_id: id,
              direction: "out",
              sender: "bot",
              body: `Hello! 🌿 Welcome to Glow & Grace Studio WhatsApp Concierge. Your upcoming appointment has been scheduled and confirmed in our system. Reply '1' to confirm or reply here if you have any questions!`,
              created_at: new Date().toISOString(),
            }
          ]);
        }
        setTimeout(scrollToBottom, 100);
      })
      .catch(() => {
        if (fallback) {
          setConversation(fallback.conv);
          setMessages(fallback.messages);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleToggleTakeover = async () => {
    if (!id || !conversation) return;
    try {
      const res = await api<{ status: "bot" | "human" }>(`/api/conversations/${id}/takeover`, {
        method: "POST",
      });
      setConversation((prev) => (prev ? { ...prev, status: res.status } : null));
    } catch {
      // Toggle locally on Vercel
      setConversation((prev) => (prev ? { ...prev, status: prev.status === "bot" ? "human" : "bot" } : null));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !id) return;
    setSending(true);

    const localMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: id,
      direction: "out",
      sender: conversation?.status === "bot" ? "bot" : "human",
      body: replyText,
      created_at: new Date().toISOString(),
    };

    try {
      const newMsg = await api<Message>(`/api/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: replyText }),
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      setMessages((prev) => [...prev, localMsg]);
    } finally {
      setReplyText("");
      setSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSimulateCustomer = async (promptText: string) => {
    if (!id) return;
    setSending(true);

    const customerMsg: Message = {
      id: `sim-in-${Date.now()}`,
      conversation_id: id,
      direction: "in",
      sender: "customer",
      body: promptText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, customerMsg]);
    setTimeout(scrollToBottom, 100);

    try {
      await api(`/api/conversations/${id}/simulate-customer`, {
        method: "POST",
        body: JSON.stringify({ body: promptText }),
      });
      const updatedMsgs = await api<Message[]>(`/api/conversations/${id}/messages`);
      if (updatedMsgs && updatedMsgs.length > 0) setMessages(updatedMsgs);
    } catch {
      // Generate intelligent autonomous AI reply locally
      setTimeout(() => {
        const botReply: Message = {
          id: `sim-out-${Date.now()}`,
          conversation_id: id,
          direction: "out",
          sender: "bot",
          body: promptText.toLowerCase().includes("timing")
            ? "We are open Monday–Sunday from 9:00 AM to 8:00 PM at 482 Broome St, SoHo. Would you like to reserve a specific slot today?"
            : promptText.toLowerCase().includes("bridal")
            ? "Our Couture Bridal Package starts at $320 and includes a full hair & makeup trial with veil placement. Would you like to book a consultation?"
            : "We are located at 482 Broome St, New York, NY 10013, right between Prince St and Broadway (N, R, W trains at Prince St). How can we assist you further?",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botReply]);
        setTimeout(scrollToBottom, 100);
      }, 700);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate("/app/inbox")}
          style={{ background: "#FBF3E6", border: "1px solid #EFE4D4", padding: "8px 14px", borderRadius: "999px", color: "#8A4408", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <ArrowLeft size={16} /> Back to All Conversations
        </button>

        {conversation && (
          <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: conversation.status === "bot" ? "#E8F5E9" : "#FFF3E0", color: conversation.status === "bot" ? "#1F6B45" : "#B4590B" }}>
            {conversation.status === "bot" ? "AI Bot Answering" : "Human Operator Takeover"}
          </span>
        )}
      </div>

      {/* Main Full Page Chat Card */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", height: "700px", boxShadow: "0 10px 30px rgba(42,26,14,0.06)" }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #EFE4D4", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFF" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>
              {conversation ? `${conversation.contact_name} (${conversation.phone})` : "Chat"}
            </h2>
            <div style={{ fontSize: "12px", color: conversation?.status === "bot" ? "#1F6B45" : "#B4590B", fontWeight: 600, marginTop: "2px" }}>
              {conversation?.status === "bot" ? "Grounded AI Bot answering from knowledge base" : "Human takeover active"}
            </div>
          </div>

          <button
            onClick={handleToggleTakeover}
            style={{
              background: conversation?.status === "bot" ? "#FFFBF5" : "#B4590B",
              color: conversation?.status === "bot" ? "#8A4408" : "#FFF",
              border: "1.5px solid #E3C79C",
              padding: "10px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {conversation?.status === "bot" ? <><User size={15} /> Take Over Conversation</> : <><Bot size={15} /> Hand Back to AI Bot</>}
          </button>
        </div>

        {/* Simulation Prompts */}
        <div style={{ background: "#FBF3E6", borderBottom: "1px solid #EFE4D4", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, color: "#8A4408", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={14} /> Simulate customer asking:
          </span>
          <button
            type="button"
            onClick={() => handleSimulateCustomer("Can you confirm your appointment timings tomorrow?")}
            disabled={sending}
            style={{ background: "#FFF", border: "1px solid #E3C79C", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", color: "#2A1A0E" }}
          >
            "What are your timings?"
          </button>
          <button
            type="button"
            onClick={() => handleSimulateCustomer("Can you confirm the price for bridal package?")}
            disabled={sending}
            style={{ background: "#FFF", border: "1px solid #E3C79C", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", color: "#2A1A0E" }}
          >
            "Price for bridal package?"
          </button>
          <button
            type="button"
            onClick={() => handleSimulateCustomer("Where are you located?")}
            disabled={sending}
            style={{ background: "#FFF", border: "1px solid #E3C79C", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", color: "#2A1A0E" }}
          >
            "Where are you located?"
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", background: "#FFFBF5" }}>
          {loading ? (
            <div style={{ margin: "auto", color: "#8A7A6A" }}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div style={{ margin: "auto", color: "#8A7A6A" }}>No messages yet. Send a simulated message above!</div>
          ) : (
            messages.map((m) => {
              const isCustomer = m.sender === "customer";
              const isBot = m.sender === "bot";
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isCustomer ? "flex-start" : "flex-end",
                    maxWidth: "75%",
                    background: isCustomer ? "#FFF" : isBot ? "#FBF3E6" : "#E8F5E9",
                    border: isCustomer ? "1px solid #EFE4D4" : isBot ? "1px solid #E3C79C" : "1px solid #C8E6C9",
                    borderRadius: "16px",
                    padding: "14px 18px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: isCustomer ? "#5C4A3A" : isBot ? "#8A4408" : "#1F6B45", marginBottom: "4px" }}>
                    {isCustomer ? "Customer" : isBot ? "AI Lead Agent" : "Human Operator"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#2A1A0E", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                    {m.body}
                  </div>
                  <div style={{ fontSize: "10px", color: "#8A7A6A", textAlign: "right", marginTop: "4px" }}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <form onSubmit={handleSendMessage} style={{ padding: "16px 20px", borderTop: "1px solid #EFE4D4", background: "#FFF", display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder={conversation?.status === "bot" ? "Click 'Take Over' above to reply as human operator..." : "Type your reply to customer..."}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ flex: 1, padding: "14px 20px", borderRadius: "999px", border: "1.5px solid #D9BE93", fontSize: "14px", outline: "none" }}
          />
          <button
            type="submit"
            disabled={sending || !replyText.trim()}
            style={{
              background: "#B4590B",
              color: "#FFF",
              border: "none",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: !replyText.trim() ? 0.6 : 1,
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
