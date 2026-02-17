# Web - Main Next.js Application

The main full-stack application for React Masters starter kit.

## Features

- ✅ **Authentication**
  - Email/Password login
  - OAuth (Google, GitHub)
  - User registration
  - Protected routes with middleware

- ✅ **Dashboard**
  - User overview and stats
  - Role-based permissions display
  - Account management

- ✅ **Profile Management**
  - Update personal information
  - Username, bio, and avatar
  - Profile validation
  - Change password
  - Change email (with verification)
  - Delete account (with 30-day grace period)

## Documentation

- 📖 [Scheduled Account Deletion](./docs/SCHEDULED_DELETION.md) - Automated cleanup cron job
- 📧 Email notifications and templates
- 🔐 Security and authentication flows

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Auth.js v5
- Prisma ORM
- React Hook Form + Zod

## Getting Started

### Prerequisites

1. PostgreSQL database running (via Docker Compose)
2. All workspace packages installed

### Environment Setup

1. Copy the environment template:

   ```bash
   cp env.template .env.local
   ```

2. Update `.env.local` with your values:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/react_masters
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. (Optional) Add OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

### Running the App

```bash
# From the monorepo root
pnpm dev:web

# Or from this directory
pnpm dev
```

The app will be available at http://localhost:3000

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/web/
├── app/
│   ├── (auth)/                 # Authentication pages (public)
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── forgot-password/   # Password reset request
│   │   ├── reset-password/    # Password reset with token
│   │   ├── verify-email-change/ # Email change verification
│   │   └── layout.tsx         # Auth layout
│   ├── (dashboard)/           # Dashboard pages (protected)
│   │   ├── dashboard/         # Main dashboard
│   │   ├── profile/           # Profile management
│   │   └── layout.tsx         # Dashboard layout
│   ├── actions/               # Server actions
│   │   ├── auth.ts           # Auth actions
│   │   ├── email-change.ts   # Email change flow
│   │   ├── account-deletion.ts # Account deletion
│   │   └── user.ts           # User profile updates
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/ # Auth.js API routes
│   │   ├── cron/
│   │   │   └── cleanup-deleted-accounts/ # Scheduled deletion
│   │   └── user/
│   │       └── profile/       # Profile update endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── providers.tsx          # Client providers
├── docs/                      # Documentation
│   └── SCHEDULED_DELETION.md  # Cron job documentation
├── lib/
│   ├── services/              # Business logic services
│   │   └── account-cleanup.service.ts
│   └── hooks/                 # Custom React hooks
├── middleware.ts              # Route protection
├── vercel.json                # Vercel cron configuration
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Features in Detail

### Authentication Flow

1. **Registration**
   - User fills registration form
   - Password is validated and hashed
   - User is created in database
   - Redirected to login

2. **Login**
   - Email/password authentication
   - OAuth providers (Google, GitHub)
   - JWT session created
   - Redirected to dashboard

3. **Route Protection**
   - Middleware checks authentication
   - Public routes: `/`, `/login`, `/register`
   - Protected routes: `/dashboard`, `/profile`
   - Automatic redirects based on auth state

### Dashboard

- Displays user account details
- Shows role-based permissions
- Quick stats placeholder
- Permission indicators

### Profile Management

- Update name, username, bio
- Profile image URL
- Server-side validation
- Duplicate username check
- Real-time form validation

### Security Features

- **Password Management**
  - Change password with current password verification
  - Password reset via email token
  - Password strength validation
  - Email notifications on password changes

- **Email Management**
  - Change email with verification
  - Notifications to both old and new email
  - Token-based verification system

- **Account Deletion**
  - Soft delete with 30-day grace period
  - Password confirmation required
  - Email notifications
  - Automated permanent deletion after grace period
  - Hybrid data retention (PII deleted, anonymized metrics kept)

- **Rate Limiting**
  - Redis-based rate limiting on sensitive actions
  - Configurable limits per action type
  - Protection against brute force attacks

## Package Integration

This app uses the following workspace packages:

- `@repo/auth` - Authentication & authorization
- `@repo/database` - Prisma client
- `@repo/email` - Email templates and sending
- `@repo/rate-limit` - Redis rate limiting
- `@repo/ui` - shadcn/ui components
- `@repo/validation` - Zod schemas
- `@repo/types` - Shared TypeScript types
- `@repo/utils` - Utility functions
- `@repo/config-*` - Shared configs

## API Routes

### Authentication

#### `POST /api/auth/register`

Register a new user account.

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

### User Management

#### `PATCH /api/user/profile`

Update user profile (requires authentication).

**Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "bio": "Software developer",
  "image": "https://example.com/avatar.jpg"
}
```

### Cron Jobs

#### `GET /api/cron/cleanup-deleted-accounts`

Automated daily job to permanently delete accounts after 30-day grace period.

**Authentication:** Bearer token via `CRON_SECRET` environment variable

**Called by:** Vercel Cron (daily at 2 AM UTC)

**Response:**

```json
{
  "success": true,
  "deletedCount": 2,
  "errors": [],
  "message": "Successfully processed 2 account deletions"
}
```

See [Scheduled Deletion Documentation](./docs/SCHEDULED_DELETION.md) for details.

## Development

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

## Troubleshooting

### "Module not found" errors

Make sure all workspace packages are installed:

```bash
cd ../../
pnpm install
```

### Database connection errors

1. Ensure PostgreSQL is running:

   ```bash
   cd docker
   docker-compose up -d postgres
   ```

2. Check `DATABASE_URL` in `.env.local`

3. Run migrations:
   ```bash
   cd packages/database
   pnpm prisma migrate dev
   ```

### Auth.js errors

1. Ensure `NEXTAUTH_SECRET` is set in `.env.local`
2. For OAuth, ensure provider credentials are configured
3. Check `NEXTAUTH_URL` matches your development URL

## Next Steps

- [ ] Add article management (create, edit, delete)
- [ ] Implement TipTap rich text editor
- [ ] Add social features (follows, bookmarks, reactions)
- [ ] Implement notifications
- [ ] Add user search and discovery
- [ ] Create admin dashboard

## License

MIT
