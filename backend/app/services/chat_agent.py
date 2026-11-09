import logging
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.db import SessionLocal
from ..models.entities import Contact, Conversation, Message, KnowledgeDoc, Purchase, Business, Appointment
from .flywheel import emit
from .llm import complete

logger = logging.getLogger("golden_reindeer.chat_agent")

async def handle_inbound(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Processes incoming WhatsApp Cloud API messages or simulated inbound queries.
    1. Extracts customer phone, message text, and WhatsApp message ID.
    2. Identifies or resolves the tenant business.
    3. Handles idempotency (rejects duplicate wa_message_id).
    4. Upserts Contact & Conversation in the Shared Brain.
    5. Ingests knowledge_docs and past purchase history into LLM context.
    6. Formulates grounded response and records outgoing message.
    """
    async with SessionLocal() as db:
        try:
            # Parse Meta Cloud API payload or standard simplified dictionary
            entry = payload.get("entry", [{}])[0]
            changes = entry.get("changes", [{}])[0]
            value = changes.get("value", {})
            messages = value.get("messages", [])
            
            if not messages:
                # Handle test/direct simulation payload format
<<<<<<< HEAD
                customer_phone = payload.get("phone", "+12125550199")
=======
                customer_phone = payload.get("phone", "+919800000000")
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
                customer_name = payload.get("name", "Inbound Customer")
                msg_body = payload.get("message", "Hello, do you have any appointments available?")
                wa_msg_id = payload.get("wa_message_id", f"msg_{datetime.utcnow().timestamp()}")
                business_phone_id = payload.get("whatsapp_phone_number_id")
            else:
                raw_msg = messages[0]
                customer_phone = raw_msg.get("from")
                customer_name = value.get("contacts", [{}])[0].get("profile", {}).get("name", "Customer")
                msg_body = raw_msg.get("text", {}).get("body", "")
                wa_msg_id = raw_msg.get("id")
                business_phone_id = value.get("metadata", {}).get("phone_number_id")

            # 1. Resolve business
            b_stmt = select(Business)
            if business_phone_id:
                b_stmt = b_stmt.where(Business.whatsapp_phone_number_id == business_phone_id)
            b_res = await db.execute(b_stmt)
            business = b_res.scalars().first()
            if not business:
                # Fallback to default demo business
                b_res = await db.execute(select(Business).limit(1))
                business = b_res.scalars().first()
                if not business:
<<<<<<< HEAD
                    business = Business(name="Glow & Grace Studio", vertical="salon")
=======
                    business = Business(name="Golden Salon & Clinic", vertical="salon")
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
                    db.add(business)
                    await db.commit()
                    await db.refresh(business)

            # 2. Idempotency Check
            if wa_msg_id:
                dup_stmt = select(Message).where(Message.wa_message_id == wa_msg_id)
                dup = (await db.execute(dup_stmt)).scalar_one_or_none()
                if dup:
                    logger.info(f"Duplicate WhatsApp message ignored: {wa_msg_id}")
                    return {"status": "ignored", "reason": "duplicate_id"}

            # 3. Upsert Contact
            c_stmt = select(Contact).where(
                Contact.business_id == business.id,
                Contact.phone == customer_phone
            )
            contact = (await db.execute(c_stmt)).scalar_one_or_none()
            is_new_lead = False
            if not contact:
                contact = Contact(
                    business_id=business.id,
                    name=customer_name,
                    phone=customer_phone,
                    stage="lead",
                    source="whatsapp",
                    opted_in=True,
                    opted_in_at=datetime.utcnow(),
                    tags=["whatsapp_lead"],
                )
                db.add(contact)
                await db.commit()
                await db.refresh(contact)
                is_new_lead = True
                await emit(db, business.id, contact.id, "lead.captured", {"phone": customer_phone, "source": "whatsapp"})

            # 4. Upsert Conversation
            conv_stmt = select(Conversation).where(
                Conversation.business_id == business.id,
                Conversation.contact_id == contact.id
            )
            conv = (await db.execute(conv_stmt)).scalar_one_or_none()
            if not conv:
                conv = Conversation(
                    business_id=business.id,
                    contact_id=contact.id,
                    status="bot",
                    last_inbound_at=datetime.utcnow(),
                )
                db.add(conv)
                await db.commit()
                await db.refresh(conv)
            else:
                conv.last_inbound_at = datetime.utcnow()
                await db.commit()

            # Record Inbound Message
            in_msg = Message(
                conversation_id=conv.id,
                business_id=business.id,
                direction="in",
                sender="customer",
                body=msg_body,
                wa_message_id=wa_msg_id,
                created_at=datetime.utcnow(),
            )
            db.add(in_msg)
            await db.commit()

            # 5. Check Human Takeover
            if conv.status == "human":
                logger.info(f"Human operator is managing conversation {conv.id}. Bot silent.")
                return {"status": "human_mode"}

<<<<<<< HEAD
            # 6. Smart Review Gating & Chat Mining
            # Detect review rating responses (e.g. "5", "5 stars", "4", "Loved it 5/5")
            trimmed_msg = msg_body.strip().lower()
            is_rating = any(trimmed_msg.startswith(num) for num in ["5", "4", "3", "2", "1"]) or "star" in trimmed_msg or "rate" in trimmed_msg
            
            if is_rating and ("5" in trimmed_msg or "loved" in trimmed_msg or "great" in trimmed_msg):
                # 5-Star Promoter -> Send direct 1-tap Google Review link
                review_link = f"https://search.google.com/local/writereview?placeid={business.google_place_id or 'ChIJ123_glow_grace'}"
                reply_text = f"🌟 We're so thrilled to hear that, {contact.name or 'there'}! Would you mind taking 30 seconds to share your experience on our official Google Maps profile? It helps our small team immensely:\n\n👉 {review_link}\n\nThank you so much!"
                
                out_msg = Message(
                    conversation_id=conv.id,
                    business_id=business.id,
                    direction="out",
                    sender="bot",
                    body=reply_text,
                    created_at=datetime.utcnow(),
                )
                db.add(out_msg)
                await db.commit()
                await emit(db, business.id, contact.id, "review.funneled_to_google", {"rating": 5})
                return {"status": "promoter_routed_to_google", "reply": reply_text}
                
            elif is_rating and any(low in trimmed_msg for low in ["1", "2", "3", "bad", "poor", "unhappy"]):
                # 1-3 Stars Detractor -> Route privately to business owner / human takeover
                reply_text = f"We are truly sorry your experience didn't meet your expectations today. We value your feedback and our management would love to resolve this personally. What could we have done better?"
                conv.status = "human"  # Switch to operator takeover
                out_msg = Message(
                    conversation_id=conv.id,
                    business_id=business.id,
                    direction="out",
                    sender="bot",
                    body=reply_text,
                    created_at=datetime.utcnow(),
                )
                db.add(out_msg)
                await db.commit()
                await emit(db, business.id, contact.id, "feedback.private_escalation", {"rating": "low_sentiment", "reason": msg_body})
                return {"status": "detractor_saved_privately", "reply": reply_text}

=======
            # 6. Chat Mining: Detect Price / Booking High Intent
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
            hot_keywords = ["price", "cost", "rate", "fee", "package", "book", "appointment", "slot", "today", "tomorrow"]
            if any(kw in msg_body.lower() for kw in hot_keywords):
                await emit(db, business.id, contact.id, "lead.hot", {"trigger_text": msg_body})

            # 7. Build Grounded LLM Context
            kd_stmt = select(KnowledgeDoc).where(KnowledgeDoc.business_id == business.id)
            docs = (await db.execute(kd_stmt)).scalars().all()
<<<<<<< HEAD

=======
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
            doc_context = "\n".join([f"- [{d.kind.upper()}] {d.title}: {d.content}" for d in docs]) or "Standard boutique services and appointments available on request."

            p_stmt = select(Purchase).where(Purchase.contact_id == contact.id).order_by(Purchase.purchased_at.desc()).limit(3)
            purchases = (await db.execute(p_stmt)).scalars().all()
<<<<<<< HEAD
            purchase_context = ", ".join([f"{p.item} (${p.amount})" for p in purchases]) or "First-time visitor / no past purchases"
=======
            purchase_context = ", ".join([f"{p.item} (₹{p.amount})" for p in purchases]) or "First-time visitor / no past purchases"
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)

            system_prompt = f"""You are the friendly, professional WhatsApp AI assistant for {business.name}, a premier {business.vertical}.
Answer ONLY from the official business knowledge below. If something is not covered, offer to connect them with the front desk team.
Be concise, welcoming, and aim to help the customer book an appointment or visit. Quote exact prices from knowledge.

BUSINESS KNOWLEDGE:
{doc_context}

CUSTOMER HISTORY:
Name: {contact.name or 'Valued Customer'}
Past Purchases: {purchase_context}
"""

            # 8. Generate and Record Bot Response
            reply_text = await complete(system_prompt, [{"role": "user", "content": msg_body}])

            out_msg = Message(
                conversation_id=conv.id,
                business_id=business.id,
                direction="out",
                sender="bot",
                body=reply_text,
                created_at=datetime.utcnow(),
            )
            db.add(out_msg)
            await db.commit()
            await emit(db, business.id, contact.id, "chat.replied", {"conversation_id": conv.id})

            return {
                "status": "success",
                "conversation_id": conv.id,
                "reply": reply_text,
            }

        except Exception as e:
            logger.error(f"Error handling WhatsApp inbound: {e}", exc_info=True)
            return {"status": "error", "error": str(e)}
