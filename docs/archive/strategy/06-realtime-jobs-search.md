# Realtime and Jobs

## Realtime (Socket.io)

- Scope: live notifications only
- Authenticated socket connections; emit on follow and article publish
- Consider Redis pub/sub for multi-instance fan-out in AWS

## Background jobs (BullMQ + Redis)

- Keep web requests fast; provide retries/backoff
- Queues: email, images (and optional notifications fan-out)
