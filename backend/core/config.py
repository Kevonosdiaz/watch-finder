from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator


# Map .env variables into Python object
class Settings(BaseSettings):
    DATABASE_URL: str
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str]
    API_PREFIX: str = "/api"

    # Replace ALLOWED_ORIGINS with populated list
    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
