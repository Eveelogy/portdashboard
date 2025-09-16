# Port Dashboard

A Dockerized dashboard for monitoring all ports currently used by your Docker containers. Includes a sortable frontend and a backend that can auto-generate or update port data from live Docker info.

## Features
- Sortable, filterable dashboard for all container ports
- CSV import/export
- Auto-fetches live Docker port info and updates CSV
- Easy deployment with Docker Compose

## Project Structure
```
portdashboard/
├── backend/      # Flask backend, Docker API integration, CSV file
│   ├── app.py
│   ├── ports.csv
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/     # Vite/React frontend dashboard
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
```

## Quick Start
1. Clone the repo:
   ```sh
   git clone https://github.com/yourusername/portdashboard.git
   cd portdashboard
   ```
2. Build and run with Docker Compose:
   ```sh
   docker-compose build
   docker-compose up -d
   ```
3. Access the dashboard:
   - Frontend: `http://localhost:5959`
   - Backend API: `http://localhost:9595`

## Customization
- Change exposed ports in `docker-compose.yml` as needed.
- Add more filters or features in the frontend React code.

## Updating
- Pull the latest code and run `docker-compose up -d --build` to update containers.

## License
MIT
