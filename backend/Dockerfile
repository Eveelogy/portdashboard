# Backend Dockerfile (Combined with Frontend)
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build
RUN ls -la && ls -la build/

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
