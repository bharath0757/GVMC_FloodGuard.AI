# Deployment Strategy

This document describes the deployment architecture and processes for bringing FloodGuard AI to AWS production environments.

## 1. Deployment Architecture

```mermaid
architecture-beta
    group aws(AWS Cloud)[AWS Cloud]
    
    group vpc(VPC - Region)[VPC] in aws
    
    group public(Public Subnets)[Public Subnets] in vpc
    service alb(ALB)[Application Load Balancer] in public
    service nat(NAT Gateway)[NAT Gateway] in public
    
    group private(Private Subnets)[Private Subnets] in vpc
    service ecs_api(ECS Fargate)[FastAPI Backend] in private
    service ecs_worker(ECS Fargate)[Celery Workers] in private
    service rds(RDS Multi-AZ)[PostgreSQL + PostGIS] in private
    service redis(ElastiCache)[Redis Cluster] in private
    
    service cf(CloudFront)[CloudFront CDN] in aws
    service s3(S3)[S3 Buckets] in aws
    service sagemaker(SageMaker)[AI Endpoints] in aws
    
    alb --> ecs_api
    ecs_api --> rds
    ecs_api --> redis
    ecs_worker --> redis
    ecs_worker --> rds
    ecs_api --> sagemaker
```

## 2. AWS Infrastructure Layout

- **VPC**: Deployed across 2 Availability Zones (AZs) for high availability. Contains public and private subnets.
- **ALB (Application Load Balancer)**: Handles SSL termination via ACM. Uses path-based routing: `/api/*` goes to the backend target group, while static requests go to CloudFront.
- **ECS Fargate**: Serverless container execution.
  - *Backend Service*: Auto-scaling 2-10 tasks.
  - *Celery Workers*: Auto-scaling 2-20 tasks based on queue depth.
- **RDS PostgreSQL**: Multi-AZ deployment for failover. Uses version 16+ with PostGIS. Read replicas are provisioned for analytics.
- **ElastiCache Redis**: Cluster mode enabled, 2 nodes across AZs for session state and Celery brokering.
- **S3**: Stores static frontend assets (served via CloudFront), user uploads (images, reports), model artifacts, and database backups.
- **CloudFront**: Edge CDN for the React SPA and static assets, reducing latency.
- **Route53**: DNS management and routing.
- **SageMaker**: Managed endpoints for GPU-intensive AI inference (YOLOv11, BLIP-2, Whisper).

## 3. Deployment Environments

- **Development**: Local `docker-compose` environment on developer machines.
- **Staging**: Reduced infrastructure on AWS. Single AZ RDS, smaller Fargate instances, used for QA and integration testing.
- **Production**: Full High Availability (HA) setup across multiple AZs. Strict parity with staging configuration (minus scale).

## 4. Deployment Process

### Strategies
- **Backend (API)**: Blue-Green deployment using AWS CodeDeploy and ECS. Traffic is shifted only when the new version passes health checks, ensuring zero downtime.
- **Workers**: Rolling updates. Old workers finish their current tasks before terminating, while new workers spin up to consume the queue.
- **Frontend**: S3 sync followed by a CloudFront cache invalidation (`/*`).
- **Database Migrations**: Alembic migrations run as a pre-deployment step. **Rule:** All migrations must be backward-compatible (e.g., add column, never rename/drop in a single deploy).

### Deployment Checklist
1. Ensure all CI checks pass.
2. Verify backup of production database.
3. Apply database migrations.
4. Deploy backend services (ECS).
5. Deploy frontend (S3/CloudFront).
6. Run post-deployment smoke tests.

## 5. Auto-scaling Policies

- **ECS Backend Tasks**:
  - Target Tracking Policy: Scale out if Average CPU > 70%.
  - Scale in if Average CPU < 30% for 15 minutes.
- **Celery Workers**:
  - Custom CloudWatch metric scaling based on Redis queue depth (e.g., > 100 messages per worker).
- **RDS**:
  - Auto-scaling for storage.
  - Read replicas scaled manually or via custom automation during high-load analytics requests.
- **Seasonal Scaling**:
  - Flood Season (June-November): Baseline minimum capacities are pre-scaled (e.g., min 5 API tasks, larger RDS instances) to handle sudden traffic spikes gracefully.

## 6. Disaster Recovery

- **RTO (Recovery Time Objective)**: < 15 minutes.
- **RPO (Recovery Point Objective)**: < 5 minutes.
- **Backups**:
  - RDS automated backups continuously with Point-In-Time Recovery (PITR) up to 35 days.
  - Manual snapshots taken before major releases.
- **Data Replication**: S3 cross-region replication for critical user data and model weights.
- **High Availability**: ECS multi-AZ deployment ensures service survives an AZ failure.
- **Runbooks**: Documented procedures for failing over RDS, restoring from S3, and rebuilding infrastructure via Terraform.

## 7. Cost Optimization

- **Compute**: Reserved Instances / Compute Savings Plans for the baseline load. Fargate Spot used for burst capacity on Celery background workers.
- **Storage**: S3 lifecycle policies transition older sensor data and images to Infrequent Access (IA) after 30 days, and Glacier after 90 days.
- **Network**: Aggressive CloudFront caching reduces origin requests to ALB/ECS, significantly lowering bandwidth and compute costs.
- **Database**: Pause staging databases during non-working hours.
