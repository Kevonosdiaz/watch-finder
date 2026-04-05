from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import Base, engine, get_db

router = APIRouter()
# '/api/watchlists/' is automatically part of api route here


# Get all watchlists in the db
@router.get("", response_model=list[WatchlistResponse])
def get_watchlists(db: Annotated[Session, Depends(get_db)]):
    watchlists = db.query(models.Watchlists).all()
    return watchlists


# Add media titles to a given watchlist for a given user
@router.post("/{list_id}/media/{media_id}",
             status_code=status.HTTP_201_CREATED)
def add_media_to_watchlist(list_id: int, media_id: int,
                           db: Annotated[Session, Depends(get_db)]):
    # Check if watchlist exists
    watchlist = db.query(models.Watchlists).filter(
        models.Watchlists.watchlist_id == list_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Check to see if media title exists
    media_title = db.query(models.MediaTitles).filter(
        models.MediaTitles.media_id == media_id).first()
    if not media_title:
        raise HTTPException(status_code=404, detail="Media title not found")
    # Prevent media titles from being added twice in the same watchlist
    existing = db.query(models.WatchlistContains).filter(
        models.WatchlistContains.watchlist_id == list_id,
        models.WatchlistContains.media_id == media_id).first()
    if existing:
        raise HTTPException(status_code=409,
                            detail="Media title already in watchlist")
    # Add media title
    media_title_in_watchlist = models.WatchlistContains(
        watchlist_id=watchlist.watchlist_id, media_id=media_id)
    db.add(media_title_in_watchlist)
    db.commit()
    db.refresh(media_title_in_watchlist)
    return media_title_in_watchlist


# Delete media from a watchlist
@router.delete("/{list_id}/media/{media_id}")
def remove_media_from_watchlist(list_id: int, media_id: int,
                                db: Annotated[Session,
                                              Depends(get_db)]):
    media = db.query(models.WatchlistContains).filter(
        models.WatchlistContains.watchlist_id == list_id,
        models.WatchlistContains.media_id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media title not found")
    db.delete(media)
    db.commit()
    return {"message": "Removed"}


# Add/update watchdata to a media title
@router.post("/{list_id}/media/{media_id}/watchdata",
             response_model=WatchdataResponse,
             status_code=status.HTTP_201_CREATED)
def add_watchdata(list_id: int, media_id: int, watchdata: WatchdataCreate,
                  db: Annotated[Session, Depends(get_db)]):
    # Check to see if watchlist exists
    watchlist = db.query(models.Watchlists).filter(
        models.Watchlists.watchlist_id == list_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Check to see if media title exists
    media_title = db.query(models.MediaTitles).filter(
        models.MediaTitles.media_id == media_id).first()
    if not media_title:
        raise HTTPException(status_code=404, detail="Media title not found")
    # Convert personal rating to string for enum
    rating = (str(watchdata.personal_rating)
              if watchdata.personal_rating is not None else None)
    # Check if watchdata for this media title exists already
    existing = db.query(models.WatchData).filter(
        models.WatchData.email == watchlist.email,
        models.WatchData.media_id == media_id).first()
    if existing:
        existing.start_date = watchdata.start_date
        existing.end_date = watchdata.end_date
        existing.completion_status = watchdata.completion_status
        existing.personal_rating = rating

        db.commit()
        db.refresh(existing)
        return {
            "email":
            existing.email,
            "media_id":
            existing.media_id,
            "start_date":
            existing.start_date,
            "end_date":
            existing.end_date,
            "completion_status": (existing.completion_status.value if hasattr(
                existing.completion_status, "value") else
                                  existing.completion_status),
            "personal_rating":
            int(existing.personal_rating.value) if hasattr(
                existing.personal_rating, "value") else
            int(existing.personal_rating)
            if existing.personal_rating is not None else None,
        }

    # Add watchdata
    new_watchdata = models.WatchData(
        email=watchlist.email,
        media_id=media_id,
        start_date=watchdata.start_date,
        end_date=watchdata.end_date,
        completion_status=watchdata.completion_status,
        personal_rating=rating)

    db.add(new_watchdata)
    db.commit()
    db.refresh(new_watchdata)
    return {
        "email":
        new_watchdata.email,
        "media_id":
        new_watchdata.media_id,
        "start_date":
        new_watchdata.start_date,
        "end_date":
        new_watchdata.end_date,
        "completion_status": (new_watchdata.completion_status.value if hasattr(
            new_watchdata.completion_status, "value") else
                              new_watchdata.completion_status),
        "personal_rating":
        int(new_watchdata.personal_rating.value) if hasattr(
            new_watchdata.personal_rating, "value") else
        int(new_watchdata.personal_rating)
        if new_watchdata.personal_rating is not None else None,
    }


# Get watchdata for a specific media title for a given user
@router.get("/{watchlist_id}/media/{media_id}/watchdata",
            response_model=list[WatchdataResponse])
def get_watchdata_for_media_in_watchlist(watchlist_id: int, media_id: int,
                                         db: Annotated[Session,
                                                       Depends(get_db)]):
    # Check to see if watchlist exists
    watchlist = db.query(models.Watchlists).filter(
        models.Watchlists.watchlist_id == watchlist_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Get all WatchData fields for that media title
    watchdata = db.query(models.WatchData).filter(
        models.WatchData.media_id == media_id,
        models.WatchData.email == watchlist.email).all()
    result = []
    for wd in watchdata:
        result.append({
            "email":
            wd.email,
            "media_id":
            wd.media_id,
            "start_date":
            wd.start_date,
            "end_date":
            wd.end_date,
            "completion_status": (wd.completion_status.value if hasattr(
                wd.completion_status, "value") else wd.completion_status),
            "personal_rating": (int(wd.personal_rating.value) if hasattr(
                wd.personal_rating, "value") else int(wd.personal_rating))
            if wd.personal_rating is not None else None,
        })
    return result
