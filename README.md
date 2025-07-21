# Full-Stack Notes App
Made with **FastAPI v0.115.12** and **Next.js v15.3.2**, with **Tiptap v2.12.0** Rich Text Editor.
### API Documentation at: `http://127.0.0.1:8000/docs`

Run FastAPI in production with Uvicorn: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

Run the Docker Compose with nginx: `docker compose up --build`; and acces the frontend at `http://localhost/`.
Shut down and remove containers with: `docker compose down --volumes --remove-orphans`.


## Features
- Multi-tenant
- Folders to organize notes
- JWT authentication
- CSRF validation (for samesite="none")

## Sample users:

| Email | Password |
|:-------:|----------|
| john.doe@example.net | aBcD78%JoHn@ |
| jason.duval@lol.idk | 12345!AbCdE#hUH |


## Containerization
### FastAPI
- Define the `Dockerfile` and `.dockerignore` files
- Build the docker image with `docker build -t notes-api .`
- Run the image as a container with `docker run --env-file .env -p 80:80 notes-api`
- Open `http://0.0.0.0:80/` on the browser
  
### Next.js
- Define the `Dockerfile` and `.dockerignore` files
- Build the docker image with `docker build -t notes-frontend .`
- Run the image as a container with `docker run --env-file .env -p 80:80 notes-frontend`
- Open `http://0.0.0.0:80/` on the browser

Setup docker compose with nginx to avoid port issues between backend and frontend.
