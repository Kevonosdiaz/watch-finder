from typing import Annotated

from fastapi import FastAPI, HTTPException, Request, status, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from database import Base, engine, get_db
# from schemas import MediaResponse, WatchlistResponse, WatchlistWithMediaResponse, WatchlistCreate, WatchdataResponse, WatchdataCreate, UserResponse, UserCreate, RegionResponse, MediaWithAvailabilityResponse
from routers import users, media, regions, watchlists, watchdata
from core.config import settings
from datetime import datetime

# Initialize the DB, if not already done
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Watch Finder API", docs_url="/docs", redoc_url="/redoc")

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(regions.router, prefix="/api/regions", tags=["regions"])
app.include_router(watchlists.router,
                   prefix="/api/watchlists",
                   tags=["watchlists"])
app.include_router(watchdata.router,
                   prefix="/api/watchdata",
                   tags=["watchdata"])

# Allow frontend to interact with backend
# NOTE: Can specify allowed ports, methods like GET, etc.
app.add_middleware(CORSMiddleware,
                   allow_origins=settings.ALLOWED_ORIGINS,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

# TODO: May want to setup exception handler (may just need to tell frontend about error)

if __name__ == "__main__":
    import uvicorn
    # Web server serves FastAPI on localhost:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
