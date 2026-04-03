from typing import Annotated

from fastapi import FastAPI, HTTPException, Request, status, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from database import Base, engine, get_db
from schemas import MediaResponse, WatchlistResponse, WatchlistWithMediaResponse, WatchlistCreate, WatchdataResponse, WatchdataCreate, UserResponse, UserCreate, RegionResponse
from core.config import settings
from datetime import datetime

# Initialize the DB, if not already done
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Watch Finder API", docs_url="/docs", redoc_url="/redoc")

# Allow frontend to interact with backend
# NOTE: Can specify allowed ports, methods like GET, etc.
app.add_middleware(CORSMiddleware,
                   allow_origins=settings.ALLOWED_ORIGINS,
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

# Get all regions in the db
@app.get("/api/regions", response_model=list[RegionResponse])
def get_regions(db: Annotated[Session, Depends(get_db)]):
    regions = db.query(models.Regions).all()
    return [{"country_name": r.country_name} for r in regions]

# Get all media titles in the db
@app.get("/api/media", response_model=list[MediaResponse])
def get_media_titles(db: Annotated[Session, Depends(get_db)]):
    media_list = db.query(models.MediaTitles).all()
    return media_list

# Get all media titles by region with search query
@app.get("/api/regions/{region}/media", response_model=list[MediaResponse])
def get_media_in_region(region: str, db: Annotated[Session, Depends(get_db)], search: str | None = Query(None, description="Filter by title name")):
    # Check to see if a region exists
    region_exists = db.query(models.Regions).filter(models.Regions.country_name == region).first()
    if not region_exists:
        raise HTTPException(status_code=404, detail="Region not found")
    query = (
        db.query(models.MediaTitles)
        .join(models.AvailableIn, models.AvailableIn.media_id == models.MediaTitles.media_id)
        .filter(models.AvailableIn.country_name == region)
    )
    # Apply search filter
    if search:
        query = query.filter(models.MediaTitles.title_name.ilike(f"%{search}%")) 
    media = query.order_by(models.MediaTitles.title_name).all()
    return media

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

# Get all watchlists in the db
@app.get("/api/watchlists", response_model=list[WatchlistResponse])
def get_watchlists(db: Annotated[Session, Depends(get_db)]):
    watchlists = db.query(models.Watchlists).all()
    return watchlists

# Add media titles to a given watchlist for a given user
@app.post(
        "/api/watchlist/{list_id}/media/{media_id}",
        status_code=status.HTTP_201_CREATED
)
def add_media_to_watchlist(list_id: int, media_id: int, db: Annotated[Session, Depends(get_db)]):
    # Check if watchlist exists
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.watchlist_id == list_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Check to see if media title exists
    media_title = db.query(models.MediaTitles).filter(models.MediaTitles.media_id == media_id).first()
    if not media_title:
        raise HTTPException(status_code=404, detail="Media title not found")
    # Prevent media titles from being added twice in the same watchlist
    existing = db.query(models.WatchlistContains).filter(models.WatchlistContains.watchlist_id == list_id, models.WatchlistContains.media_id == media_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Media title already in watchlist")
    # Add media title
    media_title_in_watchlist = models.WatchlistContains(
        watchlist_id=watchlist.watchlist_id,
        media_id=media_id
    )
    db.add(media_title_in_watchlist)
    db.commit()
    db.refresh(media_title_in_watchlist)
    return media_title_in_watchlist

# Get all watchlists with media titles for a given user
@app.get("/api/users/{email}/watchlists", response_model=list[WatchlistWithMediaResponse])
def get_user_watchlist_with_media(email: str, db: Annotated[Session, Depends(get_db)]):
    watchlists = db.query(models.Watchlists).filter(models.Watchlists.email == email).all()
    # Return error JSON or HTTPException if not found
    if not watchlists:
        return []
    result = []
    for watchlist in watchlists:
        # Get media titles for this watchlist
        media = db.query(models.MediaTitles).join(models.WatchlistContains, models.MediaTitles.media_id == models.WatchlistContains.media_id).filter(models.WatchlistContains.watchlist_id == watchlist.watchlist_id).all()
        result.append({
            "watchlist_id": watchlist.watchlist_id,
            "email": watchlist.email,
            "watchlist_name": watchlist.watchlist_name,
            "date_added": watchlist.date_added,
            "media": media
        })
    return result

# Get a specific watchlist with media titles for a given user
@app.get("/api/users/{email}/watchlists/{list_id}", response_model=WatchlistWithMediaResponse)
def get_watchlist(email: str, list_id: int, db: Annotated[Session, Depends(get_db)]):
    # Return contents of specified watchlist
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.email == email, models.Watchlists.watchlist_id == list_id).first()
    # Return error JSON or HTTPException if not found
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Get media titles in the watchlist (if any)
    media = db.query(models.MediaTitles).join(models.WatchlistContains, models.MediaTitles.media_id == models.WatchlistContains.media_id).filter(models.WatchlistContains.watchlist_id == watchlist.watchlist_id).all()
    return {
        "watchlist_id": watchlist.watchlist_id,
        "email": watchlist.email,
        "watchlist_name": watchlist.watchlist_name,
        "date_added": watchlist.date_added,
        "media": media
    }

# Add/update watchdata to a media title
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
    # Convert personal rating to string for enum
    rating = (str(watchdata.personal_rating) if watchdata.personal_rating is not None else None)
    # Check if watchdata for this media title exists already
    existing = db.query(models.WatchData).filter(models.WatchData.email == watchlist.email, models.WatchData.media_id == media_id).first()
    if existing:
        existing.start_date = watchdata.start_date
        existing.end_date = watchdata.end_date
        existing.completion_status = watchdata.completion_status
        existing.personal_rating = rating

        db.commit()
        db.refresh(existing)
        return {
            "email": existing.email,
            "media_id": existing.media_id,
            "start_date": existing.start_date,
            "end_date": existing.end_date,
            "completion_status": (existing.completion_status.value if hasattr(existing.completion_status, "value") else existing.completion_status),
            "personal_rating": int(existing.personal_rating.value) if hasattr(existing.personal_rating, "value") else int(existing.personal_rating) if existing.personal_rating is not None else None,
        }

    # Add watchdata
    new_watchdata = models.WatchData(
        email=watchlist.email,
        media_id=media_id,
        start_date=watchdata.start_date,
        end_date=watchdata.end_date,
        completion_status=watchdata.completion_status,
        personal_rating=rating
    )

    db.add(new_watchdata)
    db.commit()
    db.refresh(new_watchdata)
    return {
        "email": new_watchdata.email,
        "media_id": new_watchdata.media_id,
        "start_date": new_watchdata.start_date,
        "end_date": new_watchdata.end_date,
        "completion_status": (new_watchdata.completion_status.value if hasattr(new_watchdata.completion_status, "value") else new_watchdata.completion_status),
        "personal_rating": int(new_watchdata.personal_rating.value) if hasattr(new_watchdata.personal_rating, "value") else int(new_watchdata.personal_rating) if new_watchdata.personal_rating is not None else None,
    }

# Get all watchdata of given user (for display purposes)
@app.get("/api/watchdata/{email}", response_model=list[WatchdataResponse])
def get_watchdata(email: str, db: Annotated[Session, Depends(get_db)]):
    watchdata = db.query(models.WatchData).filter(models.WatchData.email == email).all()
    result = []
    for wd in watchdata:
        result.append({
            "email": wd.email,
            "media_id": wd.media_id,
            "start_date": wd.start_date,
            "end_date": wd.end_date,
            "completion_status": (wd.completion_status.value if hasattr(wd.completion_status, "value") else wd.completion_status),
            "personal_rating": (int(wd.personal_rating.value) if hasattr(wd.personal_rating, "value") else int(wd.personal_rating)) if wd.personal_rating is not None else None,
        })
    return result

# Get watchdata for a specific media title for a given user
@app.get("/api/watchlist/{watchlist_id}/media/{media_id}/watchdata", response_model=list[WatchdataResponse])
def get_watchdata_for_media_in_watchlist(watchlist_id: int, media_id: int, db: Annotated[Session, Depends(get_db)]):
    # Check to see if watchlist exists
    watchlist = db.query(models.Watchlists).filter(models.Watchlists.watchlist_id == watchlist_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Get all WatchData fields for that media title
    watchdata = db.query(models.WatchData).filter(models.WatchData.media_id == media_id, models.WatchData.email == watchlist.email).all()
    result = []
    for wd in watchdata:
        result.append({
            "email": wd.email,
            "media_id": wd.media_id,
            "start_date": wd.start_date,
            "end_date": wd.end_date,
            "completion_status": (wd.completion_status.value if hasattr(wd.completion_status, "value") else wd.completion_status),
            "personal_rating": (int(wd.personal_rating.value) if hasattr(wd.personal_rating, "value") else int(wd.personal_rating)) if wd.personal_rating is not None else None,
        })
    return result

# TODO: May want to setup exception handler (may just need to tell frontend about error)

if __name__ == "__main__":
    import uvicorn
    # Web server serves FastAPI on localhost:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
