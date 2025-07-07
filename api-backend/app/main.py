from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import (
    user_routes, note_routes, auth_routes, tag_routes, folder_routes
)

app = FastAPI()

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(note_routes.router)
app.include_router(tag_routes.router)
app.include_router(folder_routes.router)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
