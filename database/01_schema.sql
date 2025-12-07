-- 01_schema.sql
-- Database Schema for Tax Refund Platform
-- Targeted for MS SQL Server

-- 1. Users Table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- 2. Documents Table
CREATE TABLE Documents (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    storage_path NVARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('UPLOADED', 'PROCESSING', 'READY_FOR_PREVIEW', 'PAID')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Documents_Users FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 3. Tags Table
CREATE TABLE Tags (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [key] VARCHAR(50) NOT NULL UNIQUE, -- 'key' is a reserved keyword, so we escape it
    label_en NVARCHAR(100) NOT NULL,
    label_he NVARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_system BIT DEFAULT 0
);

-- 4. DocumentTags Table (Junction)
CREATE TABLE DocumentTags (
    document_id INT NOT NULL,
    tag_id INT NOT NULL,
    confidence FLOAT NOT NULL,
    PRIMARY KEY (document_id, tag_id),
    CONSTRAINT FK_DocumentTags_Documents FOREIGN KEY (document_id) REFERENCES Documents(id) ON DELETE CASCADE,
    CONSTRAINT FK_DocumentTags_Tags FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
);

-- 5. Payments Table
CREATE TABLE Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    document_id INT NOT NULL,
    stripe_session_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Payments_Users FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT FK_Payments_Documents FOREIGN KEY (document_id) REFERENCES Documents(id)
);

-- Indexes for performance
CREATE INDEX IX_Documents_UserId ON Documents(user_id);
CREATE INDEX IX_DocumentTags_DocumentId ON DocumentTags(document_id);
CREATE INDEX IX_Tags_Key ON Tags([key]);
