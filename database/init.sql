-- init.sql
-- Master script to initialize the database
-- Run this script to set up the entire database structure

-- Note: This script assumes the database itself (e.g., 'TaxRefundDB') already exists and you are connected to it.

-- 1. Run Schema Creation
:r ./01_schema.sql
GO

-- 2. Run Seeds
:r ./02_seeds.sql
GO

-- 3. Run Procedures
:r ./03_procedures.sql
GO

PRINT 'Database initialization completed successfully.';
