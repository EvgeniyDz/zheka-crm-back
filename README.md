# Zheka CRM Backend

Server-side API for Zheka CRM and the existing admin panel.

## What is inside

- NestJS 11 with strict TypeScript.
- Environment validation with Zod.
- Swagger docs at `/docs`.
- Global DTO validation and typed response envelope.
- Security headers, CORS, compression, throttling.
- Supabase server client and JWT user guard.
- RBAC decorators and guards for access control.
- Audit API for storing operational events.
- Integration layer for Checkbox, Nova Poshta, and Telegram so secrets can move out of the browser.
- Health checks for deployment monitoring.

## Quick Start

```bash
npm install
cp .env.example .env
npm run start:dev
```

API: `http://localhost:4000/api`

Swagger: `http://localhost:4000/docs`

## Suggested Frontend Integration

In `admin-panel`, point `REACT_APP_API_ENDPOINT` to:

```bash
REACT_APP_API_ENDPOINT=http://localhost:4000/api
```

The frontend can keep using Supabase while we build backend parity. We will connect admin-panel only after the backend has the required modules, security checks, and integration coverage.
## Smooth Backend Adoption

The admin panel must keep working without this backend while we build the full server-side API. First we complete backend parity for the CRM domains and integrations; only after that we start connecting admin-panel through feature flags and `REACT_APP_API_ENDPOINT`. If a flag or endpoint is missing, the frontend keeps using the existing Supabase/browser path.

See [docs/backend-adoption.md](docs/backend-adoption.md) for the migration rules, suggested adapter shape, and rollback strategy.

## Supabase Security

Supabase remains the database for Zheka CRM. Before enforcing RLS changes, run the read-only audit in [supabase/security/001_rls_audit.sql](supabase/security/001_rls_audit.sql). The security workstream is documented in [supabase/security/README.md](supabase/security/README.md).


## Reference Data API

Initial read-only backend parity endpoints are available under `/api/v1/reference-data`:

- `GET /common` - categories, brands, suppliers, and collections in one response.
- `GET /categories?limit=100&offset=0&search=`
- `GET /brands?limit=100&offset=0&search=`
- `GET /suppliers?limit=100&offset=0&search=`
- `GET /collections?limit=100&offset=0&search=`

These endpoints are protected by Supabase JWT auth and RBAC permissions. The admin panel is not connected to them yet; this is backend parity work for the later adapter phase.

## Clients And Orders API

Initial read-only backend parity endpoints are available for CRM lists:

- `GET /api/v1/clients?limit=100&offset=0&search=&sortBy=created&direction=desc`
- `GET /api/v1/orders?limit=100&offset=0&search=&status=&platform=&phone=&dateFrom=&dateTo=&sortBy=date&direction=desc`
- `GET /api/v1/orders/summary?status=&platform=&phone=&dateFrom=&dateTo=`
- `POST /api/v1/orders`
- `PATCH /api/v1/orders/:id`
- `DELETE /api/v1/orders/:id`

These endpoints are protected by Supabase JWT auth and RBAC permissions. They are not connected to dmin-panel yet.
Initial write backend parity is also available for later adapter work:

- `POST /api/v1/clients`
- `PATCH /api/v1/clients/:id`
- `DELETE /api/v1/clients/:id`
- `POST /api/v1/reference-data/categories`
- `PATCH /api/v1/reference-data/categories/:slug`
- `DELETE /api/v1/reference-data/categories/:slug`
- `POST /api/v1/reference-data/brands`
- `PATCH /api/v1/reference-data/brands/:slug`
- `DELETE /api/v1/reference-data/brands/:slug`
- `POST /api/v1/reference-data/suppliers`
- `PATCH /api/v1/reference-data/suppliers/:id`
- `DELETE /api/v1/reference-data/suppliers/:id`
## Environment Strategy

Local development uses `.env` copied from `.env.example`.

Production and staging environment values must be stored in GitHub Secrets and injected by GitHub Actions during deploy. Do not commit real API keys, Supabase service-role keys, bot tokens, or third-party credentials into the frontend or backend repositories.

Required GitHub Secrets:

- `NODE_ENV`
- `PORT`
- `API_PREFIX`
- `APP_URL`
- `CORS_ORIGINS`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CHECKBOX_API_URL`
- `CHECKBOX_CLIENT_NAME`
- `CHECKBOX_CLIENT_VERSION`
- `NOVA_POSHTA_API_URL`
- `NOVA_POSHTA_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Roadmap

### P0 - Security Baseline

- Rotate exposed credentials found in the current `admin-panel` codebase: Supabase service-role key, Nova Poshta API key, Telegram bot token, and any other browser-visible service credentials.
- Replace the frontend Supabase service-role client with anon-key auth only. The service-role key must exist only on this backend and only through GitHub Secrets / runtime env.
- Keep Supabase as the database, but enable and verify RLS for every public schema table currently marked as unrestricted in Supabase.
- Create explicit RLS policies for CRM roles: admin, manager, warehouse, sales, finance, and read-only users.
- Move sensitive operations from direct frontend Supabase writes to backend endpoints guarded by Supabase JWT + RBAC.
- Add CI secret scanning and dependency audit checks to prevent new committed secrets.

### P1 - Build Complete Backend API

- Create backend modules for current Redux domains: orders, clients, shop items, brands, categories, collections, suppliers, stock receiving, stock write-off, inventory, cash desk, cash operations, gift certificates, notes, analytics, communications, and warranty claims.
- Move order creation/update flow from `OrderModal.tsx` into transactional backend services.
- Centralize audit logging in backend services instead of calling `log_audit` from the browser.
- Add pagination, filtering, sorting, DTO validation, and consistent response contracts for list endpoints.
- Keep admin-panel unchanged during this phase except for documentation or non-invasive compatibility notes.

### P2 - Integrations

- Move Nova Poshta search, waybill create/update/delete, tracking, and print URL generation behind backend endpoints.
- Move Telegram order notifications behind backend endpoints.
- Move Checkbox auth, shifts, receipts, returns, and reports behind backend endpoints.
- Move Cloudinary upload signing to the backend so upload presets/secrets are not browser-owned.
- Keep public tracking/print links client-safe, but generate privileged integration requests server-side.

### P3 - Supabase Hardening

- Normalize table naming over time: avoid spaces and mixed casing in new tables, add typed views/adapters for legacy names.
- Convert loose JSON/string fields into validated DTOs where the business flow is stable.
- Add migrations for RLS, indexes, constraints, and seed data instead of manual SQL editor changes.
- Add database tests for permissions, RLS policies, audit triggers, and important RPC functions.
- Review storage buckets and file access policies for product images, documents, and generated PDFs.

### P4 - Admin Panel Connection

- Add optional frontend API adapters behind feature flags only after backend modules are complete.
- Generate OpenAPI client types for dmin-panel from Swagger to reduce frontend/backend drift.
- Connect domains one by one while preserving fallback to the existing Supabase/browser path.
- Remove browser-visible service credentials only after every caller has a working backend replacement.
- Keep rollback as a feature flag flip, not a code revert.

### P5 - Operations

- Keep GitHub Actions manual-only while the backend is under active construction, then enable pull_request/push triggers when the project is ready for team CI.
- Add structured logging, request IDs, and error monitoring.
- Add rate limits per auth user for expensive integration endpoints.
- Add backup/restore documentation for Supabase.
- Add smoke tests for `/api/v1/health`, auth profile, and each critical CRM workflow.





