import { useState, useEffect } from 'react';

export interface Question {
  id: string;
  question_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Offline questions database
const offlineQuestions: Question[] = [
  // Easy Questions
  {
    id: '1',
    question_id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct_answer: 2,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '2',
    question_id: '2',
    question: 'How many legs does a spider have?',
    options: ['6', '8', '10', '12'],
    correct_answer: 1,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '3',
    question_id: '3',
    question: 'What color do you get when you mix red and blue?',
    options: ['Green', 'Yellow', 'Purple', 'Orange'],
    correct_answer: 2,
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '4',
    question_id: '4',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Earth', 'Mercury', 'Mars'],
    correct_answer: 2,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '5',
    question_id: '5',
    question: 'What is 5 + 7?',
    options: ['11', '12', '13', '14'],
    correct_answer: 1,
    category: 'Math',
    difficulty: 'easy'
  },
  // Medium Questions
  {
    id: '6',
    question_id: '6',
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correct_answer: 1,
    category: 'Literature',
    difficulty: 'medium'
  },
  {
    id: '7',
    question_id: '7',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct_answer: 2,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '8',
    question_id: '8',
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correct_answer: 1,
    category: 'History',
    difficulty: 'medium'
  },
  {
    id: '9',
    question_id: '9',
    question: 'What is the square root of 64?',
    options: ['6', '7', '8', '9'],
    correct_answer: 2,
    category: 'Math',
    difficulty: 'medium'
  },
  {
    id: '10',
    question_id: '10',
    question: 'Which ocean is the largest?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct_answer: 3,
    category: 'Geography',
    difficulty: 'medium'
  },
  // Hard Questions
  {
    id: '11',
    question_id: '11',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
    correct_answer: 2,
    category: 'Science',
    difficulty: 'hard'
  },
  {
    id: '12',
    question_id: '12',
    question: 'Who painted "The Starry Night"?',
    options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet'],
    correct_answer: 1,
    category: 'Art',
    difficulty: 'hard'
  },
  {
    id: '13',
    question_id: '13',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2x²'],
    correct_answer: 1,
    category: 'Math',
    difficulty: 'hard'
  },
  {
    id: '14',
    question_id: '14',
    question: 'Which programming language was created by Brendan Eich?',
    options: ['Python', 'Java', 'JavaScript', 'C++'],
    correct_answer: 2,
    category: 'Technology',
    difficulty: 'hard'
  },
  {
    id: '15',
    question_id: '15',
    question: 'What is the longest river in the world?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correct_answer: 1,
    category: 'Geography',
    difficulty: 'hard'
  }
];

export const useQuestions = () => {
  const [questions] = useState<Question[]>(offlineQuestions);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

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
    // No-op for offline mode
    console.log('Answer recorded (offline):', { questionId, answerGiven, isCorrect, responseTimeMs, zone, gameMode });
  };

  return {
    questions,
    loading,
    error,
    getQuestionByZone,
    recordAnswer,
  };
};