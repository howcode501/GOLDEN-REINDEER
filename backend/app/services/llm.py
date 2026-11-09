import logging
from typing import Optional, List, Dict, Any
from ..core.config import settings

logger = logging.getLogger("golden_reindeer.llm")

async def complete(system: str, messages: List[Dict[str, str]], max_tokens: int = 600) -> str:
    """
    Calls Anthropic Claude with the provided system prompt and message history.
    If the API key is not configured or fails, falls back gracefully to context-aware mock AI responses.
    """
    api_key = settings.anthropic_api_key
    if api_key and not api_key.startswith("mock_") and len(api_key) > 10:
        try:
            from anthropic import AsyncAnthropic
            client = AsyncAnthropic(api_key=api_key)
            resp = await client.messages.create(
                model=settings.llm_model,
                system=system,
                messages=messages,
                max_tokens=max_tokens,
            )
            return "".join(b.text for b in resp.content if b.type == "text")
        except Exception as e:
            logger.warning(f"Anthropic API call failed: {e}. Falling back to simulation.")

    # Context-aware intelligent fallback responses for local dev / offline demo
    last_msg = messages[-1]["content"].lower() if messages else ""

    if "bridal" in last_msg or "price" in last_msg or "package" in last_msg:
        return "Hello! We offer comprehensive packages starting at ₹8,500 using premium international products. Would you like me to book a consultation slot or share our service catalog?"
    elif "book" in last_msg or "appointment" in last_msg or "tomorrow" in last_msg:
        return "I'd be delighted to reserve that for you! Could you confirm your preferred time slot? We have availability at 2:00 PM and 4:30 PM tomorrow."
    elif "where" in last_msg or "address" in last_msg or "location" in last_msg:
        return "We are located in Sector 30A, Vashi, Navi Mumbai. We're open from 10:00 AM to 8:30 PM every day. Shall I send our Google Maps directions?"
    else:
        return "Thank you for reaching out to us! How can our team help elevate your experience today? Feel free to ask about our services, pricing, or appointment availability."

async def generate_campaign_copy(business_name: str, vertical: str, goal: str, offer_details: Optional[str] = None) -> Dict[str, str]:
    """Generates localized marketing campaign creative (WhatsApp copy, CTA, offer structure)."""
    offer = offer_details or "Flat 25% Off + Complimentary Service"
    prompt = f"Create a compelling, high-converting WhatsApp marketing campaign for {business_name} ({vertical}). Goal: {goal}. Offer: {offer}."
    
    system = "You are an elite small business direct-response copywriter specializing in WhatsApp marketing."
    messages = [{"role": "user", "content": prompt}]
    
    # Check if we should call live LLM
    if settings.anthropic_api_key and not settings.anthropic_api_key.startswith("mock_"):
        try:
            text = await complete(system, messages, max_tokens=300)
            return {
                "headline": f"{business_name} Exclusive Invitation",
                "body": text,
                "cta": "Reply YES to claim this VIP offer today!",
            }
        except Exception:
            pass

    return {
        "headline": f"✨ Exclusive Seasonal Privilege at {business_name}",
        "body": f"Hi {{name}}! To thank you for choosing {business_name}, we've reserved an exclusive gift for you: {offer}. Valid for the next 7 days only.",
        "cta": "Reply BOOK to reserve your preferred slot or view details.",
    }

async def generate_review_reply(business_name: str, author: str, rating: int, review_text: str, service_keyword: Optional[str] = None) -> str:
    """Generates an authentic, SEO-rich response to a customer review that reinforces Google ranking signals."""
    kw = service_keyword or "our personalized services"
    if rating >= 4:
        return (
            f"Dear {author}, thank you so much for your wonderful {rating}-star review! "
            f"The team at {business_name} is thrilled that you enjoyed {kw}. "
            "We look forward to welcoming you back soon!"
        )
    else:
        return (
            f"Dear {author}, thank you for your feedback. At {business_name}, we hold our standards to the highest level. "
            f"We are sorry your experience did not meet expectations. Please reach out to our management directly at our desk "
            "so we can make this right for you immediately."
        )
