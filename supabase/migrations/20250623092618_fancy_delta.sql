/*
  # Insert Trivia Questions

  1. Insert all trivia questions from the game into the database
  2. Questions are categorized by difficulty and subject
*/

INSERT INTO questions (question_id, question, options, correct_answer, category, difficulty) VALUES
-- Easy Questions
('1', 'What is the capital of France?', '["London", "Berlin", "Paris", "Madrid"]', 2, 'Geography', 'easy'),
('2', 'How many legs does a spider have?', '["6", "8", "10", "12"]', 1, 'Science', 'easy'),
('3', 'What color do you get when you mix red and blue?', '["Green", "Yellow", "Purple", "Orange"]', 2, 'Art', 'easy'),
('4', 'Which planet is closest to the Sun?', '["Venus", "Earth", "Mercury", "Mars"]', 2, 'Science', 'easy'),
('5', 'What is 5 + 7?', '["11", "12", "13", "14"]', 1, 'Math', 'easy'),
('17', 'What gas do plants absorb from the atmosphere?', '["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"]', 2, 'Science', 'easy'),
('18', 'Which country invented pizza?', '["France", "Italy", "Greece", "Spain"]', 1, 'Culture', 'easy'),

-- Medium Questions
('6', 'Who wrote "Romeo and Juliet"?', '["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]', 1, 'Literature', 'medium'),
('7', 'What is the chemical symbol for gold?', '["Go", "Gd", "Au", "Ag"]', 2, 'Science', 'medium'),
('8', 'In which year did World War II end?', '["1944", "1945", "1946", "1947"]', 1, 'History', 'medium'),
('9', 'What is the square root of 64?', '["6", "7", "8", "9"]', 2, 'Math', 'medium'),
('10', 'Which ocean is the largest?', '["Atlantic", "Indian", "Arctic", "Pacific"]', 3, 'Geography', 'medium'),
('16', 'How many minutes are in a full day?', '["1440", "1400", "1480", "1420"]', 0, 'Math', 'medium'),
('19', 'What is the hardest natural substance on Earth?', '["Gold", "Iron", "Diamond", "Platinum"]', 2, 'Science', 'medium'),

-- Hard Questions
('11', 'What is the powerhouse of the cell?', '["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"]', 2, 'Science', 'hard'),
('12', 'Who painted "The Starry Night"?', '["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"]', 1, 'Art', 'hard'),
('13', 'What is the derivative of x²?', '["x", "2x", "x²", "2x²"]', 1, 'Math', 'hard'),
('14', 'Which programming language was created by Brendan Eich?', '["Python", "Java", "JavaScript", "C++"]', 2, 'Technology', 'hard'),
('15', 'What is the longest river in the world?', '["Amazon River", "Nile River", "Yangtze River", "Mississippi River"]', 1, 'Geography', 'hard'),
('20', 'Who developed the theory of relativity?', '["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"]', 1, 'Science', 'hard');