# Document Management

## Overview
Handles the lifecycle of user-uploaded documents, from initial upload to secure storage, metadata tracking, and retrieval.

## Workflow

### 1. Upload Process
- **Endpoint**: `POST /api/documents/upload`
- **Validation**:
  - **MIME Types**: `application/pdf`, `image/jpeg`, `image/png`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX).
  - **Max Size**: 10MB per file.
- **Process**:
  1. Frontend sends `multipart/form-data`.
  2. Backend validates file stream.
  3. Backend uploads binary to **AWS S3** (or MinIO) in a private bucket.
     - Key Pattern: `uploads/{userId}/{uuid}-{filename}`
  4. Backend creates metadata record in `Documents` table (MS SQL).
     - Status set to `PROCESSING`.
  5. Triggers `DocumentProcessingEvent` (for async worker).

### 2. Storage Structure
- **S3 Bucket**: Private access only.
- **Database**:
  - `Documents` table stores:
    - `id`: Unique Identifier.
    - `user_id`: Owner.
    - `original_name`: Display name.
    - `s3_key`: Path in bucket.
    - `mime_type`: File type.
    - `size_bytes`: File size.
    - `status`: `UPLOADED` -> `PROCESSING` -> `READY` / `FAILED`.

### 3. Retrieval
- **Endpoint**: `GET /api/documents/{id}/download`
- **Security Check**:
  - Ensure `request.user.id === document.user_id`.
- **Mechanism**:
  - Generate **S3 Presigned URL** (Valid for 5 minutes).
  - Redirect client to the presigned URL or return JSON with the URL.

## Security
- **Access Control**: Strict ownership checks.
- **Malware Scanning**: (Planned) Scan file stream before S3 finalization.
- **Encryption**: AWS S3 Server-Side Encryption (SSE-S3).
