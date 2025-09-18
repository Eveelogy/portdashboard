# Backend Dockerfile (Combined with Frontend)
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend ./
RUN npm run build

FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-build /frontend/dist ./static
EXPOSE 9595
CMD ["python", "app.py"]
