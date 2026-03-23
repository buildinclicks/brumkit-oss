# Docker Services for BrumKit

This directory contains Docker Compose configuration for local development and production-like services.

## 🚀 Quick Start

1. **Configure environment**:

   ```bash
   cp docker/.env.docker docker/.env
   ```

   Then edit `docker/.env` to set your secrets (`NEXTAUTH_SECRET`, `CRON_SECRET`).

2. **Start all services**:

   ```bash
   docker compose -f docker/docker-compose.yml up --build -d
   ```

3. **Check status**:

   ```bash
   docker compose -f docker/docker-compose.yml ps
   ```

## ⚙️ Configuration & Environment Variables

The Docker setup uses a `.env` file located in the `docker/` directory to manage service configurations.

### Adding New Environment Variables

To add a new environment variable to the application in Docker:

1. **Add to `docker/.env`**: Define the variable in the `.env` file.

   ```env
   MY_NEW_VAR=some_value
   ```

2. **Map in `docker-compose.yml`**: Add the variable to the `environment` section of the `web` service.

   ```yaml
   web:
     environment:
       MY_NEW_VAR: ${MY_NEW_VAR}
   ```

3. **Apply changes**: Restart the containers.

   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```

---

## 📦 Services

### PostgreSQL (Database) ✅ REQUIRED

- **Port**: 5432
- **Used By**: Main app, Prisma
- **Env**: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/react_masters`

### Redis (Rate Limiting) ✅ RECOMMENDED

- **Port**: 6379
- **Auto-Used**: In development (`NODE_ENV=development`)
- **Fallback**: Upstash in production
- **Env**: `REDIS_URL=redis://localhost:6379`

**Benefits**: Free local development, faster, offline support

### Mailhog (Email Testing) ✅ RECOMMENDED

- **SMTP**: 1025
- **Web UI**: <http://localhost:8025>
- **Auto-Used**: When no `RESEND_API_KEY` set
- **Fallback**: Resend in production

---

## 🎯 Recommended Setup

```powershell
# Full local development (recommended)
docker compose -f docker/docker-compose.yml up -d postgres redis mailhog
```

This gives you:

- ✅ Complete offline development
- ✅ No external API dependencies
- ✅ Faster iteration

---

## 📋 Common Commands

```powershell
# Start services
docker compose -f docker/docker-compose.yml up -d

# Stop services
docker compose -f docker/docker-compose.yml stop

# Restart
docker compose -f docker/docker-compose.yml restart

# View logs
docker compose -f docker/docker-compose.yml logs -f

# Check status
docker compose -f docker/docker-compose.yml ps
```

---

## 🔍 Redis Commands

```powershell
# View all keys
docker compose -f docker/docker-compose.yml exec redis redis-cli KEYS "*"

# Check rate limits
docker compose -f docker/docker-compose.yml exec redis redis-cli KEYS "ratelimit:*"

# Clear all data
docker compose -f docker/docker-compose.yml exec redis redis-cli FLUSHALL
```

---

## 📧 Mailhog

**Web UI**: <http://localhost:8025>

View all captured emails, test templates, check HTML/text versions.

---

## 🗂️ Data Persistence

All data survives container restarts via Docker volumes:

- `rm-postgres-data` - Database
- `rm-redis-data` - Rate limits

### Reset All Data

```powershell
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

---

## 🚨 Troubleshooting

### Services Won't Start

1. Check Docker Desktop is running
2. Check ports: `netstat -ano | findstr "5432 6379 1025 8025"`
3. View logs: `docker compose -f docker/docker-compose.yml logs`

### Redis Not Working

```powershell
# Test connection
docker compose -f docker/docker-compose.yml exec redis redis-cli ping
# Should return: PONG
```

Look for app log: `📦 Using local Redis for rate limiting` ✅

### Mailhog Not Capturing

1. Check UI: <http://localhost:8025>
2. Verify `NODE_ENV=development`
3. Verify `RESEND_API_KEY` is empty

Look for app log: `📧 Using Mailhog for email` ✅

---

## 🌐 Web Interfaces

| Service     | URL                     | Purpose          |
| ----------- | ----------------------- | ---------------- |
| Mailhog UI  | <http://localhost:8025> | View test emails |
| Next.js App | <http://localhost:3000> | Main application |

---

For detailed documentation, see the original `docker/README.md` in git history.
