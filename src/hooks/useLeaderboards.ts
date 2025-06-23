import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [leaderboards, setLeaderboards] = useState<{ [key: string]: LeaderboardEntry[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboards();
    
    // Refresh leaderboards every 30 seconds
    const interval = setInterval(loadLeaderboards, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboards = async () => {
    try {
      const leaderboardTypes = [
        'best_blitz',
        'top_streaks',
        'highest_zones',
        'item_collectors',
        'highest_accuracy',
        'geography_masters',
        'science_masters',
        'math_masters'
      ];

      const leaderboardData: { [key: string]: LeaderboardEntry[] } = {};

      for (const type of leaderboardTypes) {
        const { data, error } = await supabase
          .from('leaderboards')
          .select('*')
          .eq('leaderboard_type', type)
          .order('rank')
          .limit(10);

        if (error) throw error;

        leaderboardData[type] = data || [];
      }

      setLeaderboards(leaderboardData);
    } catch (err) {
      console.error('Error loading leaderboards:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  };

  const updateLeaderboards = async () => {
    // This would typically be called by a server-side function
    // For now, we'll just reload the data
    await loadLeaderboards();
  };

  return {
    leaderboards,
    loading,
    error,
    updateLeaderboards,
  };
};