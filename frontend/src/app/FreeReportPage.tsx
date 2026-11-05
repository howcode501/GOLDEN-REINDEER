import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, AlertCircle, CheckCircle, ArrowRight, Phone, Star, Building2, MapPin } from "lucide-react";
import { api } from "../lib/api";

interface AuditResult {
  place_id: string;
  name: string;
  score: number;
  rating: number;
  reviews_count: number;
  issues: Array<{ title: string; fix: string; weight: number }>;
  competitors: Array<{ name: string; rating: number; score: number }>;
  qr_url: string;
}

export default function FreeReportPage() {
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim()) {
      setError("Please provide your business name and WhatsApp number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api<AuditResult>("/api/booster/audit", {
        method: "POST",
        body: JSON.stringify({
          business_name: businessName,
          phone: phone,
          place_id: "mock_place_" + Date.now(),
        }),
      });
      setReport(res);
    } catch (err: any) {
      // Fallback preview report for mock mode if backend is not yet started
      setReport({
        place_id: "mock_place_123",
        name: businessName,
        score: 68,
        rating: 4.1,
        reviews_count: 24,
        issues: [
          {
            title: "Review rating below benchmark (4.1 < 4.3)",
            fix: "Request reviews from your last 20 satisfied customers using our automated WhatsApp nudge.",
            weight: 15,
          },
          {
            title: "Missing weekly Google Posts",
            fix: "Keep Google informed of your latest offers and services with auto-drafted posts.",
            weight: 10,
          },
          {
            title: "Unanswered customer reviews",
            fix: "Google boosts rankings for businesses that reply to 100% of reviews with relevant local keywords.",
            weight: 10,
          },
        ],
        competitors: [
          { name: "Top Local Competitor", rating: 4.8, score: 92 },
          { name: "Nearby Market Leader", rating: 4.6, score: 85 },
        ],
        qr_url: "https://search.google.com/local/writereview?placeid=mock_place_123",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBF5", color: "#2A1A0E", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #EFE4D4", background: "#FFFBF5", padding: "18px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#2A1A0E", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F6E7CF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#8A4408" }}>
              GR
            </span>
            <span style={{ fontWeight: 700, letterSpacing: "0.18em", fontSize: "14px" }}>GOLDEN REINDEER</span>
          </Link>
          <Link to="/app" style={{ textDecoration: "none", background: "#B4590B", color: "#FFF", fontWeight: 700, fontSize: "14px", padding: "10px 20px", borderRadius: "999px" }}>
            Owner App
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ display: "inline-block", background: "#F6E7CF", color: "#8A4408", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", padding: "6px 14px", borderRadius: "999px", marginBottom: "16px" }}>
            FREE GBP BOOSTER · INSTANT AUDIT
          </span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            See what Google is showing your customers
          </h1>
          <p style={{ fontSize: "18px", color: "#5C4A3A", maxWidth: "600px", margin: "0 auto" }}>
            Get your instant Google Business Profile audit, competitor ranking benchmark, and custom Review QR code.
          </p>
        </div>

        {/* Input Form */}
        {!report && (
          <form onSubmit={handleAudit} style={{ background: "#FBF3E6", border: "1.5px solid #E3C79C", borderRadius: "24px", padding: "36px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                Business Name or Google Place ID
              </label>
              <div style={{ position: "relative" }}>
                <Building2 size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "#8A4408" }} />
                <input
                  type="text"
                  placeholder="e.g. Looks Salon Indiranagar"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid #D9BE93", background: "#FFF", fontSize: "16px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>
                WhatsApp Number (for delivery of report & review QR)
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "#8A4408" }} />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid #D9BE93", background: "#FFF", fontSize: "16px" }}
                />
              </div>
            </div>

            {error && <p style={{ color: "#DC2626", margin: "0", fontSize: "14px" }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{ background: "#B4590B", color: "#FFF", fontWeight: 700, fontSize: "16px", padding: "16px", borderRadius: "999px", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "10px" }}
            >
              {loading ? "Analyzing Google Profile..." : "Generate Free Audit Report"}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Audit Report View */}
        {report && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Top Score Banner */}
            <div style={{ background: "#FBF3E6", border: "2px solid #E3C79C", borderRadius: "24px", padding: "32px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#8A4408", letterSpacing: "0.1em" }}>AUDIT SUMMARY</span>
                <h2 style={{ margin: "4px 0 8px", fontSize: "28px", fontWeight: 800 }}>{report.name}</h2>
                <div style={{ display: "flex", gap: "16px", fontSize: "15px", color: "#5C4A3A" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Star size={16} fill="#F59E0B" color="#F59E0B" /> {report.rating} Rating</span>
                  <span>•</span>
                  <span>{report.reviews_count} Reviews</span>
                </div>
              </div>
              <div style={{ textAlign: "center", background: "#FFFBF5", border: "2px solid #D9BE93", borderRadius: "20px", padding: "18px 28px" }}>
                <div style={{ fontSize: "44px", fontWeight: 800, color: report.score >= 80 ? "#1F6B45" : "#B4590B", lineHeight: 1 }}>{report.score}/100</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#8A4408", marginTop: "6px" }}>OPTIMIZATION SCORE</div>
              </div>
            </div>

            {/* Top Revenue-Leaking Issues */}
            <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "24px", padding: "32px" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertCircle color="#B4590B" /> Top Revenue-Leaking Issues Found
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {report.issues.map((issue, idx) => (
                  <div key={idx} style={{ background: "#FFFBF5", border: "1px solid #EFE4D4", borderRadius: "14px", padding: "18px 20px" }}>
                    <div style={{ fontWeight: 700, fontSize: "16px", color: "#2A1A0E", marginBottom: "6px" }}>{issue.title}</div>
                    <div style={{ fontSize: "14px", color: "#5C4A3A", lineHeight: 1.5 }}><strong>Actionable Fix:</strong> {issue.fix}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Benchmark */}
            <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "24px", padding: "32px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 800 }}>Nearby Competitor Benchmark</h3>
              <p style={{ color: "#5C4A3A", fontSize: "14px", marginBottom: "20px" }}>Top ranking competitors in your area are capturing customer calls by keeping active posts and reviews.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {report.competitors.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", background: "#FBF3E6" }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontWeight: 700, color: "#1F6B45" }}>{c.rating} ★ (Score: {c.score})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to get full platform */}
            <div style={{ background: "#F6E7CF", borderRadius: "24px", padding: "32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: 800 }}>Ready to put your marketing on autopilot?</h3>
              <p style={{ margin: 0, color: "#5C4A3A", maxWidth: "540px" }}>
                Connect your WhatsApp & Google Profile to let Golden Reindeer handle calls, convert leads, and generate 5-star reviews automatically.
              </p>
              <Link to="/login" style={{ textDecoration: "none", background: "#B4590B", color: "#FFF", fontWeight: 700, padding: "14px 28px", borderRadius: "999px" }}>
                Start 14-Day Free Trial →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
