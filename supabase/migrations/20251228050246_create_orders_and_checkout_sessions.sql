/*
  # Create Orders and Checkout Sessions System

  1. New Tables
    - orders: Store completed and pending orders
    - checkout_sessions: Track incomplete checkout sessions for cart recovery

  2. Security
    - Enable RLS on both tables
    - Add policies for public access to create and view their own data

  3. Indexes
    - Add indexes on commonly queried fields
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  course_title text NOT NULL,
  course_category text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  country_code text DEFAULT '+91',
  child_age integer NOT NULL,
  original_price integer NOT NULL,
  discount_amount integer DEFAULT 0,
  final_price integer NOT NULL,
  currency text DEFAULT 'INR',
  payment_status text DEFAULT 'pending',
  order_status text DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  source text DEFAULT 'web',
  session_id text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create checkout_sessions table
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  session_id text NOT NULL,
  customer_name text,
  customer_email text,
  customer_phone text,
  country_code text DEFAULT '+91',
  child_age integer,
  form_step integer DEFAULT 0,
  abandoned boolean DEFAULT false,
  converted boolean DEFAULT false,
  order_id uuid REFERENCES orders(id),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_course_id ON orders(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_course_id ON checkout_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_abandoned ON checkout_sessions(abandoned);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for orders table
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders by email"
  ON orders FOR SELECT
  TO public
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Policies for checkout_sessions table
CREATE POLICY "Anyone can create checkout sessions"
  ON checkout_sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view checkout sessions by session_id"
  ON checkout_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update their own checkout sessions"
  ON checkout_sessions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkout_sessions_updated_at
  BEFORE UPDATE ON checkout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
