# Prisma Schema Design - Complete Specification

This document details the complete database schema for the React Masters starter kit.

---

## 🎯 Design Principles

1. **Auth.js Compatible**: Follows Auth.js Prisma adapter requirements
2. **UUID-based**: All IDs use `cuid()` for flexibility and security
3. **Timestamps**: All models have `createdAt` and `updatedAt`
4. **Soft Deletes**: Where applicable (Articles, Comments)
5. **Indexes**: On all foreign keys and frequently queried fields
6. **Relations**: Bidirectional, explicit naming

---

## 📊 Database Models (11 Total)

### 1. User Model

**Purpose**: Core user entity for authentication and profile

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  username      String?   @unique
  image         String?
  bio           String?   @db.Text
  role          UserRole  @default(USER)

  // Auth.js relations
  accounts      Account[]
  sessions      Session[]

  // Content relations
  articles      Article[]
  comments      Comment[]
  reactions     Reaction[]
  bookmarks     Bookmark[]

  // Social relations
  following     Follow[]  @relation("UserFollowing")
  followers     Follow[]  @relation("UserFollowers")

  // Notifications
  notifications Notification[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([username])
  @@index([role])
  @@map("users")
}
```

**Fields Explanation**:

- `id`: Unique identifier (cuid)
- `name`: Display name (optional during registration)
- `email`: Required, unique
- `emailVerified`: Timestamp when email was verified (Auth.js)
- `username`: Optional unique username (for public profile URLs)
- `image`: Avatar URL (from OAuth or uploaded)
- `bio`: User biography (long text)
- `role`: User role (enum: SUPER_ADMIN, ADMIN, MODERATOR, USER)

---

### 2. Account Model (Auth.js Required)

**Purpose**: OAuth provider accounts linked to users

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // oauth, email, credentials
  provider          String  // google, github, email
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}
```

**Fields Explanation**:

- Standard Auth.js fields for OAuth providers
- `type`: "oauth" for Google/GitHub, "email" for email/password
- `provider`: "google", "github", "email", "magic_link"
- Stores OAuth tokens for API access

---

### 3. Session Model (Auth.js Required)

**Purpose**: User sessions for authentication

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
  @@index([expires])
  @@map("sessions")
}
```

**Fields Explanation**:

- `sessionToken`: Unique token for session identification
- `expires`: Session expiration timestamp
- Auto-cleanup of expired sessions via index

---

### 4. VerificationToken Model (Auth.js Required)

**Purpose**: Email verification and magic link tokens

```prisma
model VerificationToken {
  identifier String   // email address
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@index([expires])
  @@map("verification_tokens")
}
```

**Fields Explanation**:

- `identifier`: Email address
- `token`: Unique verification token
- `expires`: Token expiration
- Used for email verification and magic links

---

### 5. Article Model

**Purpose**: Blog posts/articles with rich content

```prisma
model Article {
  id            String    @id @default(cuid())
  title         String    @db.VarChar(255)
  slug          String    @unique
  content       String    @db.Text // TipTap JSON content
  excerpt       String?   @db.VarChar(500)
  coverImage    String?

  // Status
  published     Boolean   @default(false)
  publishedAt   DateTime?

  // SEO
  metaTitle     String?   @db.VarChar(60)
  metaDescription String? @db.VarChar(160)

  // Author
  authorId      String
  author        User      @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Relations
  tags          ArticleTag[]
  comments      Comment[]
  reactions     Reaction[]
  bookmarks     Bookmark[]

  // Soft delete
  deletedAt     DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([authorId])
  @@index([slug])
  @@index([published])
  @@index([publishedAt])
  @@index([deletedAt])
  @@map("articles")
}
```

**Fields Explanation**:

- `title`: Article title (max 255 chars)
- `slug`: URL-friendly unique identifier
- `content`: TipTap JSON content (stored as text)
- `excerpt`: Short description for previews
- `coverImage`: URL to cover image
- `published`: Draft vs published status
- `publishedAt`: Publication timestamp
- `metaTitle`, `metaDescription`: SEO fields
- `deletedAt`: Soft delete timestamp (null = not deleted)

---

### 6. Tag Model

**Purpose**: Article categorization and filtering

```prisma
model Tag {
  id        String      @id @default(cuid())
  name      String      @unique @db.VarChar(50)
  slug      String      @unique @db.VarChar(50)
  color     String?     @db.VarChar(7) // Hex color code

  articles  ArticleTag[]

  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([slug])
  @@map("tags")
}
```

**Fields Explanation**:

- `name`: Display name (e.g., "JavaScript")
- `slug`: URL-friendly version (e.g., "javascript")
- `color`: Optional hex color for UI (#FF5733)

---

### 7. ArticleTag Model (Join Table)

**Purpose**: Many-to-many relationship between Articles and Tags

```prisma
model ArticleTag {
  id        String   @id @default(cuid())
  articleId String
  tagId     String

  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([articleId, tagId])
  @@index([articleId])
  @@index([tagId])
  @@map("article_tags")
}
```

**Fields Explanation**:

- Explicit join table with its own ID
- Prevents duplicate tag assignments
- Cascade delete when article or tag is deleted

---

### 8. Follow Model

**Purpose**: User follow/following relationships

```prisma
model Follow {
  id          String   @id @default(cuid())
  followerId  String   // User who is following
  followingId String   // User being followed

  follower    User     @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
  @@map("follows")
}
```

**Fields Explanation**:

- `followerId`: The user doing the following
- `followingId`: The user being followed
- Unique constraint prevents duplicate follows
- Both indexes for efficient queries (followers list, following list)

---

### 9. Bookmark Model

**Purpose**: Users can bookmark articles for later reading

```prisma
model Bookmark {
  id        String   @id @default(cuid())
  userId    String
  articleId String

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, articleId])
  @@index([userId])
  @@index([articleId])
  @@map("bookmarks")
}
```

**Fields Explanation**:

- Simple join between User and Article
- Unique constraint prevents duplicate bookmarks
- Ordered by creation date (most recent first)

---

### 10. Reaction Model

**Purpose**: User reactions to articles (likes, hearts, etc.)

```prisma
model Reaction {
  id        String       @id @default(cuid())
  userId    String
  articleId String
  type      ReactionType @default(LIKE)

  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article      @relation(fields: [articleId], references: [id], onDelete: Cascade)

  createdAt DateTime     @default(now())

  @@unique([userId, articleId, type])
  @@index([userId])
  @@index([articleId])
  @@index([type])
  @@map("reactions")
}
```

**Fields Explanation**:

- `type`: Enum for different reaction types (LIKE, LOVE, CELEBRATE, etc.)
- User can have one reaction of each type per article
- Easy to count reactions by type

---

### 11. Comment Model

**Purpose**: Comments on articles with nested replies

```prisma
model Comment {
  id        String    @id @default(cuid())
  content   String    @db.Text
  articleId String
  userId    String
  parentId  String?   // For nested replies

  article   Article   @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")

  // Soft delete
  deletedAt DateTime?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([articleId])
  @@index([userId])
  @@index([parentId])
  @@index([deletedAt])
  @@map("comments")
}
```

**Fields Explanation**:

- `content`: Comment text (long text)
- `parentId`: Optional reference to parent comment (for replies)
- Self-referential relation for nested comments
- Soft delete via `deletedAt`

---

### 12. Notification Model

**Purpose**: System notifications for users

```prisma
model Notification {
  id         String           @id @default(cuid())
  recipientId String
  type       NotificationType
  title      String           @db.VarChar(255)
  message    String           @db.Text
  link       String?          @db.VarChar(500)
  readAt     DateTime?

  recipient  User             @relation(fields: [recipientId], references: [id], onDelete: Cascade)

  createdAt  DateTime         @default(now())

  @@index([recipientId])
  @@index([readAt])
  @@index([createdAt])
  @@map("notifications")
}
```

**Fields Explanation**:

- `type`: Enum for notification types (NEW_FOLLOWER, NEW_COMMENT, etc.)
- `title`: Short notification title
- `message`: Detailed notification message
- `link`: Optional link to related content
- `readAt`: Null = unread, timestamp = read

---

## 🎨 Enums

### UserRole

```prisma
enum UserRole {
  SUPER_ADMIN  // Full system access
  ADMIN        // Admin panel access
  MODERATOR    // Content moderation
  USER         // Regular user
}
```

### ReactionType

```prisma
enum ReactionType {
  LIKE         // 👍 Like
  LOVE         // ❤️ Love
  CELEBRATE    // 🎉 Celebrate
  INSIGHTFUL   // 💡 Insightful
  CURIOUS      // 🤔 Curious
}
```

### NotificationType

```prisma
enum NotificationType {
  NEW_FOLLOWER      // Someone followed you
  NEW_COMMENT       // Comment on your article
  NEW_REPLY         // Reply to your comment
  NEW_REACTION      // Reaction to your article
  ARTICLE_PUBLISHED // Article you follow published
  MENTION           // You were mentioned
  SYSTEM            // System notification
}
```

---

## 📈 Indexes Summary

**Performance-critical indexes**:

- User: email, username, role
- Article: authorId, slug, published, publishedAt, deletedAt
- Tag: slug
- ArticleTag: articleId, tagId
- Follow: followerId, followingId
- Bookmark: userId, articleId
- Reaction: userId, articleId, type
- Comment: articleId, userId, parentId, deletedAt
- Notification: recipientId, readAt, createdAt
- Session: userId, expires

---

## 🔗 Key Relationships

```
User (1) ─── (N) Article
User (1) ─── (N) Comment
User (1) ─── (N) Reaction
User (1) ─── (N) Bookmark
User (N) ─── (N) User (Follow)
Article (N) ─── (N) Tag (ArticleTag)
Comment (1) ─── (N) Comment (replies)
```

---

## ✅ Auth.js Compliance

This schema is **100% compatible** with Auth.js Prisma adapter:

- ✅ User model with required fields
- ✅ Account model for OAuth
- ✅ Session model for session management
- ✅ VerificationToken model for magic links

---

## 🎯 Design Decisions

### Why cuid() over UUID?

- Shorter, more readable IDs
- Sortable (contains timestamp)
- URL-friendly
- Better for distributed systems

### Why soft deletes for Articles/Comments?

- Allow content recovery
- Maintain referential integrity
- Legal/compliance requirements
- Better user experience

### Why explicit ArticleTag join table?

- More flexible than implicit relations
- Can add metadata (order, featured, etc.)
- Better query performance
- Easier to add features later

### Why separate Reaction types?

- Easy to add new reaction types
- Simple counting and filtering
- Better analytics
- User can react multiple ways

---

## 📊 Estimated Table Sizes (1 year, 1000 users)

| Table        | Estimated Rows | Growth Rate         |
| :----------- | :------------- | :------------------ |
| User         | 1,000          | Slow                |
| Account      | 1,500          | Slow                |
| Session      | 500            | Fast (auto-cleanup) |
| Article      | 10,000         | Medium              |
| Tag          | 100            | Very slow           |
| ArticleTag   | 30,000         | Medium              |
| Follow       | 5,000          | Medium              |
| Bookmark     | 20,000         | Fast                |
| Reaction     | 50,000         | Fast                |
| Comment      | 30,000         | Fast                |
| Notification | 100,000        | Very fast           |

**Total estimated**: ~250,000 rows after 1 year

---

## 🔍 Sample Queries

### Get article with all relations

```typescript
const article = await prisma.article.findUnique({
  where: { slug: 'my-article' },
  include: {
    author: true,
    tags: { include: { tag: true } },
    comments: {
      where: { deletedAt: null },
      include: { user: true, replies: true },
    },
    reactions: { include: { user: true } },
    bookmarks: { include: { user: true } },
  },
});
```

### Get user feed (followed authors)

```typescript
const feed = await prisma.article.findMany({
  where: {
    published: true,
    author: {
      followers: {
        some: { followerId: userId },
      },
    },
  },
  include: { author: true, tags: { include: { tag: true } } },
  orderBy: { publishedAt: 'desc' },
  take: 20,
});
```

### Get user's unread notifications

```typescript
const unread = await prisma.notification.findMany({
  where: {
    recipientId: userId,
    readAt: null,
  },
  orderBy: { createdAt: 'desc' },
});
```

---

## ❓ Questions to Confirm

1. **User username**: Should it be required or optional?
   - **Current**: Optional (users can set it later)

2. **Article slug**: Auto-generate or user-provided?
   - **Suggestion**: Auto-generate from title, allow editing

3. **Comment depth**: Limit nested replies?
   - **Suggestion**: 3 levels max (comment → reply → reply)

4. **Notification retention**: How long to keep read notifications?
   - **Suggestion**: 30 days for read, forever for unread

5. **Reaction types**: Which reactions to include initially?
   - **Current**: LIKE, LOVE, CELEBRATE, INSIGHTFUL, CURIOUS

6. **User deletion**: Hard delete or soft delete?
   - **Suggestion**: Soft delete (anonymize data, keep content)

---

## 🚀 Ready to Implement?

This schema:

- ✅ Supports all features from domain model
- ✅ Auth.js compatible
- ✅ Scalable and performant
- ✅ Flexible for future features
- ✅ Follows best practices

**Please review and let me know**:

1. Any fields to add/remove?
2. Any relations to change?
3. Any enum values to adjust?
4. Answers to the questions above?

Once approved, I'll create the actual `schema.prisma` file! 🎨
