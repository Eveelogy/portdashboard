# Backend Dockerfile (Combined with Frontend)
# Build args for GitHub access
ARG GITHUB_TOKEN
ARG REPO_URL

# Stage 1: Clone repo (if building from Git)
FROM alpine/git AS git-clone
ARG GITHUB_TOKEN
ARG REPO_URL
RUN if [ -n "$GITHUB_TOKEN" ] && [ -n "$REPO_URL" ]; then \
        git clone https://${GITHUB_TOKEN}@${REPO_URL#https://} /repo; \
    fi

# Stage 2: Frontend build
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
# Copy from git clone if available, otherwise from build context
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 3: Final backend
FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
# Create static directory
RUN mkdir -p ./static
# Copy frontend build output (it's in build/ not dist/)
COPY --from=frontend-build /frontend/build/ ./static/
EXPOSE 9595
CMD ["python", "app.py"]
