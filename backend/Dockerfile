# Backend Dockerfile (Combined with Frontend)
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build
RUN ls -la && ls -la dist/

FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
# Create static directory
RUN mkdir -p ./static
# Copy frontend build output
COPY --from=frontend-build /frontend/dist/ ./static/
EXPOSE 9595
CMD ["python", "app.py"]
