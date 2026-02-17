# BrumKit - Open Source Edition

A production-ready Next.js 15 starter kit with authentication, authorization, and essential features.

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

- **Framework**: Next.js 15.5.9
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: shadcn/ui
- **Authentication**: Auth.js 5.0.0
- **Authorization**: CASL
- **Database**: PostgreSQL + Prisma 6.1.0
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query 5.90.16
- **i18n**: next-intl 4.7.0
- **Testing**: Vitest 4.0.16 + React Testing Library
- **Monorepo**: Turborepo + pnpm

## Quick Start

### Prerequisites

- Node.js >= 20.19.0
- pnpm >= 9.0.0
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
cp .env.example .env
```

4. Configure your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brumkit"

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Redis (for rate limiting)
REDIS_URL="redis://localhost:6379"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@yourdomain.com"
```

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

## Development

### Available Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start web app only

# Build
pnpm build            # Build all apps
pnpm build:web        # Build web app only

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm type-check       # Run TypeScript type checking

# Database
pnpm --filter @repo/database db:migrate       # Run Prisma migrations
pnpm --filter @repo/database db:seed          # Seed the database
pnpm --filter @repo/database db:studio        # Open Prisma Studio

# Clean
pnpm clean            # Remove all node_modules and build artifacts
```

### Project Structure

```
broomkit/
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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Built and maintained by **BuildInClicks**

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](<repository-url>/issues)
