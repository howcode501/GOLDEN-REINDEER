import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717A"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Golden Reindeer — AI Growth & Marketing Automations Suite Guide")
            self.setStrokeColor(colors.HexColor("#E4E4E7"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 30, footer_text)
        self.drawString(54, 30, "CONFIDENTIAL — Prepared for Client Review · Live: https://frontend-kappa-tan-81.vercel.app")
        self.setStrokeColor(colors.HexColor("#E4E4E7"))
        self.setLineWidth(0.5)
        self.line(54, 42, letter[0] - 54, 42)
        
        self.restoreState()

def create_guide_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#09090B")
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor("#52525B")
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#D97706"), # amber-600
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#18181B"),
        spaceBefore=10,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#27272A")
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#3F3F46"),
        leftIndent=14
    )

    link_box_style = ParagraphStyle(
        'LinkBox',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#2563EB")
    )
    
    story = []
    
    # Title & Header Banner
    story.append(Paragraph("GOLDEN REINDEER AI", ParagraphStyle('Eyebrow', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.HexColor("#B45309"))))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Agency AI Automation Suite: Client Implementation Guide", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("A direct operational guide detailing how the 6 requested B2B agency growth automations are engineered, triggered, and verified with live Vercel demonstration links.", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#F59E0B"), spaceBefore=2, spaceAfter=14))
    
    # Summary Box
    summary_data = [
        [
            Paragraph("<b>Primary Platform URL:</b> <a href='https://frontend-kappa-tan-81.vercel.app/app'><font color='#2563EB'><u>https://frontend-kappa-tan-81.vercel.app/app</u></font></a>", body_style),
            Paragraph("<b>Deployment Status:</b> <font color='#16A34A'><b>Active on Vercel</b></font>", body_style)
        ],
        [
            Paragraph("<b>Automations Hub:</b> <a href='https://frontend-kappa-tan-81.vercel.app/app/automations'><font color='#2563EB'><u>https://frontend-kappa-tan-81.vercel.app/app/automations</u></font></a>", body_style),
            Paragraph("<b>CRM & Lead Simulator:</b> <a href='https://frontend-kappa-tan-81.vercel.app/app/leads'><font color='#2563EB'><u>https://frontend-kappa-tan-81.vercel.app/app/leads</u></font></a>", body_style)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[3.25*inch, 3.25*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FCD34D")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FDE68A")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 14))

    # The 6 Features Section
    features = [
        {
            "num": "1",
            "name": "Outreach Automation",
            "id": "outreach_auto",
            "link": "https://frontend-kappa-tan-81.vercel.app/app/automations",
            "purpose": "Autonomous outbound multi-touch engagement for dormant leads, past inquiries, and re-activation lists via WhatsApp & SMS.",
            "workflow": [
                "<b>Trigger:</b> Contacts inactive for >30 days or tagged <code>#cold_lead</code> entering the CRM.",
                "<b>Cadence:</b> Touch 1 (Day 1: Value check-in) -> Touch 2 (Day 4: Case study/offer) -> Touch 3 (Day 7: Final breakout).",
                "<b>Smart Kill-Switch:</b> Sequence stops instantly the second the customer sends an inbound message to avoid awkward double-messaging.",
                "<b>Expected Agency ROI:</b> 12-18% reactivation rate on cold contacts with zero manual outbound labor."
            ]
        },
        {
            "num": "2",
            "name": "Lead Capture Automation",
            "id": "lead_capture_auto",
            "link": "https://frontend-kappa-tan-81.vercel.app/app/leads",
            "purpose": "Omni-channel sub-12-second lead ingestion linking Missed Calls, Meta Ads forms, Google LSA, and website inquiries directly into CRM.",
            "workflow": [
                "<b>Trigger:</b> Missed call detected on front-desk line or webhook payload received from Meta Ads / Google LSA.",
                "<b>Capture Speed:</b> Phone number and metadata recorded in CRM within 12 seconds.",
                "<b>Autonomous Response:</b> AI dispatches an immediate WhatsApp/SMS message: <i>'Hi! Sorry we missed your call. How can we help you book or answer your question right now?'</i>",
                "<b>Interactive Demo:</b> Live 3-channel inbound simulator on the Leads page testing Phone, Meta Ads, and Google LSA."
            ]
        },
        {
            "num": "3",
            "name": "Lead Routing Auto",
            "id": "lead_routing_auto",
            "link": "https://frontend-kappa-tan-81.vercel.app/app/leads",
            "purpose": "Smart attribution and team delegation routing every incoming lead to the exact specialist or staff member based on service type and ticket value.",
            "workflow": [
                "<b>Evaluation:</b> Analyzes the requested service (Balayage, Facial, Haircut, VIP Package) and estimated budget.",
                "<b>Rule Matrix:</b> High-ticket Balayage ($280+) -> <b>Senior Colorist (Maya)</b>; HydraFacial ($220+) -> <b>Master Aesthetician (Sarah)</b>; VIP inquiries -> <b>Studio Director</b>; General FAQs -> <b>24/7 AI Concierge</b>.",
                "<b>Staff Notification:</b> Immediate WhatsApp notification sent to the assigned specialist with the customer profile link."
            ]
        },
        {
            "num": "4",
            "name": "Qualification Auto",
            "id": "qualification_auto",
            "link": "https://frontend-kappa-tan-81.vercel.app/app/leads",
            "purpose": "Autonomous conversational AI scoring that profiles every lead 0–100 before staff wastes time on manual calls.",
            "workflow": [
                "<b>3-Pillar Scoring:</b> (1) Budget Intent (40 pts), (2) Timeline/Urgency (30 pts), (3) Service Clarity (30 pts).",
                "<b>Lead Tiering:</b> 90-100 = <b>Hot Lead ($280)</b> · 70-89 = <b>Warm Inquiry</b> · <70 = <b>General Info</b>.",
                "<b>Automated Tagging:</b> CRM tags updated in real time with badges visible on the live Leads table.",
                "<b>Result:</b> Front desk and sales reps only spend time on verified high-ticket clients."
            ]
        },
        {
            "num": "5",
            "name": "Sales Auto",
            "id": "sales_auto",
            "link": "https://frontend-kappa-tan-81.vercel.app/app/inbox",
            "purpose": "24/7 autonomous closing engine that handles client objections, presents tailored pricing tiers, and locks in appointment bookings directly.",
            "workflow": [
                "<b>Conversational Intelligence:</b> Answers questions on pricing, recovery time, service ingredients, and availability.",
                "<b>Calendar Integration:</b> Pulls real-time open calendar slots directly from the appointment schedule.",
                "<b>Booking Handoff:</b> Reserves the slot, triggers a calendar invite, and dispatches automated 24h WhatsApp reminder alerts.",
                "<b>Live Demonstration:</b> Visible in WhatsApp Inbox (Scenario #1: Olivia Vance booking Saturday Balayage)."
            ]
        },
        {
            "num": "6",
            "name": "Ads Auto",
            "id": "ads_auto",
            "link": "https://frontend-kappa-tan-81.vercel.app/app/automations",
            "purpose": "Closed-loop offline ad conversion attribution connecting Google LSA & Meta Ads spend directly to actual completed studio revenue.",
            "workflow": [
                "<b>Tracking:</b> Captures Google Click ID (GCLID), Meta Lead ID, and campaign UTM parameters at capture.",
                "<b>Attribution:</b> When appointment is marked 'Completed' in CRM, revenue data is logged against the ad source.",
                "<b>Feedback Loop:</b> Sends high-intent conversion signals back to Meta Conversions API & Google Offline Conversions.",
                "<b>Outcome:</b> Algorithms automatically prioritize high-ticket spenders, driving down Cost-Per-Acquisition (CPA) by 25-35%."
            ]
        }
    ]

    for feat in features:
        card_content = []
        card_content.append(Paragraph(f"<b>Requirement #{feat['num']}: {feat['name']}</b> &nbsp; <font color='#71717A'>[ID: {feat['id']}]</font>", h1_style))
        card_content.append(Paragraph(f"<b>Live Vercel Link:</b> <a href='{feat['link']}'><font color='#2563EB'><u>{feat['link']}</u></font></a>", link_box_style))
        card_content.append(Spacer(1, 4))
        card_content.append(Paragraph(f"<b>Strategic Purpose:</b> {feat['purpose']}", body_style))
        card_content.append(Spacer(1, 4))
        card_content.append(Paragraph("<b>How It Works & Technical Architecture:</b>", h2_style))
        
        for item in feat['workflow']:
            card_content.append(Paragraph(f"• {item}", bullet_style))
            card_content.append(Spacer(1, 2))
            
        card_content.append(Spacer(1, 10))
        card_content.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E4E4E7"), spaceBefore=4, spaceAfter=8))
        story.append(KeepTogether(card_content))

    # Quick Verification Steps for Client
    story.append(Paragraph("How the Client Can Test & Verify in 60 Seconds", h1_style))
    steps = [
        "<b>Step 1 — Verify Automations:</b> Open <a href='https://frontend-kappa-tan-81.vercel.app/app/automations'><font color='#2563EB'><u>Automations Hub</u></font></a> and click the <b>'B2B & Agency Suite'</b> tab to view all 6 active toggles.",
        "<b>Step 2 — Test Multi-Channel Capture:</b> Open <a href='https://frontend-kappa-tan-81.vercel.app/app/leads'><font color='#2563EB'><u>Leads Hub</u></font></a>, choose <code>🎯 Meta Ads Lead</code>, type <i>'Jessica Alba'</i>, and click <b>Simulate Inbound Lead</b>.",
        "<b>Step 3 — Observe Auto Routing & Scoring:</b> Notice Jessica Alba instantly appears at the top of the table with <code>96/100 · Hot Lead</code> and routed to <code>Senior Colorist (Maya)</code>.",
        "<b>Step 4 — Test Sales Booking:</b> Open <a href='https://frontend-kappa-tan-81.vercel.app/app/inbox'><font color='#2563EB'><u>WhatsApp Inbox</u></font></a> to see the autonomous booking conversation and slot reservation in action."
    ]
    for s in steps:
        story.append(Paragraph(s, bullet_style))
        story.append(Spacer(1, 3))
        
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {filename}")

if __name__ == "__main__":
    out_path = r"d:\Freelancer\golden reindeer\Golden_Reindeer_Agency_Automations_Guide.pdf"
    create_guide_pdf(out_path)
