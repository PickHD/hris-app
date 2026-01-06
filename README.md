# HRIS App

A modern, full-stack Human Resource Information System with a React frontend and Go backend.

## Quick Start

**Prerequisites:** Docker and Docker Compose installed

```bash
# Clone the repository
git clone <repository-url>
cd hris-app

# Copy environment template
cp .env.example .env

# Start all services
docker compose up -d --build
```

**Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8081
- Health Check: http://localhost:8081/health

**Stop services:**
```bash
docker compose down
```

## Tech Stack

### Frontend
- React 19.2.0 + TypeScript 5.9.3
- Vite 7.2.4
- TailwindCSS 3.4.17
- TanStack Query
- Radix UI

### Backend
- Go 1.25.1
- Echo v4
- MySQL 8.0 + GORM
- MinIO (S3-compatible storage)
- Zap logging

## Features

- Secure authentication with JWT
- File upload and management
- Database migrations
- Clean architecture
- Docker-based deployment
- Responsive UI with dark mode

## Project Structure

```
hris-app/
├── backend/         # Go backend API
├── frontend/        # React frontend application
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Available Commands

```bash
make help          # Show all commands
make run-docker    # Run with Docker
make build         # Build both services
make run           # Run both locally
make run-be        # Run backend only
make run-fe        # Run frontend only
make migrate-up    # Run database migrations
```

## Local Development

**Backend:**
```bash
cd backend
go mod download
go run cmd/api/main.go
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

## Documentation

- [Backend Documentation](./backend/README.md) - Architecture, API, and development guide
- [Frontend Documentation](./frontend/README.md) - Components, styling, and setup

## License

[MIT License](https://github.com/PickHD/hris-app/blob/main/LICENSE)
