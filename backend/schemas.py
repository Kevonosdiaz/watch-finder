from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Literal
from datetime import date

# Specify attributes & their types, so FastAPI can validate
# responses given from API routes ('response_model' is passed)

# TODO: Adjust type hints and Field constraints to match database's constraints

# Attributes for a user
class UserBase(BaseModel):
    firstname: str
    lastname: str
    country_name: str
    email: str = Field(max_length=255)

# What a user provides when signing up
class UserCreate(UserBase):
    password: str

# Response for a user
class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

# Attributes for a media title
class MediaBase(BaseModel):
    media_id: int
    title_name: str = Field(max_length=255)
    release_year: Optional[int] = None
    creator: Optional[str] = None
    age_rating: Optional[str] = Field(None, max_length=10)
    rating: Optional[float] = None
    description: Optional[str] = None

# Attributes for a show
class Shows(MediaBase):
    number_of_seasons: int

# Attributes for a movie
class Movies(MediaBase):
    duration: int

from typing import Literal

# All optional attrbutes for updating media title fields
class MediaUpdate(BaseModel):
    title_name: Optional[str] = Field(default=None, max_length=255)
    release_year: Optional[int] = None
    creator: Optional[str] = None
    age_rating: Optional[str] = Field(default=None, max_length=10)
    rating: Optional[float] = None
    description: Optional[str] = None
    kind: Optional[Literal["Movie", "TV"]] = None
    duration: Optional[int] = None
    number_of_seasons: Optional[int] = None

# Response for a media title
class MediaResponse(MediaBase):
    model_config = ConfigDict(from_attributes=True)

# TODO: Update constraints for date to different type
# Shared attributes used when needing to create/return watchlist
class WatchlistBase(BaseModel):
    email: str
    watchlist_name: str = Field(max_length=255)

# What we need specifically to create a watchlist from frontend side
class WatchlistCreate(WatchlistBase):
    pass

# What to include when returning a watchlist to the frontend
class WatchlistResponse(WatchlistBase):
    watchlist_id: int
    date_created: date = Field(alias="date_added")
    model_config = ConfigDict(from_attributes=True)

# Response for watchlist + media titles
class WatchlistWithMediaResponse(WatchlistBase):
    watchlist_id: int
    date_created: date = Field(alias="date_added")
    media: List[MediaResponse]
    model_config = ConfigDict(from_attributes=True)
    
# Attributes for watchdata
class WatchdataBase(BaseModel):    
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    completion_status: Literal['P', 'W', 'C'] = 'P'
    personal_rating: Optional[int] = Field(
        default=None,
        ge=0,
        le=5
    )

# What a user provides when adding watchdata to a media title
class WatchdataCreate(WatchdataBase):
    pass

# Response for watchdata
class WatchdataResponse(WatchdataBase):
    email: str
    media_id: int
    model_config = ConfigDict(from_attributes=True)

# Attributes for a region
class RegionBase(BaseModel):
    country_name: str = Field(max_length=80)

# Response for region
class RegionResponse(RegionBase):
    model_config = ConfigDict(from_attributes=True)

# Attributes for a streaming service
class StreamingServiceBase(BaseModel):
    streaming_service_name: str = Field(max_length=255)
    website_url: str = Field(max_length=255)

# Media titles available in a specific region
class MediaInRegion(BaseModel):
    region: RegionResponse
    media_titles: List[MediaResponse]

# Response for streaming service
class StreamingServiceResponse(StreamingServiceBase):
    logoUrl: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# Response for availability (region -> providers)
class AvailabilityResponse(RegionBase):
    providers: List[StreamingServiceResponse]
    model_config = ConfigDict(from_attributes=True)

# Response for media + availability
class MediaWithAvailabilityResponse(MediaBase):
    kind: Literal["Movie", "TV"]
    number_of_seasons: Optional[int] = None
    duration: Optional[int] = None 
    availability: List[AvailabilityResponse] = []
    model_config = ConfigDict(from_attributes=True)