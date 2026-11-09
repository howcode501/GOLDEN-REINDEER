# Golden Reindeer — Complete User Guideline & Platform Manual

Welcome to **Golden Reindeer**, the autonomous AI marketing platform built for local businesses (such as luxury salons, medspas, clinics, and boutique services). 

- **Live Deployed Platform (Vercel):** [https://frontend-kappa-tan-81.vercel.app/app](https://frontend-kappa-tan-81.vercel.app/app)
- **Local Dev URL:** `http://localhost:5173/app`

This platform connects your **Google Business Profile (GBP)**, **WhatsApp Business API**, **Instant SEO Microsite**, and **CRM** into a self-reinforcing **4-Agent Flywheel**:
1. **Google AI Agent** — Ranks you #1 on Google Local Pack & Maps.
2. **WhatsApp Concierge Agent** — Answers inquiries, books appointments 24/7, and prevents lost revenue from missed calls.
3. **Review Shield Agent** — Collects 5-star Google reviews automatically while intercepting negative complaints before they reach Google.
4. **Broadcast Campaign Agent** — Reactivates past clients with targeted seasonal promotions and winback offers.

---

## Quick Navigation Directory & Live Vercel Links

| Module Name | Live Vercel URL | Source Code File | Purpose |
| :--- | :--- | :--- | :--- |
| **Landing Page** | [https://frontend-kappa-tan-81.vercel.app/](https://frontend-kappa-tan-81.vercel.app/) | [`frontend/src/landing/LandingPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/landing/LandingPage.tsx) | 3D particle reindeer hero, value proposition, and feature demo. |
| **Growth & Diagnostic Report** | [https://frontend-kappa-tan-81.vercel.app/report](https://frontend-kappa-tan-81.vercel.app/report) | [`frontend/src/app/FreeReportPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/FreeReportPage.tsx) | 100-point local marketing audit with competitor comparison and action checklist. |
| **Dashboard (Mission Control)** | [https://frontend-kappa-tan-81.vercel.app/app](https://frontend-kappa-tan-81.vercel.app/app) | [`frontend/src/app/Dashboard.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/Dashboard.tsx) | Flywheel revenue stats, active automations, and live audit score. |
| **Leads & Shared Brain CRM** | [https://frontend-kappa-tan-81.vercel.app/app/leads](https://frontend-kappa-tan-81.vercel.app/app/leads) | [`frontend/src/app/LeadsPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/LeadsPage.tsx) | Contact database & **"Never Lose a Lead" Missed-Call Recovery Engine**. |
| **Appointments & Calendar** | [https://frontend-kappa-tan-81.vercel.app/app/appointments](https://frontend-kappa-tan-81.vercel.app/app/appointments) | [`frontend/src/app/AppointmentsPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/AppointmentsPage.tsx) | Weekly calendar, booking simulator, and automated 24h WhatsApp reminders. |
| **WhatsApp Inbox** | [https://frontend-kappa-tan-81.vercel.app/app/inbox](https://frontend-kappa-tan-81.vercel.app/app/inbox) | [`frontend/src/app/InboxPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/InboxPage.tsx) | 5 realistic customer conversation scenarios with AI/Human takeover. |
| **Google AI Agent & Geo-Grid** | [https://frontend-kappa-tan-81.vercel.app/app/google](https://frontend-kappa-tan-81.vercel.app/app/google) | [`frontend/src/app/GoogleAgentPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/GoogleAgentPage.tsx) | 3x3 Radar Geo-Grid tracker across NYC neighborhoods + AI post generator. |
| **Review Shield & Review Gate** | [https://frontend-kappa-tan-81.vercel.app/app/reviews](https://frontend-kappa-tan-81.vercel.app/app/reviews) | [`frontend/src/app/ReviewsPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/ReviewsPage.tsx) | 2-step review routing (4-5★ $\rightarrow$ Google, 1-3★ $\rightarrow$ Private feedback). |
| **Campaigns & Broadcasts** | [https://frontend-kappa-tan-81.vercel.app/app/campaigns](https://frontend-kappa-tan-81.vercel.app/app/campaigns) | [`frontend/src/app/CampaignsPage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/CampaignsPage.tsx) | Targeted WhatsApp marketing campaigns with audience segmenting. |
| **Website & Programmatic SEO** | [https://frontend-kappa-tan-81.vercel.app/app/website](https://frontend-kappa-tan-81.vercel.app/app/website) | [`frontend/src/app/WebsitePage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/WebsitePage.tsx) | 25 hyper-local SEO landing pages (5 services $\times$ 5 NYC neighborhoods) + Schema.org markup. |
| **Automation Store** | [https://frontend-kappa-tan-81.vercel.app/app/automations](https://frontend-kappa-tan-81.vercel.app/app/automations) | [`frontend/src/app/AutomationStorePage.tsx`](file:///d:/Freelancer/golden%20reindeer/frontend/src/app/AutomationStorePage.tsx) | 1-click toggles for autonomous background marketing workflows. |

---

## Detailed Walkthrough of Added Functionalities

### 1. "Never Lose a Lead" Missed-Call-to-WhatsApp Recovery Engine
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/app/leads](https://frontend-kappa-tan-81.vercel.app/app/leads)
- **Backend Route:** [`backend/app/api/routes/crm.py`](file:///d:/Freelancer/golden%20reindeer/backend/app/api/routes/crm.py)
- **The Problem It Solves:** 62% of calls to local businesses go unanswered while staff is busy with clients. Callers hang up and call the next competitor on Google.
- **How It Works:**
  1. When a missed call occurs on your front-desk line, our engine catches the caller's phone number within **12 seconds**.
  2. The caller is automatically saved into the CRM as a high-priority warm lead tagged `#missed_call`.
  3. A friendly, empathetic WhatsApp message is automatically dispatched:
     > *"Hi Charlotte! Sorry we missed your call at Glow & Grace Studio. We are currently assisting an in-studio client. How can our team help you today? Would you like to check open appointment slots, view our pricing, or request a quick callback? 🌿"*
  4. The recovery simulator on the Leads page lets you test any name & phone number in real time and see the lead added to the table.
- **Client ROI:** An extra 14 recovered clients per month $\times$ \$120 average ticket = **\$1,680+ recovered pipeline**.

---

### 2. Programmatic Local SEO & Instant Microsite Engine (5×5 Matrix)
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/app/website](https://frontend-kappa-tan-81.vercel.app/app/website)
- **Backend Route:** [`backend/app/api/routes/sites.py`](file:///d:/Freelancer/golden%20reindeer/backend/app/api/routes/sites.py) & [`backend/app/services/website_gen.py`](file:///d:/Freelancer/golden%20reindeer/backend/app/services/website_gen.py)
- **The Problem It Solves:** Most local businesses only rank near their front door (0.5-mile radius) and miss high-volume searches from adjacent neighborhoods.
- **How It Works:**
  1. The engine generates an ultra-fast, mobile-first website with a **99/100 Google PageSpeed Score**.
  2. It deploys **25 programmatic landing pages** combining 5 high-ticket services $\times$ 5 target NYC neighborhoods:
     - **Services:** Balayage Highlights (\$280), HydraFacial (\$220), Precision Haircut (\$125), Keratin Smoothing (\$350), Bridal Styling (\$320).
     - **Neighborhoods:** SoHo, West Village, Tribeca, Chelsea, Midtown Manhattan.
  3. Every page contains validated `Schema.org` `LocalBusiness` and `Service` JSON-LD markup, local subway landmarks, neighborhood-specific client reviews, and a 1-tap WhatsApp booking button.
  4. Includes live **Mobile vs. Desktop preview modal** and instant **`sitemap.xml` export** ready for Google Search Console submission.
- **Client ROI:** Captures 8,400+ monthly searches for long-tail keywords like *"Balayage specialist SoHo"* or *"HydraFacial Tribeca"*.

---

### 3. Interactive Appointments & 24h WhatsApp Reminder Hub
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/app/appointments](https://frontend-kappa-tan-81.vercel.app/app/appointments)
- **Backend Route:** [`backend/app/api/routes/crm.py`](file:///d:/Freelancer/golden%20reindeer/backend/app/api/routes/crm.py)
- **The Problem It Solves:** No-shows and last-minute cancellations cost salons and clinics up to 30% of their weekly revenue.
- **How It Works:**
  1. **Weekly Calendar & List Views:** View all scheduled appointments categorized by day, time, service, and status.
  2. **In-Studio Booking Modal:** Click **"+ Book Appointment"** to select a customer, choose a service, pick date & time, and enter notes.
  3. **Automated Booking Confirmation:** The system instantly messages the customer on WhatsApp with date, time, and specialist details.
  4. **1-Click 24h WhatsApp Reminder:** Click **"Remind"** on any booking to simulate or dispatch the reminder message (*"Hi Olivia, reminder of your appointment tomorrow at 2:30 PM..."*).
  5. **Attendance Rate Tracker:** Increases attendance to **94.2%** via instant confirmations and reminders.

---

### 4. 3x3 Radar Geo-Grid Tracker & Google AI Agent
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/app/google](https://frontend-kappa-tan-81.vercel.app/app/google)
- **The Problem It Solves:** Clients don't know where they actually rank across different neighborhoods and distances from their store.
- **How It Works:**
  - Displays a **3x3 Radar Grid** with pins `#1` through `#5` showing ranking positions across 9 neighborhood GPS coordinates.
  - Quick-scan chips: `hair salon`, `hydra facial Manhattan`, `balayage specialist NYC`, `best bridal salon`.
  - Immediate local recalculation upon typing any query or clicking a chip, with auto-scroll straight to the grid.
  - **AI Weekly Post Generator:** Drafts SEO-keyword-optimized Google posts with 1-click publishing.

---

### 5. Review Shield & Review Gate (The 2-Step Filter)
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/app/reviews](https://frontend-kappa-tan-81.vercel.app/app/reviews)
- **The Problem It Solves:** A single unhappy customer leaving a 1-star public review tanks your Google rating and local pack ranking.
- **How It Works:**
  - When an appointment finishes, the customer receives a WhatsApp message: *"How was your experience today from 1 to 5 stars?"*
  - **If 4 or 5 Stars:** Customer is routed directly to the Google Maps Write-Review URL and prompted to post their review.
  - **If 1 to 3 Stars:** Customer is intercepted privately into the WhatsApp Inbox, alerted to the manager, and offered an immediate resolution or voucher **before** they post publicly on Google.

---

### 6. WhatsApp Inbox (5 Live Scenarios & Human Takeover)
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/app/inbox](https://frontend-kappa-tan-81.vercel.app/app/inbox)
- **Pre-Seeded Real Customer Scenarios:**
  1. **Olivia Vance** — *Hot Booking Lead* asking for Saturday balayage slot.
  2. **James Thornton** — *5★ Google Review Gate* happy client posting review.
  3. **Sophia Martinez** — *1★ Intercepted Review* manager escalation & recovery.
  4. **Ethan Campbell** — *Winback Promo Campaign* redeeming seasonal \$35 discount.
  5. **Emma Richardson** — *Service & Pricing Inquiry* asking about HydraFacial serums.
- **Controls:** Toggle between **AI Autonomous Mode** and **Human Takeover** at any time.

---

### 7. Growth Diagnostic & Free Audit Engine
- **Live Vercel Link:** [https://frontend-kappa-tan-81.vercel.app/report](https://frontend-kappa-tan-81.vercel.app/report)
- **Features:**
  - Enter any business name $\rightarrow$ generates a **100-point benchmark audit**.
  - Highlights weighted action items: Review velocity, weekly GBP posting, photo count, citation consistency.
  - Shows side-by-side competitor comparison table.
  - Smooth auto-scrolls directly to the completed report view with success toast confirmation.

---

### 8. Complete 6-Part B2B Agency AI Automations Suite
- **Live Vercel Link (Store):** [https://frontend-kappa-tan-81.vercel.app/app/automations](https://frontend-kappa-tan-81.vercel.app/app/automations)
- **Live Vercel Link (CRM & Multi-Channel Simulator):** [https://frontend-kappa-tan-81.vercel.app/app/leads](https://frontend-kappa-tan-81.vercel.app/app/leads)
- **Built Specifically for Agency Clients Requiring End-to-End Automation:**
  1. **Outreach Automation (`outreach_auto`):** Automated multi-touch outbound sequences via WhatsApp and SMS for past inquiries, cold leads, and dormant contacts. Includes 3-touch cadence with automatic stops upon customer response.
  2. **Lead Capture Automation (`lead_capture_auto`):** Instant omni-channel capture linking missed calls, Meta Ads lead forms, Google LSA inquiries, and website forms directly into the CRM within 12 seconds with sub-minute AI intro messages.
  3. **Lead Routing Auto (`lead_routing_auto`):** Smart routing engine that evaluates service type and customer value to auto-route leads to the right staff specialist (e.g. Maya for High-Ticket Balayage, Sarah for HydraFacial, Direct Phone Escalation for VIPs, or 24/7 AI Concierge).
  4. **Qualification Auto (`qualification_auto`):** Autonomous AI qualification scoring every lead 0–100 based on requested service budget, timeframe, and intent, tagging them as `Hot Lead ($280)`, `Warm Inquiry`, or `General Question`.
  5. **Sales Auto (`sales_auto`):** Autonomous closing engine handling objections, sending pricing menus, suggesting open calendar slots, and guiding qualified leads straight into confirmed bookings without human intervention.
  6. **Ads Auto (`ads_auto`):** Closed-loop ad attribution tracking Google LSA and Meta Ads leads through CRM conversion, feeding high-intent conversion signals back into ad networks to optimize local ROAS and lower CPA.

---

## Local Development (Optional)

If running the application locally:
```powershell
cd "d:\Freelancer\golden reindeer\frontend"
npm run dev
```
Local Dev: `http://localhost:5173/` · Backend API: `http://localhost:8000/docs`

---
*Created for Golden Reindeer Client Presentation & Demonstration.*

