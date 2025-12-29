/*
  # Create Course Requests and Users Management Tables

  1. New Tables
    - `course_requests`
      - `id` (uuid, primary key)
      - `course_name` (text) - requested course name
      - `category` (text) - requested category
      - `age_range` (text) - target age range
      - `description` (text) - additional details
      - `requester_name` (text) - optional name
      - `requester_email` (text) - optional email
      - `upvotes` (integer) - number of upvotes for this request
      - `status` (text) - 'pending', 'reviewing', 'approved', 'rejected'
      - `admin_notes` (text) - notes from admin
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `country_code` (text)
      - `child_age` (integer)
      - `source` (text) - where user came from
      - `status` (text) - 'active', 'inactive'
      - `tags` (jsonb) - array of tags
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - No RLS for now (admin-only access)
*/

-- Create course requests table
CREATE TABLE IF NOT EXISTS course_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name text NOT NULL,
  category text DEFAULT '',
  age_range text DEFAULT '',
  description text DEFAULT '',
  requester_name text DEFAULT '',
  requester_email text DEFAULT '',
  upvotes integer DEFAULT 0,
  status text DEFAULT 'pending',
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  phone text DEFAULT '',
  country_code text DEFAULT '+91',
  child_age integer,
  source text DEFAULT 'web',
  status text DEFAULT 'active',
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_requests_status ON course_requests(status);
CREATE INDEX IF NOT EXISTS idx_course_requests_upvotes ON course_requests(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create triggers for updated_at
CREATE TRIGGER update_course_requests_updated_at BEFORE UPDATE ON course_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
