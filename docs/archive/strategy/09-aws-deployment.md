# AWS Deployment Strategy

## Initial target architecture

- Next.js apps (admin, web): ECS Fargate
- Workers: ECS Fargate service
- Database: RDS PostgreSQL
- Redis: ElastiCache
- Storage: S3 + CloudFront
- Search: Meilisearch (EC2 or ECS, decide in infra phase)
- Secrets: Secrets Manager or SSM Parameter Store

## Realtime considerations

- Socket.io may need ALB sticky sessions or centralized pub/sub (Redis) for multi-instance fan-out.
