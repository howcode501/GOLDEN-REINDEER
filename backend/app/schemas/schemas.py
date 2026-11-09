from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Booster & Audit ---
class AuditRequest(BaseModel):
    business_name: str
    phone: str
    place_id: Optional[str] = None

class FreeSiteCreate(BaseModel):
    place_id: str
    business_name: str
    phone: Optional[str] = None

# --- Contacts & CRM ---
class ContactCreate(BaseModel):
    name: Optional[str] = None
    phone: str
    stage: str = "lead"
    source: Optional[str] = "manual"
    opted_in: bool = False
    tags: List[str] = []

class PurchaseCreate(BaseModel):
    contact_id: str
    item: str
    amount: float

# --- Conversations & Inbox ---
class MessageSend(BaseModel):
    conversation_id: str
    body: str
    sender: str = "human"

class TakeoverRequest(BaseModel):
    status: str = "human"  # "human" or "bot"

# --- Knowledge Docs ---
class KnowledgeDocCreate(BaseModel):
    kind: str  # service, price, faq, testimonial, policy, hours
    title: str
    content: str

# --- Appointments ---
class AppointmentCreate(BaseModel):
    contact_id: str
    service: Optional[str] = None
    starts_at: datetime

# --- Campaigns & Marketing ---
class CampaignCreate(BaseModel):
    name: str
    goal: Optional[str] = "festive_offer"
    target_vertical: Optional[str] = None
    custom_offer: Optional[str] = None

class SegmentPreviewRequest(BaseModel):
    inactive_days: int = 30
    min_ltv: float = 0.0
    require_opted_in: bool = True

# --- Google Business Profile ---
class KeywordGenerateRequest(BaseModel):
    business_name: str
    vertical: str
    city: str

class ProfileRewriteRequest(BaseModel):
    current_description: Optional[str] = None
    keywords: List[str] = []

class GBPPostCreate(BaseModel):
    body: str
    keyword: Optional[str] = None
    publish_at: Optional[datetime] = None

# --- Reviews ---
class ReviewReplyRequest(BaseModel):
    reply_text: str
    post_now: bool = False

class ReviewGenerateDraftRequest(BaseModel):
    rating: int
    review_text: str
    author: Optional[str] = "Customer"
    service_keyword: Optional[str] = None

# --- Automation Store ---
class AutomationToggle(BaseModel):
    key: str
    enabled: bool
    config: Optional[Dict[str, Any]] = None

# --- Onboarding ---
class OnboardingRequest(BaseModel):
    business_name: str
    vertical: str = "salon"
    phone: Optional[str] = None
    google_place_id: Optional[str] = None
    plan: str = "free"
