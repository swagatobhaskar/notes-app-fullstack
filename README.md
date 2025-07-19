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

## _Dockerize Next.js:_
(2025) https://www.slingacademy.com/article/dockerize-nextjs-app-for-production/

(2023) https://www.webhat.in/article/devops/a-step-by-step-guide-to-dockerize-your-next-js-application/

(2025) https://codeparrot.ai/blogs/deploy-nextjs-app-with-docker-complete-guide-for-2025

(2025) https://blog.simplr.sh/posts/next-js-docker-deployment/

(??) https://devspeaks.com/how-to-dockerize-a-next-js-app-and-deploy-it-to-ec2-complete-guide/

(2023) https://towardsserverless.com/articles/dockerize-nextjs-app

(2024) https://dev.to/vorillaz/how-to-dockerize-a-nextjs-app-4e4h

https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env

https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

