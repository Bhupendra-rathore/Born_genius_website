/*
  # Create Account Profile System

  1. New Tables
    - `children`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `age` (integer)
      - `grade` (text, optional)
      - `interests` (jsonb array)
      - `learning_level` (text: beginner/intermediate/advanced)
      - `avatar` (text, emoji or URL)
      - `is_primary` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `enrollments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `child_id` (uuid, foreign key to children)
      - `course_id` (uuid, foreign key to courses)
      - `order_id` (uuid, foreign key to orders)
      - `progress_percentage` (integer, 0-100)
      - `status` (text: active/completed/paused)
      - `last_accessed_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

    - `certificates`
      - `id` (uuid, primary key)
      - `enrollment_id` (uuid, foreign key to enrollments)
      - `user_id` (uuid, foreign key to users)
      - `child_id` (uuid, foreign key to children)
      - `course_id` (uuid, foreign key to courses)
      - `certificate_number` (text, unique)
      - `issued_date` (timestamptz)
      - `created_at` (timestamptz)

    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `plan_name` (text)
      - `plan_type` (text: monthly/annual)
      - `status` (text: active/cancelled/expired)
      - `price` (integer)
      - `currency` (text)
      - `start_date` (timestamptz)
      - `next_billing_date` (timestamptz)
      - `end_date` (timestamptz, nullable)
      - `auto_renew` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `wishlist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `created_at` (timestamptz)

    - `notification_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `progress_updates` (boolean)
      - `new_courses` (boolean)
      - `offers` (boolean)
      - `whatsapp_enabled` (boolean)
      - `email_enabled` (boolean)
      - `push_enabled` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL,
  grade text DEFAULT '',
  interests jsonb DEFAULT '[]'::jsonb,
  learning_level text DEFAULT 'beginner',
  avatar text DEFAULT '👶',
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own children"
  ON children FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert own children"
  ON children FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can update own children"
  ON children FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can delete own children"
  ON children FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE SET NULL,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  progress_percentage integer DEFAULT 0,
  status text DEFAULT 'active',
  last_accessed_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE SET NULL,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_type text DEFAULT 'monthly',
  status text DEFAULT 'active',
  price integer NOT NULL,
  currency text DEFAULT 'INR',
  start_date timestamptz DEFAULT now(),
  next_billing_date timestamptz NOT NULL,
  end_date timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert into own wishlist"
  ON wishlist FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can delete from own wishlist"
  ON wishlist FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  progress_updates boolean DEFAULT true,
  new_courses boolean DEFAULT true,
  offers boolean DEFAULT true,
  whatsapp_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE email = (SELECT email FROM users WHERE id = auth.uid())));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_child_id ON enrollments(child_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);