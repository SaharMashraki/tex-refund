# System Architecture: Tax Refund Platform

## 1. Overview
This document outlines the architecture for a scalable, secure Tax Refund web application. The system facilitates secure file uploads, automated document processing, bilingual tagging (English/Hebrew), and a locked-content payment flow.

## 2. Technology Stack

### Backend
- **Framework**: Fastify (Node.js)
- **Language**: TypeScript
- **Runtime**: Node.js v25 LTS (Iron)
- **ORM**: Prisma or TypeORM (Recommended for MS SQL type safety)
- **Validation**: Fastify Schema (Ajv) + Zod
- **Documentation**: Swagger / OpenAPI (via Fastify Swagger)

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Meta-Framework**: Nuxt 3 (Recommended for routing/SEO) or Vite
- **Styling**: TailwindCSS + RTL Support (Crucial for Hebrew)
- **State Management**: Pinia
- **Internationalization**: `vue-i18n` (Static text) + Backend logic (Dynamic tags)

### Database & Storage
- **Primary DB**: MS SQL Server (Mandatory)
- **Object Storage**: AWS S3 (Production) / MinIO (Local Dev)
    - Stores raw uploaded files (PDF, DOCX, Images)
    - Stores processed results

### Payments
- **Providers**: Stripe and PayPal
- **Strategy**: Webhook-driven state changes (`Pending` -> `Paid` -> `Released`)

---

## 3. Bilingual Tagging System Architecture

To handle tags effectively in both English and Hebrew, the system uses a **Relational Schema** rather than simple JSON arrays. This allows for querying, reporting, and easy translation management.

### A. Database Schema (MS SQL)

**1. `Tags` Table (The Dictionary)**
Holds the definitions and translations.

| Column | Type | Description |
| :--- | :--- | :--- |

+
| `id` | INT (PK) | Unique ID |
| `key` | VARCHAR(50) | System reference (e.g., `INCOME_REPORT`) |
| `label_en` | NVARCHAR(100) | Display text (e.g., "Annual Income") |
| `label_he` | NVARCHAR(100) | Display text (e.g., "הכנסה שנתית") |
| `category` | VARCHAR(50) | Grouping (e.g., "Personal", "Business") |
| `is_system` | BIT | `1` = System generated, `0` = User custom tag |

**2. `Documents` Table**
Standard document metadata.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique ID |
| `user_id` | INT | Owner |
| `status` | VARCHAR(20) | `UPLOADED`, `TAGGED`, `PAID` |

**3. `DocumentTags` Table (Junction)**
Links documents to tags.

| Column | Type | Description |
| :--- | :--- | :--- |
| `document_id` | INT (FK) | Reference to Document |
| `tag_id` | INT (FK) | Reference to Tag |
| `confidence` | FLOAT | AI Confidence score (0.0 - 1.0) |

### B. Backend API Response Structure
When the Frontend requests document details, the Backend returns tags in a structure compatible with `vue-i18n`.

```json
{
  "documentId": 102,
  "status": "READY_FOR_PREVIEW",
  "tags": [
    {
      "id": 5,
      "key": "FORM_106",
      "labels": {
        "en": "Form 106",
        "he": "טופס 106"
      },
      "category": "INCOME"
    }
  ]
}
```

### C. Frontend Implementation (Vue 3)
The component selects the label based on the active locale.

```typescript
// Script
const { locale } = useI18n(); // returns 'en' or 'he'

// Template
<span v-for="tag in document.tags" :key="tag.id">
  {{ tag.labels[locale] }} 
</span>
```

## 4. High-Level Data Flow

1. **Secure Upload**: User uploads file (Frontend) -> Backend validates MIME type/Size -> Uploads to S3 (Private Bucket).
2. **Metadata Entry**: Backend creates a DB record with status PROCESSING.
3. **Async Processing**:
    - Worker Service picks up the file.
    - Extracts text (OCR).
    - **Tagging**: Matches text against keywords to find Tag IDs (e.g., text contains "טופס 106" -> assign TagID: 5).
4. **Completion**: DB updated to READY_FOR_PREVIEW.
5. **User Review**: User sees the document with Hebrew/English tags displayed.
6. **Payment Lock**:
    - User requests full report.
    - System checks payment_status. If false, redirect to Stripe.
7. **Webhook**: Stripe hits `/api/webhooks/stripe` -> Backend updates DB to PAID.
8. **Release**: User downloads the final processed result.

## 5. Security & Compliance
- **Encryption at Rest**: MS SQL Transparent Data Encryption (TDE) & S3 Bucket Encryption.
- **Encryption in Transit**: TLS 1.3 for all API calls.
- **Access Control**: Presigned URLs for S3 downloads (links expire after 5 minutes).
- **Sanitization**: All file inputs scanned for malware before processing.

## 6. Directory Structure Plan
Organized by Domain Modules to keep Tagging and Payment logic distinct.

```
/
├── backend/
│   ├── src/
│   │   ├── config/          # DB Config, S3 Config
│   │   ├── modules/         # Modular architecture
│   │   │   ├── auth/
│   │   │   ├── documents/
│   │   │   ├── tags/        # Tag Logic (EN/HE definitions)
│   │   │   └── payments/
│   │   ├── plugins/         # Fastify plugins (Swagger, CORS)
│   │   ├── db/              # Migrations, Seeds (Initial Tags)
│   │   └── index.ts
│   └── package.json
│
├── frontend/                # Vue 3 / Nuxt 3
│   ├── src/
│   │   ├── assets/          # Tailwind, CSS
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── tags/        # TagDisplay.vue, TagSelector.vue
│   │   ├── locales/         # Static translations (en.json, he.json)
│   │   ├── stores/          # Pinia (UserStore, DocStore)
│   │   └── views/
│   └── package.json
│
├── infrastructure/          # Docker, K8s, Terraform
└── docs/
    ├── api/                 # OpenAPI specs
    └── architecture/        # This file
```