FROM python:3.12-slim

# Set environment variables to prevent python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENV ENV=development
ENV SECRET_KEY=ee0c98fb7f8393758783c3478fb7ab0e
ENV DATABASE_URL=sqlite:///./dev.db
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=15
ENV REFRESH_TOKEN_EXPIRE_DAYS=7

WORKDIR /src

# copy the requirements first
# As this file doesn't change often, Docker will detect it and
# use the cache for this step, enabling the cache for the next step too.
COPY ./requirements.txt /src/requirements.txt

# RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt

# Copy the application code to the working directory
COPY . .

# EXPOSE 80

# CMD ["fastapi", "run", "app/main.py", "--port", "80"]  # Don't run this CLI mode, use uvicorn or such ASGI/WSGI

# Run app.py when the container launches
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
