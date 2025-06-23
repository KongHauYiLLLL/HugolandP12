/*
  # Hugoland Database Schema

  1. New Tables
    - `profiles` - User profiles with game data
    - `questions` - Trivia questions storage
    - `analytics` - Question analytics tracking
    - `game_analytics` - Game session analytics
    - `chat_messages` - Global chat system
    - `leaderboards` - Cached leaderboard data
    - `gifts` - Gift transactions between players
    - `banned_users` - User banning system

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for questions and bans
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table for user data
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Game data (backup copy, not primary source)
  zone integer DEFAULT 1,
  coins integer DEFAULT 100,
  gems integer DEFAULT 0,
  research_level integer DEFAULT 0,
  research_tier integer DEFAULT 0,
  game_mode text DEFAULT 'normal',
  is_premium boolean DEFAULT false,
  
  -- Chat settings
  chat_enabled boolean DEFAULT true,
  
  -- Moderation
  is_banned boolean DEFAULT false,
  ban_reason text,
  banned_until timestamptz,
  banned_by uuid REFERENCES auth.users(id),
  
  -- Stats for leaderboards
  best_streak integer DEFAULT 0,
  highest_zone integer DEFAULT 1,
  total_items_collected integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  total_correct_answers integer DEFAULT 0,
  best_blitz_score integer DEFAULT 0,
  
  -- Category accuracy (JSON)
  category_stats jsonb DEFAULT '{}'::jsonb
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text UNIQUE NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL, -- Array of 4 options
  correct_answer integer NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Analytics for question responses (last 10 per user)
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id text NOT NULL,
  answer_given integer NOT NULL,
  is_correct boolean NOT NULL,
  response_time_ms integer NOT NULL,
  zone integer NOT NULL,
  game_mode text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Game session analytics
CREATE TABLE IF NOT EXISTS game_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_start timestamptz DEFAULT now(),
  zone_reached integer NOT NULL,
  game_mode text NOT NULL,
  knowledge_streak_length integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  coins_lost integer DEFAULT 0,
  items_collected integer DEFAULT 0,
  items_upgraded integer DEFAULT 0,
  session_duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Global chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_by uuid REFERENCES auth.users(id),
  deleted_reason text
);

-- Leaderboards (cached data, updated periodically)
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  score integer NOT NULL,
  additional_data jsonb DEFAULT '{}'::jsonb,
  rank integer NOT NULL,
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(leaderboard_type, user_id)
);

-- Gift transactions
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_username text NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_username text NOT NULL,
  gift_type text NOT NULL CHECK (gift_type IN ('coins', 'gems')),
  amount integer NOT NULL CHECK (amount > 0),
  message text,
  is_claimed boolean DEFAULT false,
  claimed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Banned users tracking
CREATE TABLE IF NOT EXISTS banned_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  banned_by uuid REFERENCES auth.users(id) NOT NULL,
  reason text NOT NULL,
  banned_until timestamptz,
  is_permanent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read public profile data for leaderboards"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Questions policies (read-only for users)
CREATE POLICY "Authenticated users can read active questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Analytics policies
CREATE POLICY "Users can read own analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Game analytics policies
CREATE POLICY "Users can read own game analytics"
  ON game_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game analytics"
  ON game_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can read chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (is_deleted = false);

CREATE POLICY "Users can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_banned = true
  ));

-- Leaderboards policies (read-only)
CREATE POLICY "Users can read leaderboards"
  ON leaderboards
  FOR SELECT
  TO authenticated
  USING (true);

-- Gifts policies
CREATE POLICY "Users can read gifts sent to them"
  ON gifts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Users can send gifts"
  ON gifts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update gifts sent to them"
  ON gifts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id);

-- Banned users policies (admin only)
CREATE POLICY "Only admins can manage bans"
  ON banned_users
  FOR ALL
  TO authenticated
  USING (false); -- Will be managed via functions

-- Functions for analytics cleanup (keep only last 10 per user)
CREATE OR REPLACE FUNCTION cleanup_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM analytics 
  WHERE user_id = NEW.user_id 
  AND id NOT IN (
    SELECT id FROM analytics 
    WHERE user_id = NEW.user_id 
    ORDER BY created_at DESC 
    LIMIT 10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_analytics_trigger
  AFTER INSERT ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_analytics();

-- Function to update profile stats
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile stats when analytics are inserted
  UPDATE profiles SET
    total_questions_answered = total_questions_answered + 1,
    total_correct_answers = total_correct_answers + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_stats_trigger
  AFTER INSERT ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_stats();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_analytics_user_id ON game_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_type_rank ON leaderboards(leaderboard_type, rank);
CREATE INDEX IF NOT EXISTS idx_gifts_recipient ON gifts(recipient_id, is_claimed);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty, is_active);