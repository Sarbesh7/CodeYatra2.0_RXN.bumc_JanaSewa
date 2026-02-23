from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url="postgresql://postgres:swikrity@localhost:5432/Janasewa"

engine=create_engine(db_url)

session= sessionmaker(autoflush=False,autocommit=False,bind=engine)


