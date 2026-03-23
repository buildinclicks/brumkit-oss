# Task 1.10: Docker Compose Setup (Learning Path)

**Status**: ✅ Completed  
**Date**: 2026-01-11  
**Phase**: Foundation

---

## 📋 Task Description

Set up Docker Compose configuration for local development with all required services:

- PostgreSQL (database)
- Redis (cache, sessions, job queues)
- Mailhog (email testing)

This task follows a **learning path approach** to help understand Docker concepts step by step.

---

## ✅ What Was Implemented

### 1. Docker Compose File Structure

Created `docker/docker-compose.yml` with 4 services:

```yaml
services:
  postgres: # PostgreSQL 16 database
  redis: # Redis 7 cache
  mailhog: # Email testing tool

volumes:
  postgres_data: # Persistent database storage
  redis_data: # Persistent cache storage
```

### 2. PostgreSQL Configuration

- **Image**: `postgres:16-alpine`
- **Port**: 5432
- **Credentials**:
  - User: `postgres`
  - Password: `postgres`
  - Database: `react_masters`
- **Volume**: `rm-postgres-data` → `/var/lib/postgresql/data`
- **Health Check**: `pg_isready -U postgres`

### 3. Redis Configuration

- **Image**: `redis:7-alpine`
- **Port**: 6379
- **Volume**: `rm-redis-data` → `/data`
- **Health Check**: `redis-cli ping`

### 5. Mailhog Configuration

- **Image**: `mailhog/mailhog:latest`
- **Ports**:
  - 1025 → SMTP (for sending emails)
  - 8025 → Web UI (for viewing emails)
- **Health Check**: `wget --spider http://localhost:8025`
- **Web UI**: http://localhost:8025

### 6. Documentation

Created `docker/README.md` with:

- Service descriptions
- Common Docker commands
- Data persistence info
- Web interface access
- Troubleshooting guide

---

## 🧪 Tests & Verification

### Manual Testing Performed

#### 1. PostgreSQL Tests

```powershell
# Start PostgreSQL
docker compose -f docker/docker-compose.yml up -d postgres

# Check status (should show "healthy")
docker compose -f docker/docker-compose.yml ps

# Test SQL query
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -c "SELECT version();"

# List databases (should show "react_masters")
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -c "\l"
```

**Result**: ✅ PostgreSQL 16.11 running, database created, queries work

#### 2. Redis Tests

```powershell
# Start Redis
docker compose -f docker/docker-compose.yml up -d redis

# Test connection
docker compose -f docker/docker-compose.yml exec redis redis-cli ping
# Expected: PONG

# Store and retrieve data
docker compose -f docker/docker-compose.yml exec redis redis-cli SET test:key "Hello from React Masters!"
docker compose -f docker/docker-compose.yml exec redis redis-cli GET test:key
# Expected: Hello from React Masters!

# Get server info
docker compose -f docker/docker-compose.yml exec redis redis-cli INFO server
```

**Result**: ✅ Redis 7.4.7 running, data persistence working

#### 4. Mailhog Tests

```powershell
# Start Mailhog
docker compose -f docker/docker-compose.yml up -d mailhog

# Open Web UI
Start-Process http://localhost:8025
```

**Result**: ✅ Mailhog running, UI accessible at http://localhost:8025

#### 5. All Services Together

```powershell
# Start all services
docker compose -f docker/docker-compose.yml up -d

# Check all statuses
docker compose -f docker/docker-compose.yml ps
# All should show "(healthy)"
```

**Result**: ✅ All 4 services running healthy

---

## 📦 Dependencies Installed

No npm packages installed. Only Docker images pulled:

- `postgres:16-alpine` (~76 MB)
- `redis:7-alpine` (~12 MB)
- `mailhog/mailhog:latest` (~30 MB)

---

## 🎓 Key Concepts Learned

### Docker Basics

1. **Images** - Templates for containers (like blueprints)
2. **Containers** - Running instances of images
3. **Volumes** - Persistent storage (data survives container restarts)
4. **Networks** - Communication between containers
5. **Health Checks** - Automatic service health monitoring

### Docker Compose Concepts

1. **Services** - Containers defined in `docker-compose.yml`
2. **Ports** - Mapping host:container ports
3. **Environment Variables** - Configuration passed to containers
4. **Commands** - Override container startup commands
5. **Dependencies** - Service startup order

### Common Commands

```powershell
# Start services
docker compose up -d [service]

# Stop services
docker compose stop

# Remove containers
docker compose down

# Remove containers + volumes (⚠️ deletes data)
docker compose down -v

# View logs
docker compose logs [service]

# Check status
docker compose ps

# Execute command in container
docker compose exec [service] [command]
```

---

## 🔍 How to Verify

### 1. Check All Services Running

```powershell
cd D:\PRODUCTS\react-masters
docker compose -f docker/docker-compose.yml ps
```

**Expected Output**:

```
NAME          STATUS
rm-postgres   Up (healthy)
rm-redis      Up (healthy)
rm-mailhog    Up (healthy)
```

### 2. Test PostgreSQL Connection

```powershell
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -c "SELECT version();"
```

**Expected**: Version output showing PostgreSQL 16.x

### 3. Test Redis Connection

```powershell
docker compose -f docker/docker-compose.yml exec redis redis-cli ping
```

**Expected**: `PONG`

### 4. Access Web Interfaces

Open in browser:

- **Mailhog UI**: http://localhost:8025

---

## 📝 Notes & Considerations

### Data Persistence

- All data stored in named volumes
- Survives container restarts
- Use `docker compose down -v` to delete all data

### Port Conflicts

If ports are already in use, you'll see errors. Check with:

```powershell
netstat -ano | findstr "5432 6379 9000 9001 1025 8025"
```

### Docker Desktop Required

- Must be running before starting services
- Windows: Uses WSL2 backend
- Check status: `docker info`

### Development vs Production

This setup is for **local development only**:

- Default credentials (insecure)
- No SSL/TLS
- All ports exposed
- Single-instance services

For production, we'll use:

- AWS RDS (PostgreSQL)
- AWS ElastiCache (Redis)
- AWS S3 (file storage)
- AWS SES or Resend (emails)

### Network Communication

Services can talk to each other using service names:

- `postgres:5432`
- `redis:6379`
- `mailhog:1025`

This is important when Next.js apps run inside Docker.

### Strategy Changes

- ❌ **Removed Meilisearch** - Not needed for this project
- Updated strategy documents:
  - `docs/strategy/02-tech-stack.md`
  - `docs/strategy/06-realtime-jobs-search.md` (renamed from `06-realtime-jobs-search.md`)
  - `docs/strategy/10-phases-and-tasks.md`

---

## 🎯 Next Steps

With Docker services ready, we can proceed to:

1. **Task 1.11+**: Continue Phase 1 foundation tasks
   - Husky + lint-staged
   - Vitest setup
   - Shared packages

2. **Phase 2**: Database & Auth
   - Prisma schema
   - Migrations
   - Auth.js setup
   - Connect to PostgreSQL

---

## 📚 Additional Resources

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose Reference**: https://docs.docker.com/compose/
- **Learning Guide**: `docs/docker-learning-guide.md`
- **Service Commands**: `docker/README.md`

---

## ✅ Task Complete!

All Docker services are running and verified. Ready for Phase 1 continuation.

**Files Modified**:

- `docker/docker-compose.yml` (created)
- `docker/README.md` (created)
- `docs/strategy/02-tech-stack.md` (updated)
- `docs/strategy/06-realtime-jobs-search.md` (updated)
- `docs/strategy/10-phases-and-tasks.md` (updated)
- `docs/development/phase-1-foundation/task-1.10-docker-compose-setup.md` (this file)
