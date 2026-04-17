from fastapi import APIRouter, HTTPException, Request, status, Depends, Query
import models
from schemas import *
from typing import Annotated
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import Base, engine, get_db

router = APIRouter()
# '/api/watchdata/' is automatically part of api route here


# Get all watchdata of given user (for display purposes)
@router.get("/{email}", response_model=list[WatchdataResponse])
def get_watchdata(email: str, db: Annotated[Session, Depends(get_db)]):
    # Get all watchdata for the user
    watchdata = db.query(
        models.WatchData).filter(models.WatchData.email == email).all()
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
