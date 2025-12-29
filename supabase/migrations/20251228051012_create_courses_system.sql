/*
  # Create Courses Management System

  1. New Tables
    - `instructors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `photo` (text) - emoji or image URL
      - `bio` (text)
      - `years_experience` (integer)
      - `specialization` (text)
      - `is_online` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `age_range` (text)
      - `duration` (text)
      - `description` (text)
      - `full_description` (text)
      - `tier` (text) - 'mini' or 'premium'
      - `image_color` (text) - gradient classes
      - `icon` (text) - emoji
      - `rating` (numeric)
      - `review_count` (integer)
      - `is_popular` (boolean)
      - `is_locked` (boolean)
      - `spots_left` (integer)
      - `viewing_now` (integer)
      - `instructor_id` (uuid, foreign key)
      - `status` (text) - 'draft', 'published', 'archived'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `learning_outcomes`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `text` (text)
      - `icon` (text)
      - `order_position` (integer)
      - `created_at` (timestamptz)
    
    - `course_highlights`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `text` (text)
      - `included` (boolean)
      - `order_position` (integer)
      - `created_at` (timestamptz)
    
    - `curriculum_modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `week_number` (integer)
      - `title` (text)
      - `description` (text)
      - `order_position` (integer)
      - `created_at` (timestamptz)
    
    - `course_schedules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `days_per_week` (integer)
      - `duration` (text)
      - `session_length` (text)
      - `total_sessions` (integer)
      - `next_batch_date` (text)
      - `time_slots` (jsonb) - array of time slot strings
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `course_pricing`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `original_price` (integer)
      - `discounted_price` (integer)
      - `currency` (text)
      - `per_session_price` (integer)
      - `payment_plans` (jsonb) - array of payment plan strings
      - `money_back_guarantee` (boolean)
      - `free_trial` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `course_reviews`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `parent_name` (text)
      - `parent_photo` (text)
      - `rating` (integer)
      - `comment` (text)
      - `review_date` (text)
      - `verified` (boolean)
      - `images` (jsonb) - array of image URLs
      - `video_url` (text)
      - `video_thumbnail` (text)
      - `helpful_count` (integer)
      - `created_at` (timestamptz)
    
    - `course_faqs`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `question` (text)
      - `answer` (text)
      - `order_position` (integer)
      - `created_at` (timestamptz)
    
    - `course_prerequisites`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `prerequisite_text` (text)
      - `order_position` (integer)
      - `created_at` (timestamptz)
    
    - `course_relations`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `related_course_id` (uuid, foreign key)
      - `created_at` (timestamptz)

  2. Security
    - No RLS policies (as requested - no security for now)
*/

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo text DEFAULT '👨‍🏫',
  bio text DEFAULT '',
  years_experience integer DEFAULT 0,
  specialization text DEFAULT '',
  is_online boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  age_range text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  full_description text DEFAULT '',
  tier text DEFAULT 'mini',
  image_color text DEFAULT 'from-blue-500 to-blue-600',
  icon text DEFAULT '📚',
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  is_popular boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  spots_left integer DEFAULT 0,
  viewing_now integer DEFAULT 0,
  instructor_id uuid REFERENCES instructors(id) ON DELETE SET NULL,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create learning outcomes table
CREATE TABLE IF NOT EXISTS learning_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  text text NOT NULL,
  icon text DEFAULT '✅',
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create course highlights table
CREATE TABLE IF NOT EXISTS course_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  text text NOT NULL,
  included boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create curriculum modules table
CREATE TABLE IF NOT EXISTS curriculum_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create course schedules table
CREATE TABLE IF NOT EXISTS course_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  days_per_week integer DEFAULT 2,
  duration text DEFAULT '',
  session_length text DEFAULT '',
  total_sessions integer DEFAULT 0,
  next_batch_date text DEFAULT '',
  time_slots jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course pricing table
CREATE TABLE IF NOT EXISTS course_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  original_price integer DEFAULT 0,
  discounted_price integer DEFAULT 0,
  currency text DEFAULT 'INR',
  per_session_price integer DEFAULT 0,
  payment_plans jsonb DEFAULT '[]'::jsonb,
  money_back_guarantee boolean DEFAULT false,
  free_trial boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  parent_name text NOT NULL,
  parent_photo text DEFAULT '👤',
  rating integer DEFAULT 5,
  comment text DEFAULT '',
  review_date text DEFAULT '',
  verified boolean DEFAULT false,
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  video_thumbnail text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create course FAQs table
CREATE TABLE IF NOT EXISTS course_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create course prerequisites table
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_text text NOT NULL,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create course relations table
CREATE TABLE IF NOT EXISTS course_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  related_course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, related_course_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_learning_outcomes_course ON learning_outcomes(course_id);
CREATE INDEX IF NOT EXISTS idx_course_highlights_course ON course_highlights(course_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_course ON curriculum_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_schedules_course ON course_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_pricing_course ON course_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_faqs_course ON course_faqs(course_id);
CREATE INDEX IF NOT EXISTS idx_course_prerequisites_course ON course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_course_relations_course ON course_relations(course_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_schedules_updated_at BEFORE UPDATE ON course_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_pricing_updated_at BEFORE UPDATE ON course_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();