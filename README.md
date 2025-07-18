# Full-Stack Notes App
Made with **FastAPI v0.115.12** and **Next.js v15.3.2**, with **Tiptap v2.12.0** Rich Text Editor.

### API Documentation at: `http://127.0.0.1:8000/docs`
### Next.js home page: `http://127.0.0.1:3000`

## Features
- Multi-tenant
- Folders to organize notes
- JWT authentication
- CSRF validation (for samesite="none")

## Sample users:

| Email | Password |
|:-------:|----------|
|john.doe@example.net| aBcD78%JoHn@|
|jason.duval@lol.idk|12345!AbCdE#hUH|
|carl.johnson@lol.idk|12345!cJinAnDrEaS#|
|sweet.johnson@lol.idk|12345!SJinAnDrEaS#|
|catalina@lol.idk|kata12345!SJinAnDrEaS#|

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
