# Storage, Email, and Image Processing

## Storage (S3)

- Use presigned URL uploads from client
- Store object keys in DB
- Local dev: MinIO via Docker Compose

## Image processing (Sharp)

- Requirements: resize/optimize originals, generate thumbnails
- Flow: upload original -> queue job -> Sharp creates optimized + thumbnail(s); store keys/URLs

## Email (Resend)

- Transactional emails: welcome, magic link, password reset
- Use React Email templates
- Send via BullMQ job for reliability
