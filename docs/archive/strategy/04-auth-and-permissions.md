# Authentication and Authorization

## Authentication (Auth.js)

- OAuth: Google, GitHub
- Email/password (hashed)
- Magic link (email)
- Prisma adapter for persistence
- Sessions per Auth.js guidance for Next.js 15

## Authorization (CASL)

- Roles: Super Admin, Admin, Moderator, User
- Action + subject model (e.g., `create Article`, `ban User`, `read Analytics`)
- Enforce in Server Actions/Route Handlers, admin route guards, and UI affordances

### Example subjects

- User, Article, Comment (future), Analytics, Settings, Notification

### Policy outline

- Super Admin: manage all
- Admin: manage users/articles (restrictions possible on deleting super admin)
- Moderator: moderate content, bans, own articles
- User: own profile, own articles
