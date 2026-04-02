from typing import Annotated

from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from database import Base, engine, get_db
from schemas import MediaResponse, WatchlistResponse, WatchlistCreate, WatchdataResponse, WatchdataCreate, UserResponse, UserCreate
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

# Create a user
@app.post(
    "/api/user", 
    response_model=UserResponse, 
    status_code=status.HTTP_201_CREATED
)
def create_user(user:UserCreate, db: Annotated[Session, Depends(get_db)]):
    existing = db.query(models.Users).filter(models.Users.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = models.Users(
        firstname=user.firstname,
        lastname=user.lastname,
        country_name=user.country_name,
        email=user.email,
        password=user.password # TODO: Hash password in production
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Retrieve a user
@app.get("/api/users/{email}", response_model=UserResponse)
def get_user(email: str, db: Annotated[Session, Depends(get_db)]):
    user = db.query(models.Users).filter(models.Users.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

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
        email=watchlist.email, 
        date_added=datetime.now()
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
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.watchlist_id == list_id).first()
    # Return error JSON or HTTPException if not found
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return

# Add watchdata to a media title
@app.post(
    "/api/watchlist/{list_id}/media/{media_id}/watchdata",
    response_model=WatchdataResponse,
    status_code=status.HTTP_201_CREATED
)
def add_watchdata(list_id: int, media_id: int, watchdata: WatchdataCreate, db: Annotated[Session, Depends(get_db)]):
    # Check to see if watchlist exists
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.watchlist_id == list_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Check to see if media title exists
    media_title = db.query(models.MediaTitles).filter(models.MediaTitles.media_id == media_id).first()
    if not media_title:
        raise HTTPException(status_code=404, detail="Media title not found")
    # Add watchdata
    new_watchdata = models.WatchData(
        email=watchlist.email,
        media_id=media_id,
        start_date=watchdata.start_date,
        end_date=watchdata.end_date,
        completion_status=watchdata.completion_status,
        personal_rating=watchdata.personal_rating
    )
    db.add(new_watchdata)
    db.commit()
    db.refresh(new_watchdata)
    return new_watchdata

# Get all watchdata of given user (for display purposes)
@app.get("/api/watchdata/{email}", response_model=list[WatchdataResponse])
def get_watchdata(email: str, db: Annotated[Session, Depends(get_db)]):
    watchdata = db.query(models.WatchData).filter(models.WatchData.email == email).all()
    return watchdata

# Get watchdata for a specific media title for a given user
@app.get("/api/watchlist/{watchlist_id}/media/{media_id}/watchdata", response_model=list[WatchdataResponse])
def get_watchdata_for_media_in_watchlist(watchlist_id: int, media_id: int, db: Annotated[Session, Depends(get_db)]):
    # Check to see if watchlist exists
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.watchlist_id == watchlist_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Get all WatchData fields for that media title
    watchdata = db.query(models.WatchData).filter(models.WatchData.media_id == media_id, models.WatchData.email == watchlist.email).all()
    return watchdata

# TODO: May want to setup exception handler (may just need to tell frontend about error)

if __name__ == "__main__":
    import uvicorn
    # Web server serves FastAPI on localhost:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
