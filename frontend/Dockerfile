# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production=false
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npx", "serve", "-s", "dist", "-l", "80"]
