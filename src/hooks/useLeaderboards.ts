import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  id: string;
  leaderboard_type: string;
  user_id: string;
  username: string;
  score: number;
  additional_data: any;
  rank: number;
  updated_at: string;
}

export const useLeaderboards = () => {
  const [leaderboards] = useState<{ [key: string]: LeaderboardEntry[] }>({});
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const updateLeaderboards = async () => {
    // No-op for offline mode
  };

  return {
    leaderboards,
    loading,
    error,
    updateLeaderboards,
  };
};