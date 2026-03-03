#!/bin/bash
# =============================================================================
# LocalStack Init Script
# Creates AWS resources for local development
# =============================================================================

set -e

echo "🚀 Initializing LocalStack resources..."

# ===========================================================================
# SQS Queues
# ===========================================================================
echo "📨 Creating SQS Queues..."

# User Events Queue + DLQ
awslocal sqs create-queue --queue-name user-events-dlq
awslocal sqs create-queue --queue-name user-events \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:user-events-dlq\",\"maxReceiveCount\":\"3\"}"
  }'

# Order Events Queue + DLQ
awslocal sqs create-queue --queue-name order-events-dlq
awslocal sqs create-queue --queue-name order-events \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:order-events-dlq\",\"maxReceiveCount\":\"3\"}"
  }'

# Catalog Events Queue + DLQ
awslocal sqs create-queue --queue-name catalog-events-dlq
awslocal sqs create-queue --queue-name catalog-events \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:catalog-events-dlq\",\"maxReceiveCount\":\"3\"}"
  }'

# Notification Events Queue
awslocal sqs create-queue --queue-name notification-events

echo "✅ SQS Queues created"

# ===========================================================================
# S3 Buckets
# ===========================================================================
echo "📦 Creating S3 Buckets..."

awslocal s3 mb s3://ecommerce-uploads
awslocal s3 mb s3://ecommerce-assets

echo "✅ S3 Buckets created"

# ===========================================================================
# Secrets Manager
# ===========================================================================
echo "🔐 Creating Secrets..."

awslocal secretsmanager create-secret \
  --name "ecommerce/jwt-secret" \
  --secret-string "local-dev-jwt-secret-super-secure-123"

awslocal secretsmanager create-secret \
  --name "ecommerce/db-credentials" \
  --secret-string '{"username":"postgres","password":"postgres","host":"postgres","port":"5432"}'

echo "✅ Secrets created"

# ===========================================================================
# SNS Topics
# ===========================================================================
echo "📣 Creating SNS Topics..."

awslocal sns create-topic --name user-notifications
awslocal sns create-topic --name order-notifications

echo "✅ SNS Topics created"

# ===========================================================================
# EventBridge
# ===========================================================================
echo "📡 Creating EventBridge Event Bus..."

awslocal events create-event-bus --name ecommerce-events

echo "✅ EventBridge Event Bus created"

echo ""
echo "🎉 LocalStack initialization complete!"
echo ""
echo "Resources created:"
echo "  - SQS: user-events, order-events, notification-events"
echo "  - S3: ecommerce-uploads, ecommerce-assets"
echo "  - Secrets: ecommerce/jwt-secret, ecommerce/db-credentials"
echo "  - SNS: user-notifications, order-notifications"
echo "  - EventBridge: ecommerce-events"
