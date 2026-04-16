-- AI Recommendation Logs Table
-- Run this migration in Supabase SQL Editor to set up the logging table

CREATE TABLE IF NOT EXISTS ai_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  input_type TEXT NOT NULL CHECK (input_type IN ('text', 'image')),
  user_input TEXT,
  ai_raw_response JSONB,
  final_recommendation JSONB,
  pricing_data JSONB,
  zip_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_logs_zip_code ON ai_logs(zip_code);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_input_type ON ai_logs(input_type);

-- Enable RLS (Row Level Security)
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for admin dashboard)
CREATE POLICY "Enable public read access" ON ai_logs
  FOR SELECT USING (true);

-- Allow service role to insert
CREATE POLICY "Allow service role insert" ON ai_logs
  FOR INSERT WITH CHECK (true);
