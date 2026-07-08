# Smooth Backend Adoption Plan

The admin panel must keep working without this backend while we build the full server-side API. The current priority is backend parity: CRM domains, integrations, validation, audit, security, and deployment readiness. Frontend connection starts only after the backend has the required coverage.

## Current Strategy

1. Build the backend modules first.
2. Keep `admin-panel` unchanged and operational through its existing Supabase/browser path.
3. Add backend endpoints, DTOs, guards, tests, and integration wrappers until the server can cover the CRM flows.
4. After backend parity, add frontend adapters behind feature flags.
5. Migrate one domain at a time with fallback enabled.

## Rules For The Later Frontend Phase

- Do not remove existing frontend Supabase calls until the matching backend endpoint is shipped, monitored, and verified.
- Add backend usage behind a feature flag or module-level adapter, for example `REACT_APP_USE_BACKEND_ORDERS=true`.
- Keep `REACT_APP_API_ENDPOINT` optional. If it is missing, the frontend should continue using the current direct Supabase path.
- Never move a secret to another frontend env variable. Secrets move only to backend runtime env and GitHub Secrets.
- Rollback should be a feature flag flip, not a code revert.

## Suggested Frontend Adapter Shape For Later

```ts
const shouldUseBackend = Boolean(process.env.REACT_APP_API_ENDPOINT) &&
  process.env.REACT_APP_USE_BACKEND_ORDERS === 'true';

export const ordersApi = shouldUseBackend ? backendOrdersApi : supabaseOrdersApi;
```

## Backend Build Order Before Connecting Admin Panel

1. Read-only endpoints for dictionaries: categories, brands, suppliers, collections.
2. Read-only orders and clients lists with pagination.
3. Create/update/delete endpoints for dictionaries and clients.
4. Order create/update transaction services.
5. Audit logging through backend services.
6. Nova Poshta search, waybill, tracking, and print helpers.
7. Checkbox shifts, receipts, returns, and reports.
8. Telegram notifications and Cloudinary upload signing.
9. Tests, Swagger contracts, and deployment config.
10. Frontend adapters and feature flags in `admin-panel`.
