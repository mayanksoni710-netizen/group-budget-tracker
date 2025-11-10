/*
  # Budget Management Expenses Schema

  1. New Tables
    - `bills`
      - `id` (uuid, primary key) - Unique identifier for each bill
      - `user_id` (uuid, nullable) - Future auth integration
      - `grand_total` (decimal) - Total amount of the bill
      - `currency` (text) - Currency code (USD, EUR, etc.)
      - `uploaded_at` (timestamptz) - Timestamp of when bill was uploaded
      
    - `bill_items`
      - `id` (uuid, primary key) - Unique identifier for each item
      - `bill_id` (uuid, foreign key) - Reference to parent bill
      - `name` (text) - Item name/description
      - `quantity` (integer) - Quantity of item
      - `price` (decimal) - Unit price
      - `total` (decimal) - Total for this line item
      - `assigned_user` (text, nullable) - Optional user assignment for bill splitting
      
  2. Security
    - Enable RLS on both tables
    - Public access policies for demo purposes (can be restricted later with auth)
    
  3. Indexes
    - Index on bill_id in bill_items for faster lookups
    - Index on uploaded_at for chronological queries
*/

CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  grand_total decimal(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bill_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10, 2) NOT NULL,
  total decimal(10, 2) NOT NULL,
  assigned_user text
);

CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_bills_uploaded_at ON bills(uploaded_at DESC);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to bills"
  ON bills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to bills"
  ON bills FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read access to bill_items"
  ON bill_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to bill_items"
  ON bill_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);