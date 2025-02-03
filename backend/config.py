from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    FRONTEND_APP_URL: str
    DATABASE_HOSTNAME: str
    DATABASE_USERNAME: str
    DATABASE_PASSWORD: str
    DATABASE_PORT: int
    DATABASE_NAME: str
    API_KEY: str
    
    class Config:
        env_file = "../.env"


settings = Settings()