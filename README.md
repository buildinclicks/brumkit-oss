# BrumKit - Open Source Edition

**Version 0.1.0** | A production-ready Next.js 15 starter kit with authentication, authorization, and essential features.

> **Release 0.1.0** - February 2026: Dependency updates, version alignment, ESLint 10 migration, and comprehensive testing. See [CHANGELOG.md](CHANGELOG.md) for details.

## Features

### 🔐 Authentication & Security

- Email/password authentication
- JWT-based session management
- Password reset flow with email
- Email verification system
- Account deletion with 30-day grace period
- Redis-based rate limiting

### 👤 User Management

- Complete profile management
- Password change functionality
- Email change with verification
- Avatar upload support
- Username system

### 🔔 Notifications

- Basic notification system
- Mark as read functionality
- Notification types (System, Account, Security)
- Unread count badge

### 🛡️ Authorization

- Role-based access control (RBAC)
- CASL-powered permissions
- Four roles: USER, MODERATOR, ADMIN, SUPER_ADMIN

### 🎨 UI/UX

- Modern UI with shadcn/ui components
- Dark mode support
- Responsive design
- Loading skeletons
- Form validation with React Hook Form + Zod

### 🏗️ Architecture

- Turborepo monorepo
- pnpm workspaces
- Next.js 15 with App Router
- Prisma ORM with PostgreSQL
- Docker development environment
- Type-safe across the stack

## Tech Stack

- **Framework**: Next.js 15.5.12
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: shadcn/ui
- **Authentication**: Auth.js 5.0.0
- **Authorization**: CASL
- **Database**: PostgreSQL + Prisma 6.19.2
- **Forms**: React Hook Form + Zod 3.23.8
- **State**: TanStack Query 5.90.21
- **i18n**: next-intl 4.8.3
- **Testing**: Vitest 4.0.18 + React Testing Library
- **Linting**: ESLint 10.0.0
- **Monorepo**: Turborepo + pnpm 10.0.0

## Quick Start

### Prerequisites

- Node.js >= 20.19.0
- pnpm >= 10.0.0
- PostgreSQL database
- Redis (for rate limiting)
- SMTP server (for emails)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd brumkit
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.development.example .env.development
# Also configure the package/database environment for Prisma:
cp .env.development.example packages/database/.env
```

4. Configure your `.env.development` and `packages/database/.env` files:

```env
# DATABASE
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/broom_kit_dev"

# AUTH.JS
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-1234567890-not-secure!"

# REDIS (Local caching/rate limiting)
REDIS_URL="redis://localhost:6379"

# EMAIL (Local SMTP trapping / Resend)
USE_MAILHOG="true"
MAILHOG_HOST="localhost"
MAILHOG_PORT="1025"
FROM_EMAIL="noreply@brumkit.localhost"

# CRON JOBS
CRON_SECRET="dev-my-local-cron-secret"

# ENVIRONMENT
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

> **Note:** A `.env.production.example` is also provided for your production environment.

5. Run database migrations:

```bash
pnpm --filter @repo/database db:migrate
```

6. Seed the database (optional):

```bash
pnpm --filter @repo/database db:seed
```

7. Start the development server:

```bash
pnpm dev
```

8. Open [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Setup

BrumKit includes a production-ready Docker setup to run the entire stack (PostgreSQL, Redis, Mailhog, and the Next.js app) with a single command.

### 1. Configure Environment Variables

Copy the example Docker environment file:

```bash
cp docker/.env.docker docker/.env
```

Open `docker/.env` and set the required secrets:

- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `CRON_SECRET`: Generate with `openssl rand -base64 32`

### 2. Run the Application

Start all services and view live logs in your terminal:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml up --build
```

If you prefer to run in the background (detached), add the `-d` flag:

```bash
docker compose --env-file docker/.env -f docker/docker-compose.yml up --build -d
```

This will:

- Build the Next.js application image
- Start PostgreSQL (Database)
- Start Redis (Rate limiting/Caching)
- Start Mailhog (Email testing)

### 3. Accessing the Services

| Service     | URL                     | Purpose          |
| ----------- | ----------------------- | ---------------- |
| Next.js App | <http://localhost:3000> | Main application |
| Mailhog UI  | <http://localhost:8025> | View test emails |

### 4. Managing Environment Variables in Docker

To add or modify environment variables for the Docker environment:

1. Edit the `docker/.env` file.
2. If the variable is used in `docker/docker-compose.yml`, ensure it is mapped in the `environment` section of the relevant service.
3. Restart the containers to apply changes:

```bash
docker compose -f docker/docker-compose.yml up -d
```

For more detailed Docker operations, see [docker/README.md](docker/README.md).

## Development

### Available Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start web app only

# Build
pnpm build            # Build all apps
pnpm build:web        # Build web app only

# Testing (80%+ coverage required)
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report

# Code Quality
pnpm lint             # Run ESLint 10
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm type-check       # Run TypeScript type checking

# Database
pnpm --filter @repo/database db:generate      # Generate Prisma Client
pnpm --filter @repo/database db:migrate       # Run Prisma migrations
pnpm --filter @repo/database db:seed          # Seed the database
pnpm --filter @repo/database db:studio        # Open Prisma Studio

# Clean
pnpm clean            # Remove all node_modules and build artifacts
```

### Testing Strategy

BrumKit follows Test-Driven Development (TDD) with strict quality standards:

- **Coverage Requirement**: Minimum 80% coverage across all packages
- **TDD Approach**: Red-Green-Refactor cycle for all new features
- **Testing Framework**: Vitest 4.0.18 + React Testing Library
- **Run Before Commit**: All tests must pass before committing changes

```bash
# Run tests with coverage report
pnpm test:coverage

# Watch mode for development
pnpm test:watch

# Test specific package
pnpm --filter @repo/auth test
```

### Project Structure

```
brumkit/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   ├── auth/                # Authentication & authorization
│   ├── database/            # Prisma schema & client
│   ├── email/               # Email templates & sending
│   ├── rate-limit/          # Redis rate limiting
│   ├── ui/                  # Shared UI components
│   ├── validation/          # Zod schemas
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Utility functions
│   ├── config-eslint/       # ESLint configurations
│   ├── config-typescript/   # TypeScript configurations
│   ├── config-tailwind/     # Tailwind configurations
│   └── config-vitest/       # Vitest configurations
├── docs/                    # Documentation
└── docker/                  # Docker configurations
```

## Documentation

- [CHANGELOG](CHANGELOG.md) - Release notes and version history
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [Release 0.1 Documentation](docs/open-source-version/release-0.1/) - Detailed release notes and milestones

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our TDD approach, code style, and pull request process.

**Key Requirements**:

- Node.js >= 20.19.0
- pnpm >= 10.0.0
- Follow TDD (Test-Driven Development)
- Maintain 80%+ test coverage
- Use ESLint 10 and Prettier

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built and maintained by **BuildInClicks**

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](<repository-url>/issues)
