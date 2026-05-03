-- =========================================================
-- Migration: add placement instructions
-- File: 022_add_placement_instructions.sql
-- Purpose: Add placement_instructions column to orders table for delivery notes
-- Depends on: orders table
-- =========================================================

-- 1️⃣ Add placement_instructions column to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS placement_instructions text;
