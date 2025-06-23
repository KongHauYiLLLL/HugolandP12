import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          email: string;
          created_at: string;
          updated_at: string;
          zone: number;
          coins: number;
          gems: number;
          research_level: number;
          research_tier: number;
          game_mode: string;
          is_premium: boolean;
          chat_enabled: boolean;
          is_banned: boolean;
          ban_reason: string | null;
          banned_until: string | null;
          banned_by: string | null;
          best_streak: number;
          highest_zone: number;
          total_items_collected: number;
          total_questions_answered: number;
          total_correct_answers: number;
          best_blitz_score: number;
          category_stats: any;
        };
        Insert: {
          user_id: string;
          username: string;
          email: string;
          zone?: number;
          coins?: number;
          gems?: number;
          research_level?: number;
          research_tier?: number;
          game_mode?: string;
          is_premium?: boolean;
          chat_enabled?: boolean;
        };
        Update: {
          username?: string;
          zone?: number;
          coins?: number;
          gems?: number;
          research_level?: number;
          research_tier?: number;
          game_mode?: string;
          is_premium?: boolean;
          chat_enabled?: boolean;
          best_streak?: number;
          highest_zone?: number;
          total_items_collected?: number;
          best_blitz_score?: number;
          category_stats?: any;
        };
      };
      questions: {
        Row: {
          id: string;
          question_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          category: string;
          difficulty: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
      };
      analytics: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          answer_given: number;
          is_correct: boolean;
          response_time_ms: number;
          zone: number;
          game_mode: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          question_id: string;
          answer_given: number;
          is_correct: boolean;
          response_time_ms: number;
          zone: number;
          game_mode: string;
        };
      };
      game_analytics: {
        Row: {
          id: string;
          user_id: string;
          session_start: string;
          zone_reached: number;
          game_mode: string;
          knowledge_streak_length: number;
          coins_earned: number;
          coins_lost: number;
          items_collected: number;
          items_upgraded: number;
          session_duration_seconds: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          zone_reached: number;
          game_mode: string;
          knowledge_streak_length?: number;
          coins_earned?: number;
          coins_lost?: number;
          items_collected?: number;
          items_upgraded?: number;
          session_duration_seconds?: number;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          message: string;
          created_at: string;
          is_deleted: boolean;
          deleted_by: string | null;
          deleted_reason: string | null;
        };
        Insert: {
          user_id: string;
          username: string;
          message: string;
        };
      };
      leaderboards: {
        Row: {
          id: string;
          leaderboard_type: string;
          user_id: string;
          username: string;
          score: number;
          additional_data: any;
          rank: number;
          updated_at: string;
        };
      };
      gifts: {
        Row: {
          id: string;
          sender_id: string;
          sender_username: string;
          recipient_id: string;
          recipient_username: string;
          gift_type: 'coins' | 'gems';
          amount: number;
          message: string | null;
          is_claimed: boolean;
          claimed_at: string | null;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          sender_id: string;
          sender_username: string;
          recipient_id: string;
          recipient_username: string;
          gift_type: 'coins' | 'gems';
          amount: number;
          message?: string;
        };
        Update: {
          is_claimed?: boolean;
          claimed_at?: string;
        };
      };
    };
  };
}