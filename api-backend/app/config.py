from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str
    database_url: str
    debug: bool = True
    env: str = "development"
    algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# The use of @lru_cache() avoids reloading settings every time they are accessed.
@lru_cache()
def get_settings():
    return Settings()
