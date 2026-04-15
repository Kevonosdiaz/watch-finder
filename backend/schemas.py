from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Literal
from datetime import date

# Specify attributes & their types, so FastAPI can validate
# responses given from API routes ('response_model' is passed)


# Attributes for a user
class UserBase(BaseModel):
    firstname: str
    lastname: str
    country_name: str
    email: str = Field(max_length=255)


# Attributes for user login
class UserLoginBase(BaseModel):
    email: str
    password: str

    
# What a user provides when signing up
class UserCreate(UserBase):
    password: str


# Response for a user
class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    role: str


# What a user can update on their profile
class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    country_name: Optional[str] = None


# Request model for changing password
class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


# Attributes for a media title
class MediaBase(BaseModel):
    media_id: int
    title_name: str = Field(max_length=255)
    release_year: Optional[int] = None
    creator: Optional[str] = None
    age_rating: Optional[str] = Field(None, max_length=10)
    rating: Optional[float] = None
    description: Optional[str] = None
    image_file: Optional[str] = None


# Attributes for a show
class Shows(MediaBase):
    number_of_seasons: int


# Attributes for a movie
class Movies(MediaBase):
    duration: int


class MediaPatchImg(BaseModel):
    media_id: int
    filepath: str


# Response for a media title
class MediaResponse(MediaBase):
    model_config = ConfigDict(from_attributes=True)


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
    personal_rating: Optional[int] = Field(default=None, ge=0, le=5)


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


# Attributes for updating a streaming service
class StreamingServiceUpdate(BaseModel):
    website_url: Optional[str] = Field(default=None, max_length=255)
    logoUrl: Optional[str] = None


# Media titles available in a specific region
class MediaInRegion(BaseModel):
    region: RegionResponse
    media_titles: List[MediaResponse]


# Response for streaming service
class StreamingServiceResponse(StreamingServiceBase):
    logoUrl: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# Availability
class AvailabilityCreate(BaseModel):
    country_name: str
    streaming_services: List[str]


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


# All attributes for creating a media title
class MediaCreate(BaseModel):
    title_name: str = Field(default=None, max_length=255)
    release_year: Optional[int] = None
    creator: Optional[str] = None
    age_rating: Optional[str] = Field(default=None, max_length=10)
    rating: Optional[float] = None
    description: Optional[str] = None
    kind: Literal["Movie", "TV"] = None
    duration: Optional[int] = None
    number_of_seasons: Optional[int] = None
    availability: List[AvailabilityCreate] = []


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
    availability: Optional[List[AvailabilityCreate]] = None
