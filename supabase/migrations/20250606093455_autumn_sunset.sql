/*
  # Create users and messages tables for ChatGPT clone

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `picture` (text)
      - `created_at` (timestamp)
    - `messages`  
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `role` (enum: user, assistant)
      - `content` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to access their own data
*/

-- Create role enum type
CREATE TYPE message_role AS ENUM ('user', 'assistant');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  picture text,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for messages table
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);