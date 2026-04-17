from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import Base, engine, get_db

router = APIRouter()
# '/api/regions' is automatically part of api route here


# Get all regions in the db
@router.get("", response_model=list[RegionResponse])
def get_regions(db: Annotated[Session, Depends(get_db)]):
    regions = db.query(models.Regions).all()
    return [{"country_name": r.country_name} for r in regions]


# Get all media titles by region with search query
@router.get("/{region}/media", response_model=list[MediaWithAvailabilityResponse])
def get_media_in_region(region: str,
                        db: Annotated[Session, Depends(get_db)],
                        search: str | None = Query(
                            None, description="Filter by title name")):
    # Check to see if a region exists
    region_exists = db.query(
        models.Regions).filter(models.Regions.country_name == region).first()
    if not region_exists:
        raise HTTPException(status_code=404, detail="Region not found")
    # Join media titles, movies and shows
    query = (db.query(models.MediaTitles, models.Movies.duration, models.Shows.number_of_seasons)
            .join(models.AvailableIn, models.AvailableIn.media_id == models.MediaTitles.media_id)
            .outerjoin(models.Movies, models.Movies.media_id == models.MediaTitles.media_id)
            .outerjoin(models.Shows, models.Shows.media_id == models.MediaTitles.media_id)
        .filter(models.AvailableIn.country_name == region))
    # Apply search filter
    if search:
        query = query.filter(
            models.MediaTitles.title_name.ilike(f"%{search}%"))
    # Query and sort alphabetically
    media = query.order_by(models.MediaTitles.title_name).all()
    results = []
    for m, duration, seasons in media:
        # Get all streaming services that offer this media title in the selected region
        streaming_services = db.query(models.StreamingServices).join(models.OfferedBy).join(models.OperatesIn).filter(
                models.OfferedBy.media_id == m.media_id,
                models.OperatesIn.country_name == region
            ).all()
        # API response
        results.append(
            # Combine all information for each media title
            MediaWithAvailabilityResponse(
                media_id=m.media_id,
                title_name=m.title_name,
                release_year=m.release_year,
                creator=m.creator,
                age_rating=m.age_rating,
                rating=float(m.rating) if m.rating else None,
                description=m.description,
                image_file=m.image_file,
                kind="TV" if seasons else "Movie",
                duration=duration,
                number_of_seasons=seasons,
                availability=[{
                    "country_name": region,
                    "providers": [
                        StreamingServiceResponse(
                            streaming_service_name=service.streaming_service_name,
                            website_url=service.website_url,
                            logoUrl=None
                        )
                        for service in streaming_services
                    ]
                }]
            )
        )
    return results


# Add a region
@router.post("", response_model=RegionResponse, status_code=status.HTTP_201_CREATED)
def add_region(region: RegionBase, db: Annotated[Session, Depends(get_db)]):
    name = region.country_name.strip()
    existing = db.query(models.Regions).filter(models.Regions.country_name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Region already exists")
    new_region = models.Regions(country_name=name)
    db.add(new_region)
    db.commit()
    db.refresh(new_region)
    return new_region