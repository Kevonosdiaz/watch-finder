from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings

app = FastAPI(title="Watch Finder API", docs_url="/docs", redoc_url="/redoc")

# Allow frontend to interact with backend
# NOTE: Can specify allowed ports, methods like GET, etc.
app.add_middleware(CORSMiddleware,
                   settings.ALLOWED_ORIGINS,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

if __name__ == "__main__":
    import uvicorn
    # Web server servers FastAPI on localhost:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
