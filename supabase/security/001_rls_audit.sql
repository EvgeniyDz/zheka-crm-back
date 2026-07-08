-- Zheka CRM Supabase security audit
-- Safe to run: read-only audit queries. This file does not enable RLS and does not change policies.
-- Run in Supabase SQL Editor before creating RLS migrations.

-- 1. Tables in public schema and their RLS status.
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  forcerowsecurity as rls_forced
from pg_tables
where schemaname = 'public'
order by tablename;

-- 2. Existing RLS policies.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3. Grants to browser-facing roles.
select
  table_schema,
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

-- 4. Public functions/RPCs that should be reviewed before browser usage.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as result_type,
  p.prosecdef as security_definer
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;

-- 5. Suggested table list from current CRM surface. Use this to check Supabase "UNRESTRICTED" labels.
with expected_tables(table_name) as (
  values
    ('app_users'),
    ('audit_logs'),
    ('roles'),
    ('permissions'),
    ('page_access_config'),
    ('table_access_config'),
    ('Orders'),
    ('Clients'),
    ('Shop items'),
    ('Brands'),
    ('Categories'),
    ('Subcategories'),
    ('Collections'),
    ('CollectionProducts'),
    ('Suppliers'),
    ('SupplierPayments'),
    ('SupplierTransactions'),
    ('StockInventory'),
    ('StockReceiving'),
    ('StockWriteOff'),
    ('StockHistory'),
    ('CashOperations'),
    ('RecurringCashOperations'),
    ('CashDeskOperations'),
    ('CashDeskClosings'),
    ('GiftCertificates'),
    ('Notes'),
    ('Documents'),
    ('WarrantyClaims'),
    ('Wishlist'),
    ('Reviews'),
    ('RestockAlerts'),
    ('SystemSettings'),
    ('DailySalesReport'),
    ('ProductAnalytics'),
    ('ClientAnalytics'),
    ('ChannelConnections'),
    ('ClientConversations'),
    ('ClientMessages'),
    ('ClientSocialIdentities')
)
select
  e.table_name,
  case when c.table_name is null then 'missing' else 'present' end as table_status,
  coalesce(t.rowsecurity, false) as rls_enabled
from expected_tables e
left join information_schema.tables c
  on c.table_schema = 'public'
 and c.table_name = e.table_name
left join pg_tables t
  on t.schemaname = 'public'
 and t.tablename = e.table_name
order by e.table_name;
