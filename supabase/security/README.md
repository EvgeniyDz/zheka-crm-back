# Supabase Security Workstream

We continue using Supabase as the database, but all unrestricted public tables must be reviewed and protected with RLS before the frontend stops using direct Supabase writes.

## Current Risk

The current admin panel contains browser-visible service credentials and writes directly to many public tables. Treat those credentials as compromised and rotate them before production deployment.

## Non-Breaking Order

1. Run `001_rls_audit.sql` and save the result.
2. Rotate exposed keys and update GitHub Secrets.
3. Replace the frontend Supabase service-role key with anon key only.
4. Add RLS policies in small table groups.
5. Move privileged writes to this backend.
6. Verify every role from the admin panel before enforcing stricter policies globally.

## Table Groups

- Auth and RBAC: `app_users`, `roles`, `permissions`, `page_access_config`, `table_access_config`, `audit_logs`.
- Sales: `Orders`, `Clients`, `GiftCertificates`, `WarrantyClaims`, `CashDeskOperations`, `CashDeskClosings`.
- Catalog: `Shop items`, `Brands`, `Categories`, `Subcategories`, `Collections`, `CollectionProducts`.
- Stock: `StockInventory`, `StockReceiving`, `StockWriteOff`, `StockHistory`, `RestockAlerts`.
- Finance: `CashOperations`, `RecurringCashOperations`, `SupplierPayments`, `SupplierTransactions`, `Suppliers`.
- Communications and analytics: `ClientAnalytics`, `DailySalesReport`, `ProductAnalytics`, `ChannelConnections`, `ClientConversations`, `ClientMessages`, `ClientSocialIdentities`.

## Policy Direction

Use Supabase Auth JWT for user identity and existing RBAC tables for authorization. For browser access, prefer narrow read policies. For writes that affect money, stock, fiscal receipts, delivery, or notifications, prefer backend-only operations using the service-role key.
