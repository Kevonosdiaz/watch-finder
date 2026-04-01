from pydantic import BaseModel, ConfigDict, Field

# Specify attributes & their types, so FastAPI can validate
# responses given from API routes ('response_model' is passed)

# TODO: Adjust type hints and Field constraints to match database's constraints

# Attributes for a user
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str = Field(max_length=255)

# What a user provides when signing up
class UserCreate(UserBase):
    password: str

# Response for a user
class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

# Attributes for a media title
class MediaBase(BaseModel):
    id: int
    title: str = Field(max_length=255)
    release_year: int
    creator: str
    age_rating: str = Field(max_length=255)
    rating: float
    description: str

# Attributes for a show
class Shows(MediaBase):
    number_of_seasons: int

# Attributes for a movie
class Movies(MediaBase):
    duration: int

# Response for a media title
class MediaResponse(MediaBase):
    model_config = ConfigDict(from_attributes=True)

# TODO: Update constraints for date to different type
# Shared attributes used when needing to create/return watchlist
class WatchlistBase(BaseModel):
    name: str


# What we need specifically to create a watchlist from frontend side
class WatchlistCreate(WatchlistBase):
    pass
   # email: str = Field(max_length=255)
   # id: int


# What to include when returning a watchlist to the frontend
class WatchlistResponse(WatchlistBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date_created: str

# Attributes for watchdata
class WatchdataBase(BaseModel):
    watchdata_id: int
    completion_status: str      
    start_date: str
    end_date: str
    personal_rating: int = Field(ge=1, le=5)

# What a user provides when adding watchdata to a media title
class WatchdataCreate(WatchdataBase):
    media_id: int

# Response for watchdata
class WatchdataResponse(WatchdataBase):
    model_config = ConfigDict(from_attributes=True)
    media_id: int