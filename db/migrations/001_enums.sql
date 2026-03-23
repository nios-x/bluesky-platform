-- =========================================================
-- Migration: ENUMS
-- File: 001_enums.sql
-- Purpose: Global enums used across the system
-- =========================================================

create type if not exists user_role_enum as enum (
  'CUSTOMER',
  'ADMIN',
  'OWNER'
);

create type if not exists user_status_enum as enum (
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED'
);

create type if not exists customer_type_enum as enum (
  'RESIDENTIAL',
  'BUSINESS'
);

create type if not exists customer_status_enum as enum (
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED'
);

create type if not exists admin_role_enum as enum (
  'SUPER',
  'OPS',
  'SUPPORT'
);
-- Order Status (used by admin dropdown)
-- REQUESTED   → order created
-- CONFIRMED   → approved by admin
-- IN_TRANSIT  → dumpster on the way
-- DELIVERED   → dropped at site
-- COMPLETED   → pickup done
-- CANCELLED   → cancelledr
create type if not exists order_status_enum as enum (
  'REQUESTED',
  'PAID',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED'
);

create type if not exists invoice_status_enum as enum (
  'DRAFT',
  'SENT',
  'PAID'
);

create type if not exists payment_gateway_enum as enum (
  'STRIPE',
  'PAYPAL',
  'AUTHORIZE'
);

-- Payment Status (automatic / backend-driven)
-- PENDING   → payment link sent
-- PAID      → success
-- FAILED    → failed attempt
-- REFUNDED  → refunded
create type if not exists payment_status_enum as enum (
  'PAID',
  'FAILED'
);

create type if not exists support_status_enum as enum (
  'OPEN',
  'CLOSED'
);
