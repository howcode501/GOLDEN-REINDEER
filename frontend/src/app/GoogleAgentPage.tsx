import React, { useState, useEffect } from "react";
import { Search, Sparkles, Plus, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "../lib/api";

interface Keyword {
  keyword: string;
  intent: string;
  difficulty: string;
  volume_est: string;
}

interface RewriteDiff {
  original: string;
  proposed: string;
  optimized_keywords: string[];
  improvements: string[];
}

interface GBPPost {
  id: string;
  body: string;
  keyword: string | null;
  status: string;
  published_at?: string;
}

export default function GoogleAgentPage() {
  const [profile, setProfile] = useState<any>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [city, setCity] = useState("Mumbai");
  const [vertical, setVertical] = useState("salon");
  const [diff, setDiff] = useState<RewriteDiff | null>(null);
  const [posts, setPosts] = useState<GBPPost[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostKeyword, setNewPostKeyword] = useState("");
  const [loadingKw, setLoadingKw] = useState(false);

  useEffect(() => {
    api<any>("/api/gbp/profile").then(setProfile).catch(() => {});
    api<GBPPost[]>("/api/gbp/posts").then(setPosts).catch(() => {});
  }, []);

  const handleGenerateKeywords = async () => {
    setLoadingKw(true);
    try {
      const data = await api<Keyword[]>("/api/gbp/keywords", {
        method: "POST",
        body: JSON.stringify({
          business_name: profile?.name || "Golden Radiance Studio",
          vertical,
          city,
        }),
      });
      setKeywords(data);
    } catch (err) {
      alert("Error generating keywords: " + err);
    } finally {
      setLoadingKw(false);
    }
  };

  const handleGenerateRewrite = async () => {
    try {
      const data = await api<RewriteDiff>("/api/gbp/rewrite", {
        method: "POST",
        body: JSON.stringify({
          current_description: profile?.description,
          keywords: keywords.map((k) => k.keyword),
        }),
      });
      setDiff(data);
    } catch (err) {
      alert("Error generating rewrite: " + err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText) return;
    try {
      await api("/api/gbp/posts", {
        method: "POST",
        body: JSON.stringify({
          body: newPostText,
          keyword: newPostKeyword || undefined,
        }),
      });
      setNewPostText("");
      setNewPostKeyword("");
      api<GBPPost[]>("/api/gbp/posts").then(setPosts);
    } catch (err) {
      alert("Error creating post: " + err);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#8A4408", background: "#F6E7CF", padding: "4px 10px", borderRadius: "999px" }}>
          GOOGLE AI AGENT · PAID GBP SUITE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "8px 0 0" }}>Google Business Profile Engine</h1>
        <p style={{ margin: "6px 0 0", color: "#5C4A3A", fontSize: "15px" }}>
          Keyword planning, algorithmic profile rewrite, and auto-published Google Posts to rank in the Local 3-Pack.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#1F6B45", background: "#E8F5E9", padding: "3px 8px", borderRadius: "6px" }}>
            CONNECTED TO GOOGLE PLACES
          </span>
          <h2 style={{ margin: "8px 0 4px", fontSize: "22px", fontWeight: 800 }}>{profile?.name || "Golden Radiance Studio"}</h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#6B5A4A" }}>{profile?.address || "Sector 30A, Vashi, Navi Mumbai"}</p>
        </div>
        <div style={{ display: "flex", gap: "24px", textAlign: "right" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#B4590B" }}>{profile?.rating || 4.6} ★</div>
            <div style={{ fontSize: "12px", color: "#6B5A4A" }}>{profile?.reviews_count || 142} Reviews</div>
          </div>
        </div>
      </div>

      {/* 1. Keyword Research Tool */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "28px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 800 }}>1. Local Intent Keyword Generator</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", marginBottom: "20px" }}>
          <select value={vertical} onChange={(e) => setVertical(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #EFE4D4" }}>
            <option value="salon">Salon & Spa</option>
            <option value="clinic">Skin & Dental Clinic</option>
            <option value="gym">Gym & Calisthenics</option>
            <option value="restaurant">Restaurant & Dining</option>
          </select>
          <input
            type="text"
            placeholder="Target City or Locality"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #EFE4D4" }}
          />
          <button
            onClick={handleGenerateKeywords}
            disabled={loadingKw}
            style={{ padding: "10px 20px", background: "#B4590B", color: "#FFF", border: "none", borderRadius: "999px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Search size={16} /> {loadingKw ? "Searching..." : "Find Keywords"}
          </button>
        </div>

        {keywords.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {keywords.map((k, idx) => (
              <div key={idx} style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "10px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#2A1A0E" }}>{k.keyword}</span>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
                  <span style={{ color: "#1F6B45", fontWeight: 600 }}>{k.intent}</span>
                  <span style={{ color: "#8A4408", fontWeight: 600 }}>Vol: {k.volume_est}</span>
                </div>
              </div>
            ))}
            <button
              onClick={handleGenerateRewrite}
              style={{ marginTop: "12px", alignSelf: "flex-start", padding: "10px 18px", background: "#2A1A0E", color: "#FFF", border: "none", borderRadius: "999px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={14} /> Generate Profile Rewrite with These Keywords
            </button>
          </div>
        )}
      </div>

      {/* 2. Profile Rewrite Diff */}
      {diff && (
        <div style={{ background: "#FBF3E6", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "28px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 800 }}>2. AI Profile Content Rewrite (Diff)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ background: "#FFF", padding: "16px", borderRadius: "12px", border: "1px solid #EFE4D4" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#8A7A6A", marginBottom: "8px" }}>CURRENT PROFILE</div>
              <p style={{ margin: 0, fontSize: "14px", color: "#5C4A3A", lineHeight: 1.5 }}>{diff.original}</p>
            </div>
            <div style={{ background: "#FFF", padding: "16px", borderRadius: "12px", border: "1px solid #B4590B" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#B4590B", marginBottom: "8px" }}>PROPOSED KEYWORD-OPTIMIZED</div>
              <p style={{ margin: 0, fontSize: "14px", color: "#2A1A0E", lineHeight: 1.5, fontWeight: 500 }}>{diff.proposed}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Auto-Published Google Posts */}
      <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "20px", padding: "28px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 800 }}>3. Google Business Profile Posts</h3>
        <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          <textarea
            placeholder="Write post update / weekend offer to publish directly to Google Business Profile..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "14px", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Target keyword tag (e.g. hair spa in Vashi)"
              value={newPostKeyword}
              onChange={(e) => setNewPostKeyword(e.target.value)}
              style={{ width: "320px", padding: "10px", borderRadius: "10px", border: "1px solid #EFE4D4", fontSize: "13px" }}
            />
            <button
              type="submit"
              style={{ padding: "10px 20px", background: "#B4590B", color: "#FFF", border: "none", borderRadius: "999px", fontWeight: 800, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} /> Publish Post
            </button>
          </div>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {posts.map((p) => (
            <div key={p.id} style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#2A1A0E" }}>{p.body}</p>
                {p.keyword && <span style={{ fontSize: "11px", fontWeight: 700, color: "#8A4408", background: "#F6E7CF", padding: "2px 8px", borderRadius: "6px" }}>#{p.keyword}</span>}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#1F6B45", background: "#E8F5E9", padding: "3px 8px", borderRadius: "6px" }}>
                {p.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
