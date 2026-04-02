from typing import Annotated

from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from database import Base, engine, get_db
from schemas import MediaResponse, WatchlistResponse, WatchlistCreate
from core.config import settings
from datetime import datetime

# Initialize the DB, if not already done
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Watch Finder API", docs_url="/docs", redoc_url="/redoc")

# Allow frontend to interact with backend
# NOTE: Can specify allowed ports, methods like GET, etc.
app.add_middleware(CORSMiddleware,
                   settings.ALLOWED_ORIGINS,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


# TODO: Migrate routes to routers directory
@app.get("/")
def home():
    return {"test": "Hello world!"}

# Get all media titles in the db
@app.get("/api/media", response_model=list[MediaResponse])
def get_media_titles(db: Annotated[Session, Depends(get_db)]):
    media_list = db.query(models.MediaTitles).all()
    return media_list

# Create a new watchlist
@app.post(
    "/api/watchlists",
    response_model=WatchlistResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_watchlist(watchlist: WatchlistCreate, db: Annotated[Session, Depends(get_db)]):
    # Interact with DB to create new watchlist as specified
    new_watchlist = models.Watchlists(
        watchlist_name=watchlist.watchlist_name,
        date_created=datetime.now()
    )
    db.add(new_watchlist)
    db.commit()
    db.refresh(new_watchlist)
    return new_watchlist


# Get all watchlists of given user (for display purposes)
@app.get("/api/watchlists", response_model=list[WatchlistResponse])
def get_watchlists(db: Annotated[Session, Depends(get_db)]):
    # Get all watchlists for the current user
    watchlists = db.query(models.Watchlists).all()
    return watchlists


# NOTE: Can use {} in route to specify path parameter
@app.get("/api/watchlist/{list_id}", response_model=WatchlistResponse)
def get_watchlist(list_id: int, db: Annotated[Session, Depends(get_db)]):
    # Return contents of specified watchlist
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.watchlist_id == list_id.first())
    # Return error JSON or HTTPException if not found
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return


# TODO: May want to setup exception handler (may just need to tell frontend about error)

if __name__ == "__main__":
    import uvicorn
    # Web server serves FastAPI on localhost:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
