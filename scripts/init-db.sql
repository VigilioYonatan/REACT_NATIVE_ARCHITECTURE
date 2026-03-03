-- =============================================================================
-- PostgreSQL Init Script
-- Creates databases for each microservice
-- =============================================================================

-- Identity Service Database
CREATE DATABASE identity;

-- Catalog Service Database
CREATE DATABASE catalog;

-- Order Service Database
CREATE DATABASE orders;

-- Payment Service Database
CREATE DATABASE payments;

-- Notification Service Database
CREATE DATABASE notifications;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE identity TO postgres;
GRANT ALL PRIVILEGES ON DATABASE catalog TO postgres;
GRANT ALL PRIVILEGES ON DATABASE orders TO postgres;
GRANT ALL PRIVILEGES ON DATABASE payments TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notifications TO postgres;
