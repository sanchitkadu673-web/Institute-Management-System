-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('student-documents', 'student-documents', false),
  ('omr-sheets', 'omr-sheets', false),
  ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;
