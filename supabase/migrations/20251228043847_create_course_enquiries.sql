/*
  # Create Course Enquiries System

  1. New Tables
    - `course_enquiries`
      - `id` (uuid, primary key) - Unique enquiry identifier
      - `course_id` (text) - Reference to the course being enquired about
      - `name` (text) - Name of the person enquiring
      - `email` (text) - Email address for follow-up
      - `phone_number` (text) - Phone number without country code
      - `country_code` (text) - Country calling code (e.g., +91, +1)
      - `preferred_timing` (text) - Preferred time slot for call back
      - `major_objection` (text, nullable) - Main concern about the course
      - `other_objection_details` (text, nullable) - Details if objection is "Other"
      - `source` (text) - Where the enquiry came from
      - `created_at` (timestamptz) - When the enquiry was submitted

  2. Security
    - Enable RLS on `course_enquiries` table
    - Add policy for public to insert enquiries (no auth required)
    - Add policy for authenticated admins to view all enquiries

  3. Indexes
    - Index on course_id for efficient querying by course
    - Index on created_at for sorting by submission time
*/

CREATE TABLE IF NOT EXISTS course_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  country_code text NOT NULL,
  preferred_timing text NOT NULL,
  major_objection text,
  other_objection_details text,
  source text DEFAULT 'course_detail',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE course_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit enquiries (public insert)
CREATE POLICY "Anyone can submit course enquiries"
  ON course_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view their own enquiries by email
CREATE POLICY "Users can view own enquiries"
  ON course_enquiries
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' = email);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_course_enquiries_course_id ON course_enquiries(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enquiries_created_at ON course_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_enquiries_email ON course_enquiries(email);
