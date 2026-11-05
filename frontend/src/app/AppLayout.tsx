import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Megaphone, 
  Search, 
  Star, 
  Zap, 
  Settings as SettingsIcon,
  Globe,
  Sparkles
} from "lucide-react";

export default function AppLayout() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/app", icon: LayoutDashboard },
    { label: "Leads & CRM", path: "/app/leads", icon: Users },
    { label: "WhatsApp Inbox", path: "/app/inbox", icon: MessageSquare },
    { label: "Campaigns", path: "/app/campaigns", icon: Megaphone },
    { label: "Google AI Agent", path: "/app/google", icon: Search },
    { label: "Reviews", path: "/app/reviews", icon: Star },
    { label: "Automation Store", path: "/app/automations", icon: Zap },
    { label: "Website & SEO", path: "/app/website", icon: Globe },
    { label: "Settings", path: "/app/settings", icon: SettingsIcon },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FFFBF5", color: "#2A1A0E", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", borderRight: "1px solid #EFE4D4", background: "#FBF3E6", display: "flex", flexDirection: "column", padding: "24px 16px", boxSizing: "border-box" }}>
        {/* Brand */}
        <Link to="/" style={{ textDecoration: "none", color: "#2A1A0E", display: "flex", alignItems: "center", gap: "12px", padding: "0 8px 24px" }}>
          <span style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F6E7CF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#8A4408" }}>
            GR
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "0.14em" }}>GOLDEN REINDEER</div>
            <div style={{ fontSize: "11px", color: "#8A4408", fontWeight: 600 }}>MARKETING FLYWHEEL</div>
          </div>
        </Link>

        {/* Business Selector */}
        <div style={{ background: "#FFFBF5", border: "1px solid #E3C79C", borderRadius: "12px", padding: "10px 12px", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#8A4408", letterSpacing: "0.08em" }}>CONNECTED BUSINESS</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#2A1A0E", marginTop: "2px" }}>Glow & Grace Salon</div>
          <div style={{ fontSize: "12px", color: "#1F6B45", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1F6B45" }}></span>
            AI Team Active
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#FFF" : "#4A3A2C",
                  background: isActive ? "#B4590B" : "transparent",
                  transition: "background 0.15s ease",
                }}
              >
                <Icon size={18} color={isActive ? "#FFF" : "#8A4408"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Banner */}
        <div style={{ background: "#F6E7CF", border: "1px solid #E3C79C", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
          <Sparkles size={16} color="#8A4408" style={{ marginBottom: "4px" }} />
          <div style={{ fontSize: "12px", fontWeight: 700 }}>Autonomous Flywheel</div>
          <div style={{ fontSize: "11px", color: "#5C4A3A", marginTop: "2px" }}>4 AI Agents connected to Shared Brain</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxHeight: "100vh", boxSizing: "border-box" }}>
        <Outlet />
      </main>
    </div>
  );
}
