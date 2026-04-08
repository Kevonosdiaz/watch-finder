from fastapi import APIRouter, HTTPException, Request, status, Depends, Query, UploadFile
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from PIL import UnidentifiedImageError

from database import Base, engine, get_db
from image_utils import delete_img, process_img

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
                    "streaming_service_name": name,
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


# Add a media title
@router.post("", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
def add_media(payload: MediaCreate, db: Annotated[Session, Depends(get_db)]):
    if payload.kind == "Movie" and not payload.duration:
        raise HTTPException(400, "Duration is required for Movie")
    if payload.kind == "TV" and not payload.number_of_seasons:
        raise HTTPException(400, "Number of seasons is required for TV")
    media = models.MediaTitles(
        title_name=payload.title_name.strip(),
        release_year=payload.release_year,
        creator=payload.creator,
        age_rating=payload.age_rating,
        rating=payload.rating,
        description=payload.description,
    )
    db.add(media)
    db.flush()
    db.add(
        models.Movies(media_id=media.media_id, duration=payload.duration)
        if payload.kind == "Movie"
        else models.Shows(media_id=media.media_id, number_of_seasons=payload.number_of_seasons)
    )
    all_services = {
        svc.strip()
        for a in payload.availability
        for svc in a.streaming_services
        if svc.strip()
    }
    for svc in all_services:
        if not db.query(models.StreamingServices).filter_by(streaming_service_name=svc).first():
            raise HTTPException(404, f"Streaming service not found: {svc}")
        db.add(models.OfferedBy(
            media_id=media.media_id,
            streaming_service_name=svc
        ))
    for a in payload.availability:
        country = a.country_name.strip()
        if not country:
            continue
        if not db.query(models.Regions).filter_by(country_name=country).first():
            db.add(models.Regions(country_name=country))
        db.add(models.AvailableIn(media_id=media.media_id, country_name=country))
        for svc in a.streaming_services:
            svc = svc.strip()
            if svc:
                db.add(models.OperatesIn(
                    streaming_service_name=svc,
                    country_name=country
                ))
    db.commit()
    return media


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


@router.put("/{media_id}", response_model=MediaResponse)
def update_media_title(media_id: int, payload: MediaUpdate, db: Session = Depends(get_db)):
    print("RAW payload.availability =", payload.availability)
    media = db.query(models.MediaTitles).filter_by(media_id=media_id).first()
    if not media:
        raise HTTPException(404, "Media title not found")
    if payload.kind == "Movie" and payload.duration is None:
        raise HTTPException(400, "Duration is required for Movie")
    if payload.kind == "TV" and payload.number_of_seasons is None:
        raise HTTPException(400, "Number of seasons is required for TV")
    data = payload.model_dump(exclude_unset=True, exclude={"availability"})
    for key, value in data.items():
        if hasattr(media, key):
            setattr(media, key, value)
    if payload.kind == "Movie":
        db.query(models.Shows).filter_by(media_id=media_id).delete()
        movie = db.query(models.Movies).filter_by(media_id=media_id).first()
        if movie:
            movie.duration = payload.duration
        else:
            db.add(models.Movies(media_id=media_id, duration=payload.duration))
    if payload.kind == "TV":
        db.query(models.Movies).filter_by(media_id=media_id).delete()
        show = db.query(models.Shows).filter_by(media_id=media_id).first()
        if show:
            show.number_of_seasons = payload.number_of_seasons
        else:
            db.add(
                models.Shows(
                    media_id=media_id,
                    number_of_seasons=payload.number_of_seasons
                )
            )
    if payload.availability is not None:
        db.query(models.OfferedBy).filter_by(media_id=media_id).delete()
        db.query(models.AvailableIn).filter_by(media_id=media_id).delete()
        db.query(models.OperatesIn).delete()
        all_services = {
            svc.strip()
            for a in payload.availability
            for svc in a.streaming_services
            if svc.strip()
        }
        for svc in all_services:
            if not db.query(models.StreamingServices)\
                .filter_by(streaming_service_name=svc).first():
                raise HTTPException(404, f"Streaming service not found: {svc}")
            db.add(models.OfferedBy(
                media_id=media_id,
                streaming_service_name=svc
            ))
        for a in payload.availability:
            country = a.country_name.strip()
            if not country:
                continue
            if not db.query(models.Regions)\
                .filter_by(country_name=country).first():
                db.add(models.Regions(country_name=country))
            db.add(models.AvailableIn(
                media_id=media_id,
                country_name=country
            ))
            for svc in a.streaming_services:
                svc = svc.strip()
                if svc:
                    db.add(models.OperatesIn(
                        streaming_service_name=svc,
                        country_name=country
                    ))
    db.commit()
    return media

@router.patch("/{media_id}/img")
async def upload_media_img(media_id: int,
                           file: UploadFile,
                           db: Session = Depends(get_db)):
    content = await file.read()

    try:
        new_filename = process_img(content, str(media_id))
    except UnidentifiedImageError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Invalid image file") from err

    media_title = db.query(
        models.MediaTitles).filter_by(media_id=media_id).first()
    media_title.image_file = new_filename
    db.commit()
    return {"message": "New image uploaded"}
