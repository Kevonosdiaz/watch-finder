from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import Base, engine, get_db

router = APIRouter()
# '/api/streaming_services' is automatically part of api route here

# Get all streaming services
@router.get("", response_model=List[StreamingServiceResponse])
def get_streaming_services(db: Annotated[Session, Depends(get_db)]):
    services = db.query(models.StreamingServices).all()
    return services

# Add streaming services
@router.post("",
             response_model=StreamingServiceResponse,
             status_code=status.HTTP_201_CREATED)
def add_streaming_service(service: StreamingServiceBase, db: Annotated[Session, Depends(get_db)]):
    existing = db.query(
        models.StreamingServices).filter(models.StreamingServices.streaming_service_name == service.streaming_service_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Streaming service already exists")
    new_service = models.StreamingServices(
        streaming_service_name=service.streaming_service_name,
        website_url=service.website_url,
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

# Delete a streaming service
@router.delete("/{streaming_service_name}")
def remove_streaming_service(streaming_service_name: str, db: Annotated[Session, Depends(get_db)]):
    service = db.query(models.StreamingServices).filter(models.StreamingServices.streaming_service_name == streaming_service_name).first()
    if not service:
        raise HTTPException(status_code=404, detail="Streaming service not found")
    db.delete(service)
    db.commit()
    return {"message": "Removed"}