from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Using pymysql as the MySQL driver
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql:///watchfinder"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={},
)

# Create db for first time only
if not database_exists(engine.url):
    create_database(engine.url)

# Factory for creating database "sessions" for each db transaction
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# Provide sessions to API routes, and provides automatic cleanup upon error/finish
def get_db():
    with SessionLocal() as db:
        yield db
