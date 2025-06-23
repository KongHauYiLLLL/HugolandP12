import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Question {
  id: string;
  question_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;

      setQuestions(data || []);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const getQuestionByZone = (zone: number): Question | null => {
    if (questions.length === 0) return null;

    let difficulty: 'easy' | 'medium' | 'hard';
    
    // Easy questions for zones 1-3
    if (zone <= 3) {
      difficulty = 'easy';
    }
    // Medium questions for zones 4-7
    else if (zone <= 7) {
      difficulty = 'medium';
    }
    // Hard questions for zones 8+
    else {
      difficulty = 'hard';
    }

    const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
    
    if (filteredQuestions.length === 0) {
      // Fallback to any question if no questions of the desired difficulty
      return questions[Math.floor(Math.random() * questions.length)];
    }

    return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
  };

  const recordAnswer = async (
    questionId: string,
    answerGiven: number,
    isCorrect: boolean,
    responseTimeMs: number,
    zone: number,
    gameMode: string
  ) => {
    try {
      const { error } = await supabase
        .from('analytics')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id!,
          question_id: questionId,
          answer_given: answerGiven,
          is_correct: isCorrect,
          response_time_ms: responseTimeMs,
          zone,
          game_mode: gameMode,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error recording answer:', err);
    }
  };

  return {
    questions,
    loading,
    error,
    getQuestionByZone,
    recordAnswer,
  };
};