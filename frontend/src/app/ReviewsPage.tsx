import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, Sparkles, Send, Check } from "lucide-react";
import { api } from "../lib/api";

interface Review {
  id: string;
  author: string | null;
  rating: number | null;
  text: string | null;
  reply_text: string | null;
  reply_status: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftingId, setDraftingId] = useState<string | null>(null);

  const loadReviews = () => {
    setLoading(true);
    api<Review[]>("/api/reviews")
      .then(setReviews)
      .catch((err) => console.error("Failed to load reviews:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDraftReply = async (review: Review) => {
    setDraftingId(review.id);
    try {
      const res = await api<{ reply_text: string }>("/api/reviews/draft-reply", {
        method: "POST",
        body: JSON.stringify({
          rating: review.rating || 5,
          review_text: review.text || "",
          author: review.author || "Guest",
        }),
      });

      // Save as draft
      await api(`/api/reviews/${review.id}/reply`, {
        method: "POST",
        body: JSON.stringify({
          reply_text: res.reply_text,
          post_now: false,
        }),
      });
      loadReviews();
    } catch (err) {
      alert("Error generating reply: " + err);
    } finally {
      setDraftingId(null);
    }
  };

  const handlePostReply = async (reviewId: string, replyText: string) => {
    try {
      await api(`/api/reviews/${reviewId}/reply`, {
        method: "POST",
        body: JSON.stringify({
          reply_text: replyText,
          post_now: true,
        }),
      });
      loadReviews();
    } catch (err) {
      alert("Error posting reply: " + err);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          REPUTATION AGENT · GOOGLE REVIEWS
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Google Reviews & SEO-Rich Auto-Replies</h1>
        <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
          AI naturally mentions your services and locality in replies to maximize Google local 3-pack ranking signals.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {loading ? (
          <div style={{ background: "#FFF", padding: "32px", borderRadius: "20px", textAlign: "center", color: "#8A7A6A" }}>
            Loading reviews from Google profile...
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "16px", color: "#2A1A0E" }}>{r.author || "Google User"}</strong>
                  <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill={i < (r.rating || 5) ? "#F59E0B" : "none"} color="#F59E0B" />
                    ))}
                  </div>
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: r.reply_status === "posted" ? "#E8F5E9" : r.reply_status === "draft" ? "#FFF3E0" : "#F5EFE6",
                  color: r.reply_status === "posted" ? "#1F6B45" : r.reply_status === "draft" ? "#B4590B" : "#8A7A6A",
                }}>
                  {r.reply_status === "posted" ? "Reply Published" : r.reply_status === "draft" ? "AI Reply Drafted" : "Unanswered"}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: "15px", color: "#4A3A2C", lineHeight: 1.5 }}>
                "{r.text}"
              </p>

              {r.reply_text ? (
                <div style={{ background: "#FBF3E6", border: "1px solid #E3C79C", borderRadius: "14px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#8A4408" }}>
                      AI GENERATED LOCAL-SEO REPLY:
                    </div>
                    {r.reply_status !== "posted" && (
                      <button
                        onClick={() => handlePostReply(r.id, r.reply_text!)}
                        style={{ background: "#1F6B45", color: "#FFF", border: "none", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Check size={12} /> Post to Google Profile
                      </button>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#2A1A0E", lineHeight: 1.5 }}>
                    {r.reply_text}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleDraftReply(r)}
                    disabled={draftingId === r.id}
                    style={{ background: "#B4590B", color: "#FFF", border: "none", padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <Sparkles size={14} /> {draftingId === r.id ? "Drafting with AI..." : "Generate SEO-Rich Reply"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
