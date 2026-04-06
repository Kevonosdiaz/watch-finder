from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import Base, engine, get_db

router = APIRouter()
# '/api/users/' is automatically part of api route here


# Create a user
@router.post("",
             response_model=UserResponse,
             status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    existing = db.query(
        models.Users).filter(models.Users.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = models.Users(
        firstname=user.firstname,
        lastname=user.lastname,
        country_name=user.country_name,
        email=user.email,
        password=user.password  # TODO: Hash password in production
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# Retrieve a user
@router.get("/{email}/{password}", response_model=UserResponse)
def get_user(email: str, password: str, db: Annotated[Session,
                                                      Depends(get_db)]):
    result = db.execute(
        select(models.Users).where(models.Users.email == email,
                                   models.Users.password == password))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Create a new watchlist for a given user
@router.post(
    "/{email}/watchlists",
    response_model=WatchlistResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_watchlist(email: str, watchlist: WatchlistCreate,
                     db: Annotated[Session, Depends(get_db)]):
    # Interact with DB to create new watchlist as specified
    new_watchlist = models.Watchlists(watchlist_name=watchlist.watchlist_name,
                                      email=email,
                                      date_added=datetime.now())
    db.add(new_watchlist)
    db.commit()
    db.refresh(new_watchlist)
    return new_watchlist


# Update watchlist name
@router.put("/{email}/watchlists/{list_id}", response_model=WatchlistResponse)
def update_watchlist_name(email: str, list_id: int, watchlist: WatchlistCreate,
                          db: Annotated[Session, Depends(get_db)]):
    existing_watchlist = db.query(models.Watchlists).filter(
        models.Watchlists.email == email,
        models.Watchlists.watchlist_id == list_id).first()
    if not existing_watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    existing_watchlist.watchlist_name = watchlist.watchlist_name
    db.commit()
    db.refresh(existing_watchlist)
    return existing_watchlist


# Get all watchlists with media titles for a given user
@router.get("/{email}/watchlists",
            response_model=list[WatchlistWithMediaResponse])
def get_user_watchlist_with_media(email: str, db: Annotated[Session,
                                                            Depends(get_db)]):
    watchlists = db.query(
        models.Watchlists).filter(models.Watchlists.email == email).all()
    # Return error JSON or HTTPException if not found
    if not watchlists:
        return []
    result = []
    for watchlist in watchlists:
        # Get media titles for this watchlist
        media = db.query(models.MediaTitles).join(
            models.WatchlistContains, models.MediaTitles.media_id ==
            models.WatchlistContains.media_id).filter(
                models.WatchlistContains.watchlist_id ==
                watchlist.watchlist_id).all()
        result.append({
            "watchlist_id": watchlist.watchlist_id,
            "email": watchlist.email,
            "watchlist_name": watchlist.watchlist_name,
            "date_added": watchlist.date_added,
            "media": media
        })
    return result


# Get a specific watchlist with media titles for a given user
@router.get("/{email}/watchlists/{list_id}",
            response_model=WatchlistWithMediaResponse)
def get_watchlist(email: str, list_id: int, db: Annotated[Session,
                                                          Depends(get_db)]):
    # Return contents of specified watchlist
    watchlist = db.query(models.Watchlists).filter(
        models.Watchlists.email == email,
        models.Watchlists.watchlist_id == list_id).first()
    # Return error JSON or HTTPException if not found
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    # Get media titles in the watchlist (if any)
    media = db.query(models.MediaTitles).join(
        models.WatchlistContains,
        models.MediaTitles.media_id == models.WatchlistContains.media_id
    ).filter(
        models.WatchlistContains.watchlist_id == watchlist.watchlist_id).all()
    return {
        "watchlist_id": watchlist.watchlist_id,
        "email": watchlist.email,
        "watchlist_name": watchlist.watchlist_name,
        "date_added": watchlist.date_added,
        "media": media
    }


# Delete a watchlist for a given user
@router.delete("/{email}/watchlists/{list_id}")
def remove_watchlist(email: str, list_id: int, db: Annotated[Session,
                                                             Depends(get_db)]):
    watchlist = db.query(models.Watchlists).filter(
        models.Watchlists.email == email,
        models.Watchlists.watchlist_id == list_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    db.delete(watchlist)
    db.commit()
    return {"message": "Removed"}
