/*
  # Add User Management

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - User's display name
      - `email` (text, nullable) - User's email
      - `mobile` (text, nullable) - User's phone number
      - `created_at` (timestamptz) - When the user was added
    
    - `bill_item_users`
      - `id` (uuid, primary key) - Unique identifier
      - `bill_item_id` (uuid, foreign key) - Reference to bill item
      - `user_id` (uuid, foreign key) - Reference to user
      - Composite unique constraint on (bill_item_id, user_id)
  
  2. Security
    - Enable RLS on both tables
    - Public access policies for demo purposes
  
  3. Indexes
    - Index on user_id for faster lookups
    - Composite index on bill_item_id and user_id
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  mobile text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bill_item_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_item_id uuid NOT NULL REFERENCES bill_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(bill_item_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bill_item_users_user_id ON bill_item_users(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_item_users_item_user ON bill_item_users(bill_item_id, user_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_item_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to users"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read access to bill_item_users"
  ON bill_item_users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to bill_item_users"
  ON bill_item_users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);