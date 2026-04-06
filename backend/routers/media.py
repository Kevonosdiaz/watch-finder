from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import Base, engine, get_db

router = APIRouter()
# '/api/media' is automatically part of api route here


# Get all media titles and its full details in db
@router.get("", response_model=list[MediaWithAvailabilityResponse])
def get_all_media_details(db: Annotated[Session, Depends(get_db)]):
    # Get all media titles with number of seasons (TV) or duration (movies)
    media_list = (db.query(
        models.MediaTitles, models.Shows.number_of_seasons,
        models.Movies.duration).outerjoin(
            models.Shows,
            models.Shows.media_id == models.MediaTitles.media_id).outerjoin(
                models.Movies,
                models.Movies.media_id == models.MediaTitles.media_id).all())
    results = []
    # If the media title has seasons, it's a show; otherwise it's a movie
    for media, seasons, duration in media_list:
        kind = "TV" if seasons is not None else "Movie"
        # Find all regions where this media title is available
        regions = db.query(models.AvailableIn.country_name).filter(
            models.AvailableIn.media_id == media.media_id).all()
        availability = []
        # For each region, find the streaming platforms that offer this media title and operate in the region
        for (country_name, ) in regions:
            providers = (db.query(
                models.StreamingServices.streaming_service_name,
                models.StreamingServices.website_url).join(
                    models.OperatesIn, models.OperatesIn.streaming_service_name
                    == models.StreamingServices.streaming_service_name).join(
                        models.OfferedBy,
                        models.OfferedBy.streaming_service_name == models.
                        StreamingServices.streaming_service_name).filter(
                            models.OperatesIn.country_name == country_name,
                            models.OfferedBy.media_id == media.media_id).all())
            availability.append({
                "country_name":
                country_name,
                "providers": [{
                    "name": name,
                    "website_url": url,
                    "logoUrl": None
                } for name, url in providers]
            })
        results.append({
            "media_id": media.media_id,
            "title_name": media.title_name,
            "release_year": media.release_year,
            "creator": media.creator,
            "age_rating": media.age_rating,
            "rating": float(media.rating) if media.rating else None,
            "description": media.description,
            "kind": kind,
            "number_of_seasons": seasons,
            "duration": duration,
            "availability": availability
        })
    return results


# Delete a media title
@router.delete("/{media_id}")
def delete_media_title(media_id: int, db: Annotated[Session, Depends(get_db)]):
    media = db.query(models.MediaTitles).filter(
        models.MediaTitles.media_id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media title not found")
    db.delete(media)
    db.commit()
    return {"message": "Removed"}


# Get media details
@router.get("/{media_id}", response_model=MediaResponse)
def get_media_title(media_id: int, db: Annotated[Session, Depends(get_db)]):
    media = db.query(models.MediaTitles).filter(
        models.MediaTitles.media_id == media_id).first()
    return media

@router.put("/{media_id}")
def update_media_title(media_id: int, payload: MediaUpdate, db: Session = Depends(get_db)):
    media = db.query(models.MediaTitles).filter_by(media_id=media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media title not found")
    data = payload.model_dump(exclude_unset=True)
    # Update media title fields directly
    for key, value in data.items():
        if hasattr(models.MediaTitles, key):
            setattr(media, key, value)
    # Update movies/shows if needed
    if "duration" in data:
        movie = db.query(models.Movies).filter_by(media_id=media_id).first()
        if movie:
            movie.duration = data["duration"]
    if "number_of_seasons" in data:
        show = db.query(models.Shows).filter_by(media_id=media_id).first()
        if show:
            show.number_of_seasons = data["number_of_seasons"]
    db.commit()
    return {"message": "Updated"}
