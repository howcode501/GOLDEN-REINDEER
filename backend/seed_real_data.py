import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy import select, delete
from app.core.db import SessionLocal
from app.models.entities import Business, Contact, Conversation, Message, Purchase, Review

async def seed():
    async with SessionLocal() as db:
        print("[SEED] Seeding realistic American/English business, contacts, conversations, and reports data...")

        # 1. Ensure business exists
        b_stmt = select(Business).where(Business.id == "00000000-0000-0000-0000-000000000001")
        business = (await db.execute(b_stmt)).scalar_one_or_none()
        if not business:
            business = Business(
                id="00000000-0000-0000-0000-000000000001",
                name="Glow & Grace Studio",
                vertical="salon",
                phone="+1 (212) 555-0100",
                plan="ai_team",
                google_place_id="ChIJ123_glow_grace",
            )
            db.add(business)
            await db.commit()
            print("✓ Created Business: Glow & Grace Studio")
        else:
            business.name = "Glow & Grace Studio"
            business.phone = "+1 (212) 555-0100"
            await db.commit()

        # Clean existing test messages & conversations for a clean fresh slate
        await db.execute(delete(Message).where(Message.business_id == business.id))
        await db.execute(delete(Conversation).where(Conversation.business_id == business.id))
        await db.execute(delete(Purchase).where(Purchase.business_id == business.id))
        await db.execute(delete(Contact).where(Contact.business_id == business.id))
        await db.execute(delete(Review).where(Review.business_id == business.id))
        await db.commit()

        now = datetime.utcnow()

        # 2. Contacts (5 distinct profiles)
        contacts_data = [
            {
                "id": str(uuid.uuid4()),
                "name": "Olivia Vance",
                "phone": "+1 (212) 555-0142",
                "stage": "lead",
                "source": "whatsapp",
                "opted_in": True,
                "tags": ["hot_lead", "hydra_facial", "ready_to_book"],
                "lifetime_value": 0.00,
            },
            {
                "id": str(uuid.uuid4()),
                "name": "James Thornton",
                "phone": "+1 (646) 555-0188",
                "stage": "customer",
                "source": "google",
                "opted_in": True,
                "tags": ["promoter_5star", "vip_client", "haircut"],
                "lifetime_value": 120.00,
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Sophia Martinez",
                "phone": "+1 (917) 555-0133",
                "stage": "customer",
                "source": "whatsapp",
                "opted_in": True,
                "tags": ["escalation", "support_needed", "detractor_intercepted"],
                "lifetime_value": 180.00,
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Ethan Campbell",
                "phone": "+1 (202) 555-0174",
                "stage": "customer",
                "source": "campaign",
                "opted_in": True,
                "tags": ["campaign_lead", "balayage", "winback"],
                "lifetime_value": 240.00,
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Emma Richardson",
                "phone": "+1 (718) 555-0195",
                "stage": "lead",
                "source": "google",
                "opted_in": True,
                "tags": ["inquiry", "scalp_detox", "first_time"],
                "lifetime_value": 0.00,
            },
        ]

        contacts_map = {}
        for c in contacts_data:
            contact = Contact(
                id=c["id"],
                business_id=business.id,
                name=c["name"],
                phone=c["phone"],
                stage=c["stage"],
                source=c["source"],
                opted_in=c["opted_in"],
                opted_in_at=now - timedelta(days=2),
                tags=c["tags"],
                lifetime_value=c["lifetime_value"],
                created_at=now - timedelta(days=2),
            )
            db.add(contact)
            contacts_map[c["name"]] = contact

        await db.commit()
        print("Done: Created 5 Realistic Contacts")

        # 3. Purchases for customers
        purchases = [
            Purchase(
                business_id=business.id,
                contact_id=contacts_map["James Thornton"].id,
                item="Men's Executive Haircut & Scalp Treatment",
                amount=120.00,
                purchased_at=now - timedelta(hours=3),
            ),
            Purchase(
                business_id=business.id,
                contact_id=contacts_map["Sophia Martinez"].id,
                item="Signature Hydra-Facial Treatment",
                amount=180.00,
                purchased_at=now - timedelta(hours=5),
            ),
            Purchase(
                business_id=business.id,
                contact_id=contacts_map["Ethan Campbell"].id,
                item="Balayage Color & Restorative Gloss",
                amount=240.00,
                purchased_at=now - timedelta(days=14),
            ),
        ]
        db.add_all(purchases)
        await db.commit()
        print("Done: Created Customer Purchases (USD $)")

        # 4. Conversations & Message Threads (5 Distinct Types)
        threads = [
            # Type 1: Hot Lead - Appointment Booking
            {
                "contact": "Olivia Vance",
                "status": "bot",
                "time_offset": timedelta(minutes=12),
                "messages": [
                    {"direction": "in", "sender": "customer", "offset": 15, "body": "Hi! What is the price for the Hydra-Facial Deluxe treatment?"},
                    {"direction": "out", "sender": "bot", "offset": 14, "body": "Hello Olivia! Our Hydra-Facial Deluxe is $145 and includes deep pore cleansing, hyaluronic acid infusion, and restorative LED light therapy. Would you like to check open appointment slots for this week?"},
                    {"direction": "in", "sender": "customer", "offset": 8, "body": "Yes please! Do you have any openings this Friday afternoon?"},
                    {"direction": "out", "sender": "bot", "offset": 7, "body": "We have an open slot this Friday at 3:30 PM with our senior aesthetician Chloe. Would you like me to lock that in for you?"},
                    {"direction": "in", "sender": "customer", "offset": 3, "body": "Yes, 3:30 PM works great! Book me in."},
                    {"direction": "out", "sender": "bot", "offset": 2, "body": "Perfect! I have reserved your Hydra-Facial Deluxe for Friday at 3:30 PM. A calendar confirmation has been sent to your phone. See you then!"},
                ]
            },
            # Type 2: 5-Star Google Review Gate - Routed to Google Maps
            {
                "contact": "James Thornton",
                "status": "bot",
                "time_offset": timedelta(minutes=45),
                "messages": [
                    {"direction": "out", "sender": "bot", "offset": 60, "body": "Hi James! Thank you for visiting Glow & Grace Studio today. On a scale of 1 to 5, how was your haircut experience with Marcus?"},
                    {"direction": "in", "sender": "customer", "offset": 50, "body": "5 stars without a doubt! Marcus is the best stylist in Manhattan."},
                    {"direction": "out", "sender": "bot", "offset": 48, "body": "We are so thrilled to hear that, James! Could you do us a quick 30-second favor and share your feedback directly on our official Google Business Profile? It helps our small team immensely:\n\nhttps://search.google.com/local/writereview?placeid=ChIJ123_glow_grace\n\nThank you so much!"},
                    {"direction": "in", "sender": "customer", "offset": 45, "body": "Done! Just posted the 5-star review on Google Maps. Keep up the great work."},
                ]
            },
            # Type 3: Negative Review Intercepted Privately - Human Takeover Escalation
            {
                "contact": "Sophia Martinez",
                "status": "human",
                "time_offset": timedelta(minutes=25),
                "messages": [
                    {"direction": "out", "sender": "bot", "offset": 40, "body": "Hi Sophia! Thank you for visiting us for your Hydra-Facial today. How was your experience?"},
                    {"direction": "in", "sender": "customer", "offset": 35, "body": "Honestly, 1 star. I had a 2:00 PM booking and sat waiting 25 minutes past my slot time without anyone checking on me."},
                    {"direction": "out", "sender": "bot", "offset": 34, "body": "We are truly sorry your experience was not completely seamless today, Sophia. Your feedback has been forwarded directly to our studio director. One of our senior managers has taken over this chat to make this right personally."},
                    {"direction": "out", "sender": "human", "offset": 25, "body": "Hi Sophia, this is Sarah, the Studio Director. I sincerely apologize for the delay this afternoon. I have credited a $40 privilege voucher to your profile and would love to personally oversee your next visit."},
                ]
            },
            # Type 4: Re-engagement & Festive Privilege Campaign
            {
                "contact": "Ethan Campbell",
                "status": "bot",
                "time_offset": timedelta(hours=2),
                "messages": [
                    {"direction": "out", "sender": "campaign", "offset": 180, "body": "Hey Ethan! As a privileged Glow & Grace Studio guest, enjoy $35 off any balayage or restorative color treatment this weekend. Reply YES to reserve your slot!"},
                    {"direction": "in", "sender": "customer", "offset": 140, "body": "Hey! Can I use this code for Saturday morning around 11 AM?"},
                    {"direction": "out", "sender": "bot", "offset": 138, "body": "Hi Ethan! Yes, absolutely. We have an 11:15 AM balayage slot available this Saturday with senior colorist David. Would that time suit you?"},
                    {"direction": "in", "sender": "customer", "offset": 125, "body": "11:15 AM is perfect. Please reserve it."},
                    {"direction": "out", "sender": "bot", "offset": 120, "body": "All set! Reserved for Saturday at 11:15 AM with $35 privilege discount applied. Looking forward to having you!"},
                ]
            },
            # Type 5: Service & Pricing Inquiry
            {
                "contact": "Emma Richardson",
                "status": "bot",
                "time_offset": timedelta(hours=4),
                "messages": [
                    {"direction": "in", "sender": "customer", "offset": 260, "body": "Hello, do you offer organic scalp detox treatments and how much does it cost?"},
                    {"direction": "out", "sender": "bot", "offset": 258, "body": "Hi Emma! Yes, our Japanese Botanical Scalp Detox is $65. It includes organic essential oils, steam therapy, and tension relief massage (45 mins). Would you like to view our available weekday slots?"},
                    {"direction": "in", "sender": "customer", "offset": 245, "body": "That sounds lovely, I will check my schedule and message you back shortly."},
                    {"direction": "out", "sender": "bot", "offset": 242, "body": "Sounds wonderful! Feel free to reach out anytime. Have a beautiful day!"},
                ]
            },
        ]

        for th in threads:
            c = contacts_map[th["contact"]]
            conv = Conversation(
                id=str(uuid.uuid4()),
                business_id=business.id,
                contact_id=c.id,
                status=th["status"],
                last_inbound_at=now - th["time_offset"],
                created_at=now - timedelta(days=1),
            )
            db.add(conv)
            await db.commit()
            await db.refresh(conv)

            for m in th["messages"]:
                msg = Message(
                    id=str(uuid.uuid4()),
                    conversation_id=conv.id,
                    business_id=business.id,
                    direction=m["direction"],
                    sender=m["sender"],
                    body=m["body"],
                    wa_message_id=f"wa_msg_{uuid.uuid4().hex[:12]}",
                    created_at=now - timedelta(minutes=m["offset"]),
                )
                db.add(msg)

        await db.commit()
        print("Done: Created 5 Distinct Conversation Threads with Full Histories")

        # 5. Reviews
        revs = [
            Review(
                business_id=business.id,
                google_review_id="rev_001",
                author="Emily Watson",
                rating=5,
                text="Best hydra-facial experience in Manhattan! The staff was attentive and the results were incredible.",
                reply_text="Thank you Emily! We are thrilled you loved your hydra-facial session with us at Glow & Grace Studio.",
                reply_status="posted",
                created_at=now - timedelta(days=3),
            ),
            Review(
                business_id=business.id,
                google_review_id="rev_002",
                author="Michael Miller",
                rating=5,
                text="Great haircut and scalp treatment, very clean studio and relaxing vibe.",
                reply_text="Dear Michael, thank you for your feedback! We appreciate having you with us and look forward to your next visit.",
                reply_status="draft",
                created_at=now - timedelta(days=1),
            ),
            Review(
                business_id=business.id,
                google_review_id="rev_003",
                author="Sarah Jenkins",
                rating=5,
                text="Highly recommend their bridal hair and styling packages. Top-notch service!",
                reply_text=None,
                reply_status="none",
                created_at=now - timedelta(hours=8),
            ),
        ]
        db.add_all(revs)
        await db.commit()
        print("Done: Created 3 Google Reviews")

        print("Done: All Seeding Completed Successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
