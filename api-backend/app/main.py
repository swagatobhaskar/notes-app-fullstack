from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import user_routes, note_routes, auth_routes

app = FastAPI()

allowed_origins = [
    "http://localhost:3000",
    # "202.8.112.251", # public ip
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

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
