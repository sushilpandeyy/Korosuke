from fastapi import FastAPI
from app.api import auth 
from app.api import projects
from app.db.base import engine
from app.models import user as user_model

app = FastAPI()

user_model.Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(projects.router, prefix="/project", tags=["project"])