# Authentication & Authorization

## Overview
The authentication system secures access to the Tax Refund Platform, ensuring that users can only access their own documents and that administrative features are protected.

## Architecture

### Components
- **Backend Service**: `AuthModule` (Fastify).
- **Database**: `Users` table in MS SQL.
- **Token**: JWT (JSON Web Tokens) for stateless authentication.

### Data Flow

#### 1. Registration
- **Endpoint**: `POST /api/auth/register`
- **Process**:
  1. Validate email format and password strength (Zod).
  2. Check if email already exists.
  3. Hash password using bcrypt.
  4. Create record in `Users` table.
  5. Return 201 Created.

#### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Process**:
  1. Validate credentials.
  2. Generate JWT containing `userId` and `role`.
  3. Return JWT to client.

#### 3. Protection
- **Middleware**: `verifyJwt`
- **Process**:
  - Intercepts protected routes.
  - Decodes token.
  - Attaches `user` object to request context.
  - Throws 401 if invalid/expired.

## Authorization
- **Role-Based Access Control (RBAC)**:
  - `USER`: Can upload/view own documents.
  - `ADMIN`: Can manage system tags, view analytics.

## Security Measures
- **Password Hashing**: Bcrypt with salt.
- **HTTPS**: All auth traffic encrypted.
- **JWT Expiration**: Short-lived access tokens (e.g., 1 hour) with Refresh Token rotation (optional).

### Data Flow (Continued)

#### 4. Logout
- **Action**: Client-side initiated.
- **Process**:
  1. User clicks "Logout".
  2. Pinia Store actions:
     - Clears the JWT from `localStorage` / cookies.
     - Resets user state in the store.
  3. Router redirects to `/login`.

## Frontend Implementation

### Validation Checks (Client-Side)
Before sending data to the backend, the frontend performs the following checks (using Zod or VeeValidate):

- **Registration**:
  - **Email**: Must be a valid email format.
  - **Password**: Minimum 8 characters, at least one uppercase letter, one number.
  - **Confirm Password**: Must match the password field.

- **Login**:
  - **Required Fields**: Ensure email and password are not empty.

### Route Protection
- **Global Guard**: A Nuxt middleware (`auth.global.ts`) checks for the presence of a token on every route transition.
- **Redirect**: If a user tries to access `/dashboard` without a token, they are redirected to `/login`.

### User Experience Flows

#### Success Scenarios
- **Post-Registration**:
  - Automatically logs the user in (returns token similar to login) OR redirects to `/login` with a "Registration successful" toast.
  - **Preferred Plan**: Auto-login -> Redirect immediately to `/dashboard`.
- **Post-Login**:
  - Redirects user to `/dashboard` (or the page they originally tried to access).

#### Error Methods (UX)
To ensure users are not frustrated ("disturbing the client"), the frontend must handle errors gracefully:

1. **Inline Validation Errors**:
   - Shown immediately when typing (e.g., "Password too weak").
   - Prevents the "Submit" button from being clickable.

2. **API Error Responses**:
   - **400 Bad Request** (e.g., "Email already exists"):
     - Display a specific, friendly error message near the form field or as a top-level alert.
     - Example: "This email is already registered. Try logging in instead."
   - **401 Unauthorized** (Login fail):
     - Display "Invalid email or password."
   - **500 Server Error**:
     - Display a generic "Something went wrong, please try again later" toast notification.

3. **Loading States**:
   - Show a spinner on the "Register/Login" button while the request is pending to prevent double-submissions.


