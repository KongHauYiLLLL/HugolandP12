import React, { useState } from 'react';
import { useLeaderboards } from '../hooks/useLeaderboards';
import { Trophy, X, Crown, Target, Map, Package, BarChart3, Globe, Atom, Calculator } from 'lucide-react';

interface LeaderboardsProps {
  onClose: () => void;
}

export const Leaderboards: React.FC<LeaderboardsProps> = ({ onClose }) => {
  const { leaderboards, loading } = useLeaderboards();
  const [activeTab, setActiveTab] = useState('best_blitz');

  const leaderboardConfig = {
    best_blitz: {
      title: 'Best Blitz Players',
      icon: Crown,
      color: 'text-yellow-400',
      description: 'Top performers in Blitz mode'
    },
    top_streaks: {
      title: 'Knowledge Streaks',
      icon: Target,
      color: 'text-orange-400',
      description: 'Longest correct answer streaks'
    },
    highest_zones: {
      title: 'Zone Masters',
      icon: Map,
      color: 'text-green-400',
      description: 'Highest zones reached'
    },
    item_collectors: {
      title: 'Item Collectors',
      icon: Package,
      color: 'text-purple-400',
      description: 'Most items collected'
    },
    highest_accuracy: {
      title: 'Accuracy Masters',
      icon: BarChart3,
      color: 'text-blue-400',
      description: 'Highest overall accuracy'
    },
    geography_masters: {
      title: 'Geography Masters',
      icon: Globe,
      color: 'text-teal-400',
      description: 'Best at Geography questions'
    },
    science_masters: {
      title: 'Science Masters',
      icon: Atom,
      color: 'text-indigo-400',
      description: 'Best at Science questions'
    },
    math_masters: {
      title: 'Math Masters',
      icon: Calculator,
      color: 'text-pink-400',
      description: 'Best at Math questions'
    }
  };

  const formatScore = (type: string, score: number, additionalData?: any) => {
    switch (type) {
      case 'highest_accuracy':
        return `${score}%`;
      case 'best_blitz':
        return `${score} pts`;
      case 'geography_masters':
      case 'science_masters':
      case 'math_masters':
        return `${score}% accuracy`;
      default:
        return score.toString();
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-4 sm:p-6 rounded-lg border border-slate-500/50 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            <div>
              <h2 className="text-white font-bold text-lg sm:text-xl">Live Leaderboards</h2>
              <p className="text-slate-300 text-sm">Compete with adventurers worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
          {Object.entries(leaderboardConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="hidden sm:inline">{config.title}</span>
                <span className="sm:hidden">{config.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Leaderboard */}
        <div className="bg-black/30 rounded-lg p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mb-4"></div>
              <p className="text-white text-lg">Loading leaderboards...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${leaderboardConfig[activeTab as keyof typeof leaderboardConfig].color}`}>
                  {leaderboardConfig[activeTab as keyof typeof leaderboardConfig].title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {leaderboardConfig[activeTab as keyof typeof leaderboardConfig].description}
                </p>
              </div>

              {leaderboards[activeTab]?.length > 0 ? (
                <div className="space-y-3">
                  {leaderboards[activeTab].map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        entry.rank <= 3
                          ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50'
                          : 'bg-gray-800/50 border-gray-600/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{entry.username}</p>
                          <p className="text-gray-400 text-sm">
                            Score: {formatScore(activeTab, entry.score, entry.additional_data)}
                          </p>
                        </div>
                      </div>
                      {entry.rank <= 3 && (
                        <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No data available yet</p>
                  <p className="text-gray-500 text-sm">Be the first to make the leaderboard!</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Leaderboards update every 30 seconds</p>
        </div>
      </div>
    </div>
  );
};