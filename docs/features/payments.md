# Payments & Content Locking

## Overview
This module handles monetization by guarding the final results behind a payment wall. It integrates with payment providers and uses database state to manage access.

## Workflow

### 1. The Locking Mechanism
- **Concept**: Users can upload and view a *preview* of their refund potential.
- **Restriction**: The compiled "Refund Report" and official submission forms are **locked**.
- **Check**: API endpoints for report generation check the `payment_status` flag.

### 2. Payment Flow
1. **User Action**: Clicks "Unlock Full Report".
2. **API Call**: `POST /api/payments/create-session`
   - Creates a **Stripe Checkout Session**.
   - Generates a unique `payment_intent`.
   - Returns URL to frontend.
3. **Redirect**: User completes payment on Stripe. Since we use `mode: 'payment'`, capture is immediate.

### 3. Verification (Webhook)
- **Endpoint**: `POST /api/webhooks/stripe`
- **Security**: Validates Stripe Signature (prevent spoofing).
- **Logic**:
  - Receives `checkout.session.completed` event.
  - Extracts `userId` or `metadata.documentId`.
  - Updates Database:
    - `Documents.status` = `PAID` (if per-document) OR
    - `Users.subscription` = `PREMIUM`.
  - Sends "Payment Successful" email.

### 4. Post-Payment Access
- User is redirected to `/success`.
- Frontend refreshes document state.
- "Download" buttons become active.

## Database Integration
- **Payments Table** (Optional but recommended):
  - `id`, `provider_id` (Stripe ID), `amount`, `currency`, `status`, `user_id`, `created_at`.
