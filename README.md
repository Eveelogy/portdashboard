Everything about this project was made with AI 😂

# 🐳 Port Dashboard

A clean, modern web dashboard for monitoring Docker container ports. Automatically discovers and displays all ports used by your running containers with real-time updates.

![Dashboard Preview](https://img.shields.io/badge/Dashboard-Live-green) ![Docker](https://img.shields.io/badge/Docker-Enabled-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔍 **Auto-Discovery**: Automatically detects Docker container ports on startup
- 📊 **Live Monitoring**: Real-time port status with refresh functionality  
- 🔧 **Filtering**: Advanced filters by protocol, state, process, and container
- 📋 **Sortable Table**: Click column headers to sort data
- 💾 **Dual Export**: Export data as CSV or download complete database
- 🗃️ **Persistent Storage**: SQLite database with volume persistence
- 🚀 **Easy Deployment**: Single container with built-in frontend and backend

## 🚀 Quick Start

### Option 1: Pre-built Image (Recommended)

```bash
# Create data directory for persistence
mkdir data

# Run with Docker Compose
curl -O https://raw.githubusercontent.com/Eveelogy/portdashboard/main/docker-compose.yml
docker compose up -d
```

Access at: **http://localhost:9595**

### Option 2: Local Development

```bash
git clone https://github.com/Eveelogy/portdashboard.git
cd portdashboard
docker compose -f docker-compose.local.yml up -d --build
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Flask Backend  │    │  Docker Socket  │
│   (Port 9595)   │◄──►│   + SQLite DB    │◄──►│   (Containers)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

- **Frontend**: React + TypeScript with modern UI components
- **Backend**: Python Flask API with Docker SDK integration  
- **Database**: SQLite for reliable data persistence
- **Discovery**: Reads container info via Docker socket

## 📁 Project Structure

```
portdashboard/
├── backend/              # Flask API server
│   ├── app.py           # Main application
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile       # Multi-stage build
├── frontend/            # React dashboard
│   ├── src/            # TypeScript source
│   ├── package.json    # Node dependencies
│   └── vite.config.ts  # Build configuration
├── .github/            # GitHub Actions
│   └── workflows/      # Auto-build pipeline
└── data/              # Persistent database storage
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONUNBUFFERED` | `1` | Python output buffering |

### Volumes

| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| `./data` | `/app/data` | SQLite database persistence |
| `/var/run/docker.sock` | `/var/run/docker.sock` | Docker container access |

## 📤 Data Export Options

The dashboard provides two export methods:

- **Export CSV**: Downloads current filtered data as CSV (Excel/Sheets compatible)
- **Export DB**: Downloads complete SQLite database file (for backup/restore)

Use CSV export for data analysis and sharing. Use DB export for complete backups or migrating data between instances.

## 🔄 Updates

Pull the latest version:

```bash
docker compose pull
docker compose up -d
```

For local builds:

```bash
git pull
docker compose up -d --build
```

## 🛠️ Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.9+ (for local backend development)

### Local Development Setup

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend**:
   ```bash
   cd frontend  
   npm install
   npm run dev
   ```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ports` | GET | List all ports |
| `/api/update_ports` | POST | Refresh from Docker |
| `/api/export_db` | GET | Download database file |

## 🐛 Troubleshooting

**Container won't start?**
- Ensure Docker socket is accessible: `ls -la /var/run/docker.sock`
- Check data directory permissions: `chmod 755 ./data`

**No data showing?**
- Verify Docker containers are running: `docker ps`
- Check logs: `docker compose logs`

**Database issues?**
- Remove data directory and restart: `rm -rf data && docker compose up -d`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes  
4. Submit a pull request

---

**Made with ❤️ for Docker enthusiasts**
