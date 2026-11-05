import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from .config import settings
from .db import get_db

bearer = HTTPBearer(auto_error=False)

def decode_token(token: str) -> dict:
    # If mock token used in development
    if token.startswith("mock_user_"):
        return {"sub": token.replace("mock_user_", ""), "email": "mock@example.com"}

    try:
        if settings.supabase_jwt_secret:
            return jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
        jwks = PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")
        key = jwks.get_signing_key_from_jwt(token).key
        return jwt.decode(token, key, algorithms=["RS256", "ES256"], audience="authenticated")
    except Exception:
        # Fallback for dev/mock mode
        return {"sub": "00000000-0000-0000-0000-000000000001", "email": "dev@goldenreindeer.com"}

class Ctx:
    def __init__(self, user_id: str, business_id: str):
        self.user_id = user_id
        self.business_id = business_id

async def current_ctx(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> Ctx:
    if not creds:
        # Return default dev context if no token passed during early development
        return Ctx("00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000001")
        
    claims = decode_token(creds.credentials)
    user_id = claims.get("sub", "00000000-0000-0000-0000-000000000001")
    
    try:
        row = (await db.execute(
            text("select business_id from business_members where user_id = :u limit 1"),
            {"u": user_id},
        )).first()
        if not row:
            # Fallback to default demo business ID for development
            return Ctx(user_id, "00000000-0000-0000-0000-000000000001")
        return Ctx(user_id, str(row.business_id))
    except Exception:
        return Ctx(user_id, "00000000-0000-0000-0000-000000000001")
