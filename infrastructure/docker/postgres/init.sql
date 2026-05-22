-- PostgreSQL initialization script
-- This file is executed when the database is first created

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Database is already created by POSTGRES_DB env variable
-- Just ensure it exists
SELECT 'Database initialized successfully' AS status;
