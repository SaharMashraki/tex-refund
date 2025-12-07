# Backend Flow and Structure Definition

Based on `system_architecture.md`, this document defines the detailed flow, directory structure, and architectural standards for the Fastify-based backend.

## 1. Directory Structure

The backend follows a **Modular Architecture**, grouping logic by domain (feature) rather than technical layer. This ensures scalability and keeps tagging/payment logic distinct.

```text
backend/
├── src/
│   ├── app.ts                  # App entry point, plugin registration
│   ├── server.ts               # Server startup (port listening)
│   │
│   ├── config/
│   │   ├── env.ts              # Zod-validated environment variables
│   │   ├── db.ts               # Database connection configuration
│   │   └── s3.ts               # S3 / MinIO configuration
│   │
│   ├── db/
│   │   ├── migrations/         # SQL/ORM migrations
│   │   └── seeds/              # Initial data (e.g., System Tags)
│   │
│   ├── modules/                # DOMAIN MODULES
│   │   ├── auth/
│   │   │   ├── auth.routes.ts  # Login, Register, Refresh Token
│   │   │   ├── auth.schema.ts  # Fastify/Zod Validation schemas
│   │   │   └── auth.service.ts # Business logic (hashing, JWT)
│   │   │
│   │   ├── documents/
│   │   │   ├── documents.routes.ts      # Upload, List, Get Details
│   │   │   ├── documents.schema.ts      # Multipart validation, ID params
│   │   │   ├── documents.service.ts     # S3 interactions, DB metadata
│   │   │   └── documents.worker.ts      # Background job for OCR/Tagging
│   │   │
│   │   ├── tags/
│   │   │   ├── tags.data.ts    # Static/DB access for Tag Dictionary
│   │   │   ├── tags.routes.ts  # Admin routes for managing tags
│   │   │   └── tags.service.ts # Logic for matching text -> Tags
│   │   │
│   │   └── payments/
│   │       ├── payments.routes.ts       # Checkout, Webhooks
│   │       ├── payments.schema.ts
│   │       └── payments.service.ts      # Stripe integration, status updates
│   │
│   ├── plugins/
│   │   ├── jwt.ts              # Authentication middleware plugin
│   │   ├── swagger.ts          # OpenAPI documentation setup
│   │   └── multipart.ts        # File upload handling config
│   │
│   └── shared/
│       ├── types/              # Global TypeScript interfaces
│       ├── utils/              # Helper functions (logging, formatting)
│       └── errors.ts           # Standardized error handling
│
├── .env                        # Environment variables
├── package.json
└── tsconfig.json
```

---

## 2. Core Backend Flows

### A. Document Upload & Processing Flow
This flow handles the secure ingestion and automated tagging of user documents.

1.  **Upload Request (Frontend -> Backend)**
    *   **Endpoint**: `POST /api/v1/documents/upload`
    *   **Payload**: `multipart/form-data` (File)
    *   **Validation**:
        *   Check MIME type (PDF, DOCX, Image only).
        *   Check File Size (e.g., max 10MB).
        *   Scan for malware (optional/future).

2.  **Storage & Metadata (Sync)**
    *   Backend generates a unique filename (UUID).
    *   Uploads file to **S3 (Private Bucket)**.
    *   Inserts record into `Documents` table:
        *   `status`: `PROCESSING`
        *   `storage_path`: `s3://bucket/uuid.pdf`
    *   **Response**: Returns `201 Created` with `documentId`.

3.  **Async Tagging (Background Worker)**
    *   The `documents.worker.ts` (or queue consumer) picks up the new document.
    *   **OCR/Extraction**: Extracts raw text from the file.
    *   **Tag Matching**:
        *   Fetches active tags from `Tags` table (cached).
        *   Scans text for keywords (Hebrew/English).
        *   *Example*: Found "טופס 106" -> Matches Tag ID 5.
    *   **DB Update**:
        *   Inserts matches into `DocumentTags` table (`document_id`, `tag_id`, `confidence`).
        *   Updates `Documents` table `status` -> `READY_FOR_PREVIEW`.

---

### B. View Document & Tags Flow
Retrieving the processed document with its bilingual tags.

1.  **Get Details Request**
    *   **Endpoint**: `GET /api/v1/documents/:id`
    *   **Auth**: Token required.

2.  **Data Retrieval**
    *   Query `Documents` table for metadata (ensure `user_id` matches).
    *   Query `DocumentTags` JOIN `Tags` to get assigned tags.
    *   Fetch **Presigned URL** from S3 for the file thumbnail/preview.

3.  **Response Construction**
    *   Structure the tags for `vue-i18n` (as defined in System Architecture):
        ```json
        {
          "tags": [
             { "key": "FORM_106", "labels": { "en": "Form 106", "he": "טופס 106" } }
          ]
        }
        ```

---

### C. Payment & Unlock Flow
Gating the final "Paid" content behind a payment provider.

1.  **Unlock Request**
    *   **Endpoint**: `POST /api/v1/payments/checkout`
    *   **Body**: `{ documentId: 102 }`

2.  **Pre-Check**
    *   Check if `Documents.status` is already `PAID`. If so, return error or direct download.

3.  **Stripe Session**
    *   Call Stripe API to create a Checkout Session.
    *   Metadata: `{ userId: 1, documentId: 102 }`.
    *   **Response**: Return `checkoutUrl` to Frontend.

4.  **Webhook Handling (Async)**
    *   **Endpoint**: `POST /api/v1/payments/webhook` (Public, verify Stripe signature).
    *   **Event**: `checkout.session.completed`.
    *   **Action**:
        *   Extract `documentId` from metadata.
        *   Update `Documents` table: `status` -> `PAID`.
        *   Insert record into `Payments` table.

5.  **Final Download**
    *   User is redirected back to success page.
    *   User requests: `GET /api/v1/documents/:id/download`.
    *   Backend checks `status === 'PAID'`.
    *   Returns **Presigned URL** (valid for 5 mins) for the full original file.

---

### C. Payment & Unlock Flow
Gating the final "Paid" content behind a payment provider.

1.  **Unlock Request**
    *   **Endpoint**: `POST /api/v1/payments/checkout`
    *   **Body**: `{ documentId: 102 }`

2.  **Pre-Check**
    *   Check if `Documents.status` is already `PAID`. If so, return error or direct download.

3.  **Stripe Session**
    *   Call Stripe API to create a Checkout Session.
    *   Metadata: `{ userId: 1, documentId: 102 }`.
    *   **Response**: Return `checkoutUrl` to Frontend.

4.  **Webhook Handling (Async)**
    *   **Endpoint**: `POST /api/v1/payments/webhook` (Public, verify Stripe signature).
    *   **Event**: `checkout.session.completed`.
    *   **Action**:
        *   Extract `documentId` from metadata.
        *   Update `Documents` table: `status` -> `PAID`.
        *   Insert record into `Payments` table.

5.  **Final Download**
    *   User is redirected back to success page.
    *   User requests: `GET /api/v1/documents/:id/download`.
    *   Backend checks `status === 'PAID'`.
    *   Returns **Presigned URL** (valid for 5 mins) for the full original file.

---

## 3. API Schema Reference

All API endpoints use Zod schemas for validation. Below are the key schemas that define the contract between frontend and backend.

### Authentication Schemas

**Login Request** (`POST /api/v1/auth/login`):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register Request** (`POST /api/v1/auth/register`):
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Auth Response** (Login/Register):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

### Tag Schemas

**Tag Structure**:
```json
{
  "id": 5,
  "key": "FORM_106",
  "labelEn": "Form 106",
  "labelHe": "טופס 106",
  "category": "income",
  "isSystem": true
}
```

**Get Tags Response** (`GET /api/v1/tags`):
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "key": "FORM_106",
      "labelEn": "Form 106",
      "labelHe": "טופס 106",
      "category": "income",
      "isSystem": true
    }
  ]
}
```

### Document Schemas

**Document with Tags**:
```json
{
  "id": 102,
  "userId": 1,
  "storagePath": "s3://bucket/uuid.pdf",
  "status": "READY_FOR_PREVIEW",
  "createdAt": "2025-12-07T00:00:00.000Z",
  "tags": [
    {
      "confidence": 0.95,
      "tag": {
        "id": 5,
        "key": "FORM_106",
        "labelEn": "Form 106",
        "labelHe": "טופס 106",
        "category": "income",
        "isSystem": true
      }
    }
  ]
}
```

**Document Response** (`GET /api/v1/documents/:id`):
```json
{
  "success": true,
  "data": {
    "id": 102,
    "userId": 1,
    "storagePath": "s3://bucket/uuid.pdf",
    "status": "READY_FOR_PREVIEW",
    "createdAt": "2025-12-07T00:00:00.000Z",
    "tags": [
      {
        "confidence": 0.95,
        "tag": {
          "id": 5,
          "key": "FORM_106",
          "labelEn": "Form 106",
          "labelHe": "טופס 106",
          "category": "income",
          "isSystem": true
        }
      }
    ]
  }
}
```

### Payment Schemas

**Checkout Request** (`POST /api/v1/payments/checkout`):
```json
{
  "documentId": 102
}
```

**Checkout Response**:
```json
{
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Webhook Response** (`POST /api/v1/payments/webhook`):
```json
{
  "received": true
}
```

---

## 4. Database Interaction Strategy

*   **ORM**: Prisma or TypeORM.
*   **Connection**: Handled via a Fastify Plugin (Singleton).
*   **Transaction Management**:
    *   Critical flows (like Payment Webhook) must use database transactions to ensure `Payments` insert and `Documents` update happen atomically.

## 4. API Standardization

*   **Prefix**: `/api/v1`
*   **Responses**:
    *   Success: `{ success: true, data: { ... } }`
    *   Error: `{ success: false, error: { code: "FILE_TOO_LARGE", message: "..." } }`
*   **Validation**: All inputs validated via Zod/Ajv schemas derived from the Domain logic.
