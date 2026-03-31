from pydantic import BaseModel, ConfigDict, Field

# Specify attributes & their types, so FastAPI can validate
# responses given from API routes ('response_model' is passed)

# TODO: Adjust type hints and Field constraints to match database's constraints


# Attributes for a media title
class MediaBase(BaseModel):
    id: int
    title: str = Field(max_length=255)
    release_year: int
    creator: str
    age_rating: str = Field(max_length=255)
    rating: float
    description: str


# TODO: Update constraints for date to different type
# Shared attributes used when needing to create/return watchlist
class WatchlistBase(BaseModel):
    name: str


# What we need specifically to create a watchlist from frontend side
class WatchlistCreate(WatchlistBase):
    email: str = Field(max_length=255)
    id: int


# What to include when returning a watchlist to the frontend
class WatchlistResponse(WatchlistBase):
    model_config = ConfigDict(from_attributes=True)
    date_added: str
