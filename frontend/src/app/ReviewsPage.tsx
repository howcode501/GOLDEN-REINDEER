import React, { useState } from "react";
import { Star, MessageSquare, ThumbsUp, RefreshCw, Send, Check } from "lucide-react";

export default function ReviewsPage() {
  const [reviews] = useState([
    {
      id: "1",
      author: "Priya Nair",
      rating: 5,
      date: "Yesterday",
      text: "Outstanding service! Got a keratin hair treatment and facial done. The stylists are true professionals and very courteous.",
      reply: "Thank you so much Priya! We are thrilled to hear you loved our keratin hair treatment and facial service here in Indiranagar. Looking forward to welcoming you back soon!",
      replyStatus: "posted",
    },
    {
      id: "2",
      author: "Anand K.",
      rating: 4,
      date: "3 days ago",
      text: "Good haircut, but had to wait 15 minutes past my slot time.",
      reply: "Hi Anand, thank you for your feedback! We appreciate your patience and are constantly optimizing our appointment scheduling to eliminate wait times. Glad you liked the haircut!",
      replyStatus: "draft",
    },
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          REPUTATION AGENT
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Google Reviews & SEO-Rich Auto-Replies</h1>
        <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
          AI naturally mentions your services and locality in replies to maximize Google local ranking signals.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: "16px", color: "#2A1A0E" }}>{r.author}</strong>
                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < r.rating ? "#F59E0B" : "none"} color="#F59E0B" />
                  ))}
                  <span style={{ fontSize: "12px", color: "#6B5A4A", marginLeft: "6px" }}>{r.date}</span>
                </div>
              </div>
              <span style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "999px",
                background: r.replyStatus === "posted" ? "#E8F5E9" : "#FFF3E0",
                color: r.replyStatus === "posted" ? "#1F6B45" : "#B4590B",
              }}>
                {r.replyStatus === "posted" ? "Reply Published" : "AI Reply Drafted"}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: "15px", color: "#4A3A2C", lineHeight: 1.5 }}>
              "{r.text}"
            </p>

            <div style={{ background: "#FBF3E6", border: "1px solid #E3C79C", borderRadius: "14px", padding: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#8A4408", marginBottom: "6px" }}>
                AI GENERATED LOCAL-SEO REPLY:
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#2A1A0E", lineHeight: 1.5 }}>
                {r.reply}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
