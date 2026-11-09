from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str = "sqlite+aiosqlite:///./golden_reindeer.db"
    supabase_url: str = "https://mockproject.supabase.co"
    supabase_jwt_secret: str | None = "mock_jwt_secret_min_32_characters_long_12345"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    anthropic_api_key: str = "mock_anthropic_api_key"
    llm_model: str = "claude-3-5-sonnet-20241022"
    wa_verify_token: str = "golden-reindeer-verify-token-mock"
    wa_app_secret: str = "mock_wa_app_secret"
    wa_access_token: str = "mock_wa_access_token"
    wa_phone_number_id: str | None = None
    wa_api_version: str = "v21.0"
    google_places_api_key: str = ""
    geoapify_api_key: str = ""
    gbp_provider: str = "mock"

settings = Settings()
