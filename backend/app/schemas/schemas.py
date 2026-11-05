from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AuditRequest(BaseModel):
    business_name: str
    phone: str
    place_id: Optional[str] = None

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

class AutomationToggle(BaseModel):
    key: str
    enabled: bool
    config: Optional[Dict[str, Any]] = None

class ReviewReplyRequest(BaseModel):
    reply_text: str
    post_now: bool = False
