import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  zone: number;
  coins: number;
  gems: number;
  research_level: number;
  research_tier: number;
  game_mode: string;
  is_premium: boolean;
  chat_enabled: boolean;
  is_banned: boolean;
  best_streak: number;
  highest_zone: number;
  total_items_collected: number;
  total_questions_answered: number;
  total_correct_answers: number;
  best_blitz_score: number;
  category_stats: any;
}

export const useAuth = () => {
  // Mock user and profile for offline mode
  const mockUser = {
    id: 'offline-user',
    email: 'offline@hugoland.com'
  };

  const mockProfile: UserProfile = {
    id: 'offline-profile',
    user_id: 'offline-user',
    username: 'Adventurer',
    email: 'offline@hugoland.com',
    zone: 1,
    coins: 100,
    gems: 0,
    research_level: 0,
    research_tier: 0,
    game_mode: 'normal',
    is_premium: false,
    chat_enabled: false,
    is_banned: false,
    best_streak: 0,
    highest_zone: 1,
    total_items_collected: 0,
    total_questions_answered: 0,
    total_correct_answers: 0,
    best_blitz_score: 0,
    category_stats: {}
  };

  const [user] = useState(mockUser);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    // Update local profile state
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const signUp = async () => {
    return { data: mockUser, error: null };
  };

  const signIn = async () => {
    return { data: mockUser, error: null };
  };

  const setError = () => {
    // No-op for offline mode
  };

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    updateProfile,
    setError,
  };
};