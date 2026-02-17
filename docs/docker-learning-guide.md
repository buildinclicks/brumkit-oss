# Docker Learning Guide - React Masters

A beginner-friendly guide to understanding Docker in the context of this project.

## 🐳 What is Docker?

Docker is a platform that packages applications and their dependencies into **containers**. Think of it like this:

**Without Docker:**

- Install PostgreSQL on your machine (version conflicts, OS-specific setup)
- Install Redis (different for Windows/Mac/Linux)
- Configure each service manually
- "It works on my machine" problems

**With Docker:**

- Define services in a YAML file
- Run `docker compose up`
- Everything works consistently across all machines
- Easy to reset/clean up

---

## 🧩 Core Concepts

### 1. Images (Blueprints)

An **image** is a read-only template with instructions for creating a container.

**Example:**

```yaml
image: postgres:16-alpine
```

This means:

- Use PostgreSQL version 16
- Built on Alpine Linux (lightweight)
- Downloaded from Docker Hub (public registry)

**Think of it as**: A class in programming

### 2. Containers (Instances)

A **container** is a running instance of an image.

**Example:**

```yaml
container_name: rm-postgres
```

**Think of it as**: An object/instance of a class

### 3. Volumes (Persistent Storage)

**Problem**: When a container stops, its data is lost!

**Solution**: Volumes store data outside the container.

**Example:**

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

This means:

- `postgres_data` = Named volume on your machine
- Maps to `/var/lib/postgresql/data` inside container
- Data persists even if container is deleted

**Think of it as**: A database file on your hard drive

### 4. Ports (Exposing Services)

Containers are isolated. To access them, we map ports.

**Example:**

```yaml
ports:
  - '5432:5432'
```

This means:

- Left side (5432) = Port on YOUR machine
- Right side (5432) = Port INSIDE container
- You can connect to `localhost:5432` to reach PostgreSQL

**Think of it as**: Opening a door for communication

### 5. Environment Variables (Configuration)

Pass configuration to containers:

**Example:**

```yaml
environment:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_DB: react_masters
```

**Think of it as**: Constructor parameters for a class

### 6. Health Checks (Is It Ready?)

Some services take time to start. Health checks verify readiness.

**Example:**

```yaml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  interval: 10s
  timeout: 5s
  retries: 5
```

This means:

- Every 10 seconds, check if PostgreSQL is ready
- Run the command `pg_isready -U postgres`
- If it fails, retry up to 5 times

### 7. Networks (Container Communication)

Containers can talk to each other by container name.

**Example:**

```yaml
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/react_masters"
^^^^^^^^
Container name (not localhost)
```

Inside Docker network, containers use container names as hostnames.

---

## 🏗️ Docker Compose Structure

```yaml
services: # Define what to run
  postgres: # Service name
    image: ... # What image to use
    ports: ... # Expose ports
    volumes: ... # Persist data
    environment: ... # Configuration

volumes: # Define named storage
  postgres_data: # Volume name
```

---

## 📝 Essential Commands

### Starting Services

```bash
# Start all services
docker compose -f docker/docker-compose.yml up -d

# Start specific service
docker compose -f docker/docker-compose.yml up -d postgres

# Start with logs (see what's happening)
docker compose -f docker/docker-compose.yml up postgres
```

`-d` = detached mode (runs in background)

### Checking Status

```bash
# List running containers
docker compose -f docker/docker-compose.yml ps

# View logs
docker compose -f docker/docker-compose.yml logs postgres

# Follow logs (real-time)
docker compose -f docker/docker-compose.yml logs -f postgres

# Check health
docker ps
```

### Stopping Services

```bash
# Stop all services (keeps data)
docker compose -f docker/docker-compose.yml down

# Stop and remove volumes (deletes data - fresh start)
docker compose -f docker/docker-compose.yml down -v

# Restart a service
docker compose -f docker/docker-compose.yml restart postgres
```

### Debugging

```bash
# Execute command inside container
docker compose -f docker/docker-compose.yml exec postgres psql -U postgres -d react_masters

# Access container shell
docker compose -f docker/docker-compose.yml exec postgres sh

# View container details
docker inspect rm-postgres
```

---

## 🎯 Our Services Explained

### PostgreSQL (Database)

- **Purpose**: Store all app data (users, articles, etc.)
- **Port**: 5432
- **Access**: `postgresql://postgres:postgres@localhost:5432/react_masters`
- **Volume**: `postgres_data` (persists database files)

### Redis (Cache & Queues)

- **Purpose**: Sessions, caching, background job queues
- **Port**: 6379
- **Access**: `redis://localhost:6379`
- **Volume**: `redis_data` (persists cache)

### Meilisearch (Search Engine)

- **Purpose**: Full-text article search
- **Port**: 7700
- **Access**: `http://localhost:7700`
- **Volume**: `meilisearch_data` (persists search indexes)

### MinIO (S3-Compatible Storage)

- **Purpose**: Local S3 for development (file uploads)
- **Ports**: 9000 (API), 9001 (Web UI)
- **Access**: `http://localhost:9000` (API), `http://localhost:9001` (UI)
- **Volume**: `minio_data` (persists files)

### Mailhog (Email Testing)

- **Purpose**: Catch all sent emails (see them in browser)
- **Ports**: 1025 (SMTP), 8025 (Web UI)
- **Access**: `http://localhost:8025` (see emails)
- **No volume needed** (emails are temporary)

---

## 🔧 Troubleshooting

### "Cannot connect to Docker daemon"

- Start Docker Desktop
- Wait for it to fully start (green icon in tray)

### "Port already in use"

- Another service is using that port
- Stop the other service or change the port mapping

### "Volume permission denied"

- Docker Desktop needs proper permissions
- Try restarting Docker Desktop

### "Container unhealthy"

- Check logs: `docker compose logs <service-name>`
- Service might be starting up (wait 10-30 seconds)

---

## 📚 Learning Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

## 🎓 What You'll Learn

By the end of this task:

- ✅ How to write a docker-compose.yml file
- ✅ How to start/stop services
- ✅ How to check if services are healthy
- ✅ How to view logs
- ✅ How to persist data with volumes
- ✅ How containers communicate
- ✅ How to connect your Next.js app to Docker services
- ✅ How to reset everything for a fresh start

---

Ready? Let's continue! 🚀
