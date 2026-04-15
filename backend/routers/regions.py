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
@router.get("/{region}/media", response_model=list[MediaResponse])
def get_media_in_region(region: str,
                        db: Annotated[Session, Depends(get_db)],
                        search: str | None = Query(
                            None, description="Filter by title name")):
    # Check to see if a region exists
    region_exists = db.query(
        models.Regions).filter(models.Regions.country_name == region).first()
    if not region_exists:
        raise HTTPException(status_code=404, detail="Region not found")
    query = (db.query(models.MediaTitles).join(
        models.AvailableIn,
        models.AvailableIn.media_id == models.MediaTitles.media_id).filter(
            models.AvailableIn.country_name == region))
    # Apply search filter
    if search:
        query = query.filter(
            models.MediaTitles.title_name.ilike(f"%{search}%"))
    media = query.order_by(models.MediaTitles.title_name).all()
    return [
        MediaResponse.model_validate(m).model_copy(update={
            "streaming_services": [
                StreamingServiceResponse.model_validate(s)
                for s in db.query(models.StreamingServices)
                .join(models.OfferedBy)
                .join(models.OperatesIn)
                .filter(
                    models.OfferedBy.media_id == m.media_id,
                    models.OperatesIn.country_name == region,
                )
                .all()
            ]
        })
        for m in media
    ]


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