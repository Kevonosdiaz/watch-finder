from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

import models
from database import Base, engine, get_db
from schemas import MediaBase, WatchlistResponse, WatchlistCreate
from core.config import settings

# Initialize the DB, if not already done
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Watch Finder API", docs_url="/docs", redoc_url="/redoc")

# Allow frontend to interact with backend
# NOTE: Can specify allowed ports, methods like GET, etc.
app.add_middleware(CORSMiddleware,
                   settings.ALLOWED_ORIGINS,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


# TODO: Migrate routes to routers directory
@app.get("/")
def home():
    return {"test": "Hello world!"}


@app.post(
    "/api/watchlists",
    response_model=WatchlistResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_watchlist(watchlist: WatchlistCreate):
    # Interact with DB to create new watchlist as specified
    return


# Get all watchlists of given user (for display purposes)
@app.get("/api/watchlists", response_model=list[WatchlistResponse])
def get_watchlists():
    # Get all watchlists for the current user
    return


# NOTE: Can use {} in route to specify path parameter
@app.get("/api/watchlist/{list_id}", response_model=WatchlistResponse)
def get_watchlist(list_id: int):
    # Make use of list_id parameter for lookup
    # Return contents of specified watchlist
    # Return error JSON or HTTPException if not found
    return


# TODO: May want to setup exception handler (may just need to tell frontend about error)

if __name__ == "__main__":
    import uvicorn
    # Web server serves FastAPI on localhost:8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
