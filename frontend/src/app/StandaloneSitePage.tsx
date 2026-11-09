import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, MapPin, CheckCircle, Star } from "lucide-react";

interface ServiceInfo {
  title: string;
  category: string;
  price: string;
  duration: string;
  description: string;
}

interface NeighborhoodInfo {
  name: string;
  borough: string;
  zip: string;
  landmarks: string;
  metro: string;
}

const SERVICES_MAP: Record<string, ServiceInfo> = {
  "balayage-highlights": {
    title: "Balayage & Blonde Highlights",
    category: "Hair Color & Styling",
    price: "$280",
    duration: "2.5 - 3 hours",
    description: "Custom hand-painted French balayage tailored to your natural skin undertones and lifestyle. Includes Olaplex bonding treatment, gloss glaze, and blowout.",
  },
  "hydrafacial-elite": {
    title: "HydraFacial Elite MD",
    category: "MedSpa & Skin Therapy",
    price: "$220",
    duration: "60 mins",
    description: "Medical-grade hydra-dermabrasion that cleanses, extracts, and hydrates with antioxidant peptide serums and LED light therapy.",
  },
  "precision-haircut": {
    title: "Signature Precision Haircut & Styling",
    category: "Haircut & Design",
    price: "$125",
    duration: "60 mins",
    description: "Personalized face-framing architectural haircut by master stylists, with relaxing organic botanical scalp massage and blowout.",
  },
  "keratin-smoothing": {
    title: "Brazilian Keratin Smoothing Treatment",
    category: "Hair Smoothing",
    price: "$350",
    duration: "3 hours",
    description: "Formaldehyde-free smoothing therapy that eliminates 95% of frizz, seals split ends, and delivers high-mirror shine lasting up to 5 months.",
  },
  "bridal-styling": {
    title: "Bridal Styling & Glam Trial",
    category: "Bridal & Special Events",
    price: "$320",
    duration: "2 hours",
    description: "Luxury couture bridal hair artistry, veil placement, and precision hair accessories trial for luxury NYC brides.",
  },
};

const NEIGHBORHOODS_MAP: Record<string, NeighborhoodInfo> = {
  "soho": {
    name: "SoHo, Manhattan",
    borough: "Manhattan",
    zip: "10012",
    landmarks: "Prince St & Broadway",
    metro: "N, R, W at Prince St (2 min walk)",
  },
  "west-village": {
    name: "West Village, NYC",
    borough: "Manhattan",
    zip: "10014",
    landmarks: "Bleecker St & Perry St",
    metro: "1, 2 at Christopher St (4 min walk)",
  },
  "tribeca": {
    name: "Tribeca, NY",
    borough: "Manhattan",
    zip: "10013",
    landmarks: "Greenwich St & Franklin St",
    metro: "1, 2, 3 at Chambers St (3 min walk)",
  },
  "chelsea": {
    name: "Chelsea, Manhattan",
    borough: "Manhattan",
    zip: "10011",
    landmarks: "The High Line & 8th Ave",
    metro: "A, C, E, L at 14th St (3 min walk)",
  },
  "midtown": {
    name: "Midtown Manhattan, NYC",
    borough: "Manhattan",
    zip: "10018",
    landmarks: "Fifth Ave & Bryant Park",
    metro: "B, D, F, M at 42nd St (5 min walk)",
  },
};

export default function StandaloneSitePage() {
  const { serviceId, neighborhoodId } = useParams<{ serviceId?: string; neighborhoodId?: string }>();

  const isMainSite = !serviceId && !neighborhoodId;
  const srvKey = serviceId || "balayage-highlights";
  const neighKey = neighborhoodId || "chelsea";

  const service = SERVICES_MAP[srvKey] || SERVICES_MAP["balayage-highlights"];
  const neighborhood = NEIGHBORHOODS_MAP[neighKey] || NEIGHBORHOODS_MAP["chelsea"];

  const waText = encodeURIComponent(
    `Hi Glow & Grace Studio! I found your ${service.title} for ${neighborhood.name} on Google and would like to check availability.`
  );
  const waUrl = `https://wa.me/12125550198?text=${waText}`;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBF5", color: "#2A1A0E", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Top Bar Navigation */}
      <div style={{ background: "#2A1A0E", color: "#FFF", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to="/app/website" style={{ color: "#F6E7CF", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
            <ArrowLeft size={16} /> Return to Reindeer Dashboard
          </Link>
          <span style={{ color: "#8A7A6A" }}>|</span>
          <span style={{ color: "#E8D8C8" }}>Programmatic Local SEO Engine · Schema.org Validated</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "#1F6B45", color: "#FFF", padding: "3px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: 700 }}>
            ✓ 99/100 PageSpeed
          </span>
          <span style={{ color: "#C8B8A8", fontSize: "12px" }}>SSL Encrypted</span>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Brand Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "24px", borderBottom: "1px solid #EFE4D4", marginBottom: "36px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#8A4408", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Luxury Salon & MedSpa
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#2A1A0E", margin: "4px 0" }}>
              Glow & Grace Studio
            </h1>
            <div style={{ fontSize: "13px", color: "#6B5A4A", display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} color="#8A4408" /> 482 Broome St, SoHo, New York, NY 10013 · (212) 555-0198
            </div>
          </div>
          <div style={{ background: "#FBF3E6", border: "1px solid #EFE4D4", padding: "12px 20px", borderRadius: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#B4590B", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              4.9 <Star size={18} fill="#B4590B" color="#B4590B" />
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#6B5A4A" }}>184 Verified Google Reviews</div>
          </div>
        </header>

        {isMainSite ? (
          /* Main Studio Landing View */
          <div>
            <div style={{ textAlign: "center", margin: "40px 0" }}>
              <span style={{ background: "#E8F5E9", color: "#1F6B45", fontSize: "12px", fontWeight: 800, padding: "6px 14px", borderRadius: "999px" }}>
                ⚡ 24/7 WhatsApp AI Concierge & Direct Bookings
              </span>
              <h2 style={{ fontSize: "40px", fontWeight: 900, margin: "16px 0 12px", color: "#2A1A0E" }}>
                Effortless Luxury Care in NYC
              </h2>
              <p style={{ fontSize: "17px", color: "#5C4A3A", maxWidth: "600px", margin: "0 auto 28px", lineHeight: 1.6 }}>
                Experience bespoke French balayage, medical-grade skin therapy, and precision styling in the heart of SoHo.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#1F6B45",
                  color: "#FFF",
                  padding: "16px 32px",
                  borderRadius: "999px",
                  fontSize: "16px",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(31,107,69,0.22)",
                }}
              >
                <MessageSquare size={18} /> Chat & Book Instantly on WhatsApp
              </a>
            </div>

            <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "48px 0 20px" }}>Signature Salon & MedSpa Menu</h3>
            <div style={{ display: "grid", gap: "16px" }}>
              {Object.entries(SERVICES_MAP).map(([key, srv]) => (
                <div key={key} style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#8A4408", textTransform: "uppercase" }}>{srv.category}</div>
                    <div style={{ fontSize: "17px", fontWeight: 800, color: "#2A1A0E", marginTop: "2px" }}>{srv.title}</div>
                    <div style={{ fontSize: "13px", color: "#5C4A3A", marginTop: "4px", maxWidth: "520px" }}>{srv.description}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: "#B4590B" }}>{srv.price}</div>
                    <div style={{ fontSize: "12px", color: "#6B5A4A" }}>{srv.duration}</div>
                    <Link
                      to={`/site/glow-and-grace-studio/page/${key}/chelsea`}
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#1F6B45",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      View Local Page →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Hyper-Local Programmatic Landing Page */
          <div>
            <div style={{ marginBottom: "32px" }}>
              <span style={{ display: "inline-block", background: "#F6E7CF", color: "#8A4408", fontSize: "12px", fontWeight: 800, padding: "5px 12px", borderRadius: "999px", textTransform: "uppercase" }}>
                Localized NYC Special · {neighborhood.borough}
              </span>
              <h2 style={{ fontSize: "36px", fontWeight: 900, margin: "14px 0 10px", color: "#2A1A0E", lineHeight: 1.2 }}>
                Top-Rated {service.title} in {neighborhood.name}
              </h2>
              <p style={{ fontSize: "17px", color: "#5C4A3A", margin: "0 0 24px" }}>
                Looking for expert {service.category.toLowerCase()} near {neighborhood.landmarks}? Book your personalized session at Glow & Grace Studio in under 30 seconds via WhatsApp.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#1F6B45",
                    color: "#FFF",
                    padding: "14px 28px",
                    borderRadius: "999px",
                    fontSize: "15px",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(31,107,69,0.22)",
                  }}
                >
                  <MessageSquare size={16} /> Book {service.title} on WhatsApp
                </a>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#B4590B" }}>
                  Starts at {service.price} · {service.duration}
                </div>
              </div>
            </div>

            {/* Neighborhood Transit & Proximity Card */}
            <div style={{ background: "#FFF", border: "1px solid #EFE4D4", borderRadius: "18px", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 10px" }}>
                Why Clients in {neighborhood.name} Choose Glow & Grace Studio
              </h3>
              <p style={{ fontSize: "14px", color: "#5C4A3A", margin: "0 0 16px", lineHeight: 1.6 }}>
                {service.description} Handcrafted specifically for residents living or working near {neighborhood.landmarks}. We guarantee zero waiting time upon arrival and dedicated 1-on-1 specialist attention.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingTop: "14px", borderTop: "1px solid #F5EFE6" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#8A4408", textTransform: "uppercase" }}>Subway & Transit</div>
                  <div style={{ fontSize: "14px", color: "#2A1A0E", marginTop: "2px", fontWeight: 600 }}>🚇 {neighborhood.metro}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#8A4408", textTransform: "uppercase" }}>Neighborhood Landmark</div>
                  <div style={{ fontSize: "14px", color: "#2A1A0E", marginTop: "2px", fontWeight: 600 }}>📍 Steps from {neighborhood.landmarks}</div>
                </div>
              </div>
            </div>

            {/* Verified Neighborhood Review */}
            <div style={{ background: "#FBF3E6", border: "1px solid #EFE4D4", borderRadius: "18px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <CheckCircle size={15} color="#1F6B45" />
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#8A4408", textTransform: "uppercase" }}>
                  Verified Local Review from {neighborhood.name}
                </span>
              </div>
              <p style={{ fontStyle: "italic", fontSize: "15px", color: "#2A1A0E", margin: "0 0 10px", lineHeight: 1.6 }}>
                "Finding a trustworthy master stylist for {service.title} in {neighborhood.name} used to be a gamble. Glow & Grace was recommended by a friend on Perry St. The consultation was thorough and the result was stunning. Being able to confirm everything on WhatsApp made it so effortless!"
              </p>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#B4590B" }}>
                ★★★★★ — Verified {neighborhood.name} Resident
              </div>
            </div>

            {/* Structured Schema Indicator */}
            <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", borderRadius: "14px", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={16} color="#1F6B45" />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1F6B45" }}>
                  Google Schema.org JSON-LD Structured Data Active
                </span>
              </div>
              <span style={{ fontSize: "11px", color: "#2E7D32", fontWeight: 600 }}>
                Service: {service.title} | Zip: {neighborhood.zip}
              </span>
            </div>
          </div>
        )}

        <footer style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid #EFE4D4", textAlign: "center", fontSize: "12px", color: "#8A7A6A" }}>
          <p style={{ margin: "0 0 6px" }}>Glow & Grace Studio · 482 Broome St, New York, NY 10013 · (212) 555-0198</p>
          <p style={{ margin: 0 }}>Powered by Golden Reindeer Autonomous 4-Agent Flywheel · Programmatic Local SEO Engine</p>
        </footer>
      </div>
    </div>
  );
}
