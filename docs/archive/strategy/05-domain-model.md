# Domain Model (Initial)

## Entities

- User: role, profile (name, username, image, bio), accounts, passwords (hashed)
- Article: authorId, title, slug, content (TipTap), published/publishedAt, SEO fields, tags
- Tag: name, slug, color
- Follow: followerId, followingId
- Notification: recipientId, type, readAt
- Bookmark, Reaction (like, etc.)
- Comment (with replies) — may come later

## Search index

- Articles: title, excerpt, author, tags

## Assets

- User avatars, article cover images, inline article images (TipTap)
- Store on S3; process with Sharp (optimized + thumbnails)
