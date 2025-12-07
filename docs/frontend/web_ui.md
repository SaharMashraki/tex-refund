# Web UI Flow and Structure Definition

Based on `system_architecture.md` and `docs/00_system_flow.md`, this document defines the detailed flow, directory structure, and architectural standards for the Vue 3 + Nuxt 3 frontend.

## 1. Directory Structure

The frontend follows a **Feature-First Architecture**, grouping components and logic by domain features where possible, while keeping shared resources global.

```text
frontend/
├── src/
│   ├── assets/                 # Global styles (Tailwind), images, fonts
│   │   ├── css/
│   │   │   └── tailwind.css
│   │   └── ...
│   │
│   ├── components/
│   │   ├── common/             # Reusable atomic components
│   │   │   ├── AppButton.vue
│   │   │   ├── AppInput.vue
│   │   │   └── ModalDialog.vue
│   │   │
│   │   ├── layout/             # Layout components (Header, Footer, Sidebar)
│   │   │
│   │   ├── features/           # Domain-specific components
│   │   │   ├── auth/           # Login/Register forms
│   │   │   ├── wizard/         # Multi-step form components
│   │   │   │   ├── StepPersonal.vue
│   │   │   │   ├── StepFamily.vue
│   │   │   │   └── ...
│   │   │   ├── documents/      # Upload & Status components
│   │   │   └── tags/           # Tag display & selection
│   │   │       ├── TagDisplay.vue
│   │   │       └── TagSelector.vue
│   │
│   ├── composables/            # Reusable stateful logic (Vue Composables)
│   │   ├── useAuth.ts          # Auth logic wrapper
│   │   ├── useFormWizard.ts    # Logic for navigation/validation of steps
│   │   └── useFileUpload.ts    # Logic for S3 uploads
│   │
│   ├── layouts/                # Nuxt Layouts
│   │   ├── default.vue         # Authenticated app layout
│   │   └── public.vue          # Landing/Login layout
│   │
│   ├── locales/                # i18n JSON files
│   │   ├── en.json
│   │   └── he.json
│   │
│   ├── pages/                  # Route views (Nuxt Pages)
│   │   ├── index.vue           # Landing
│   │   ├── login.vue
│   │   ├── dashboard.vue
│   │   ├── form/               # Multi-step form routes
│   │   │   ├── [step].vue      # Dynamic route for wizard steps
│   │   │   └── summary.vue     # Review before submission
│   │   └── documents/
│   │       └── [id].vue        # Document details & tagging view
│   │
│   ├── plugins/                # Vue plugins (Pinia, i18n setup)
│   ├── stores/                 # Pinia Stores
│   │   ├── auth.store.ts
│   │   ├── wizard.store.ts
│   │   └── documents.store.ts
│   │
│   ├── services/               # API Clients (Axios/Fetch wrappers)
│   │   ├── api.ts              # Base axios instance with interceptors
│   │   ├── auth.service.ts
│   │   └── documents.service.ts
│   │
│   └── app.vue                 # Root component
├── nuxt.config.ts              # Nuxt configuration
└── package.json
```

---

## 2. Core Frontend Flows

### A. Authentication & Routing
*   **Guard Middleware**: `middleware/auth.ts` checks `auth.store.isAuthenticated`. If false, redirects to `/login`.
*   **Redirects**: Public pages (Landing, Login) redirect to `/dashboard` if already authenticated.

### B. Multi-Step Form Wizard (`/form/*`)
Top-level view that manages the linear progression defined in `docs/00_system_flow.md`.

1.  **State Management (`wizard.store.ts`)**:
    *   Holds the entire form data tree: `formData: { personal: {}, family: {}, ... }`.
    *   `currentStep`: Tracks progress (1-10).
    *   `saveProgress()`: Debounced action calling Backend to save draft.

2.  **Navigation Logic**:
    *   User is on `/form/step-1` (Personal Info).
    *   Clicks "Next".
    *   **Validation**: Zod schema for Step 1 runs. If invalid, show errors.
    *   **Action**: `wizard.store.updateData(...)` -> `router.push('/form/step-2')`.

3.  **Components**:
    *   `FormWizard.vue`: Wraps the logical steps, renders the Progress Bar.
    *   `Dynamic Steps`: Loading components based on route param or internal state mapping.


### C. Document Upload & Tagging
Corresponds to Backend Flow A.

1.  **Upload Component (`FileUpload.vue`)**:
    *   Drag & Drop area.
    *   Validates generic file types/size locally before request.
    *   Calls `documents.service.upload(file)`.
    *   Displays progress bar.

2.  **Tag Display (`TagDisplay.vue`)**:
    *   Used in `/documents/:id` view.
    *   Receives tags from backend with confidence scores:
        ```typescript
        {
          confidence: 0.95,
          tag: {
            id: 5,
            key: 'FORM_106',
            labelEn: 'Form 106',
            labelHe: 'טופס 106',
            category: 'income',
            isSystem: true
          }
        }
        ```
    *   **Rendering**:
        ```html
        <span class="tag-badge">
          {{ $i18n.locale === 'he' ? tag.tag.labelHe : tag.tag.labelEn }}
          <span class="confidence">{{ Math.round(tag.confidence * 100) }}%</span>
        </span>
        ```

### D. Summary & Payment
1.  **Summary Page (`/form/summary`)**:
    *   Read-only view of `wizard.store` data.
    *   Calculated "Estimated Refund" displayed (if available from dry-run API).

2.  **Payment Trigger**:
    *   "Get Full Report" button.
    *   Calls `payments.service.checkout(docId)`.
    *   Redirects to Stripe URL returned by backend.


---

## 3. State Management (Pinia)

### `useAuthStore`
*   **State**: `user` (User Object), `token` (JWT).
*   **Actions**: `login(credentials)`, `logout()`, `fetchProfile()`.
*   **Getters**: `isAuthenticated`, `userName`.

### `useWizardStore`
*   **State**:
    *   `steps`: Array of step definitions (Config).
    *   `data`: Nested object for all form fields.
    *   `status`: 'draft' | 'submitted'.
    *   `lastSaved`: Timestamp.
*   **Actions**:
    *   `initForm()`: Fetch existing draft from backend.
    *   `nextStep()`, `prevStep()`.
    *   `autoSave()`: Triggered on data change (debounced 1000ms).

---

## 4. API Integration Strategy

Using a dedicated `services/` layer to abstract HTTP calls.

*   **Instance**: `api.ts` creates an Axios instance (or `ofetch` in Nuxt 3).
*   **Interceptors**:
    *   **Request**: Auto-injects `Authorization: Bearer <token>` from Pinia.
    *   **Response**: Global error handling (e.g., redirect on 401, toast on 500).

```typescript
// services/documents.service.ts
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/documents/upload', formData);
};
```

---

## 5. API Contract Reference

This section documents the expected request/response formats for each API service, ensuring frontend sends data according to backend Zod schemas.

### Authentication API

**Login** (`authService.login`):
```typescript
// Request
{
  email: string,
  password: string  // min 6 characters
}

// Response
{
  success: true,
  data: {
    token: string,
    user: {
      id: number,
      email: string,
      fullName: string
    }
  }
}
```

**Register** (`authService.register`):
```typescript
// Request
{
  email: string,
  password: string,  // min 6 characters
  fullName: string
}

// Response - same as login
```

### Documents API

**Upload** (`documentsService.upload`):
```typescript
// Request: multipart/form-data with 'file' field

// Response
{
  success: true,
  data: {
    id: number,
    userId: number,
    storagePath: string,
    status: 'UPLOADED' | 'PROCESSING' | 'READY_FOR_PREVIEW' | 'PAID',
    createdAt: Date,
    tags?: Array<{
      confidence: number,
      tag: {
        id: number,
        key: string,
        labelEn: string,
        labelHe: string,
        category: string,
        isSystem: boolean
      }
    }>
  }
}
```

**Get Document** (`documentsService.getById`):
```typescript
// Response - same structure as upload response
// tags array will be populated after processing
```

### Tags API

**Tag Structure**:
```typescript
interface Tag {
  id: number
  key: string
  labelEn: string  // English label
  labelHe: string  // Hebrew label
  category: string
  isSystem: boolean
}

// When attached to documents:
interface DocumentTag {
  confidence: number  // 0.0 to 1.0
  tag: Tag
}
```

**Display Logic**:
```typescript
// Use i18n locale to select correct label
const displayLabel = (tag: Tag, locale: string) => {
  return locale === 'he' ? tag.labelHe : tag.labelEn
}
```

### Payments API

**Create Checkout** (`paymentsService.createCheckout`):
```typescript
// Request
{
  documentId: number
}

// Response
{
  checkoutUrl: string  // Stripe checkout URL to redirect user to
}
```

**Usage**:
```typescript
const checkout = await paymentsService.createCheckout(documentId)
window.location.href = checkout.checkoutUrl
```

---

## 6. UI/UX Standards
*   **Design System**: TailwindCSS for utility-first styling.
*   **RTL Support**: Critical for Hebrew.
    *   `html dir="rtl"` set automatically when locale is 'he'.
    *   Tailwind `rtl:` and `ltr:` modifiers used for margin/padding flips.
*   **Feedback**:
    *   Loading spinners for async actions.
    *   Toast notifications for success/error events.
