-- =========================================================
-- Migration: add weight capacity
-- File: 023_add_weight_capacity.sql
-- Purpose: Add weight_capacity_tons column to order_services table for tracking dumpster capacity
-- Depends on: order_services table
-- =========================================================

-- 1️⃣ Add weight_capacity_tons column to order_services
ALTER TABLE order_services ADD COLUMN IF NOT EXISTS weight_capacity_tons numeric(5,2);
