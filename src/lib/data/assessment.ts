export interface AssessmentQuestion {
  id: string;
  question: string;
  category: 'general_awareness' | 'basic_aptitude' | 'practical_decision_making';
  categoryLabel: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // ── General Awareness (5 questions) ──
  {
    id: 'a1',
    question: 'What should you do when the traffic light is red?',
    category: 'general_awareness',
    categoryLabel: '🌍 General Awareness',
    options: ['Go quickly', 'Stop and wait', 'Ignore it', 'Run across'],
    correctAnswer: 'Stop and wait',
  },
  {
    id: 'a2',
    question: "Which number is for police, ambulance, and fire engine?",
    category: 'general_awareness',
    categoryLabel: '🌍 General Awareness',
    options: ['Police - 100', 'Ambulance - 108', 'Fire - 101', 'All in one - 112'],
    correctAnswer: 'All in one - 112',
  },
  {
    id: 'a3',
    question: 'Before crossing a busy road, what should you do?',
    category: 'general_awareness',
    categoryLabel: '🌍 General Awareness',
    options: [
      'Run without looking',
      'Look carefully for traffic and cross safely',
      'Follow anyone nearby',
      'Use your phone while crossing',
    ],
    correctAnswer: 'Look carefully for traffic and cross safely',
  },
  {
    id: 'a4',
    question: 'Why should we wash our hands before eating?',
    category: 'general_awareness',
    categoryLabel: '🌍 General Awareness',
    options: [
      'To remove germs and reduce illness',
      'To make our hands cold',
      'To make food taste better',
      'It is not necessary',
    ],
    correctAnswer: 'To remove germs and reduce illness',
  },
  {
    id: 'a5',
    question: 'Which planet do we live on?',
    category: 'general_awareness',
    categoryLabel: '🌍 General Awareness',
    options: ['Mars', 'Earth', 'Jupiter', 'Venus'],
    correctAnswer: 'Earth',
  },

  // ── Basic Aptitude (5 questions) ──
  {
    id: 'a6',
    question: 'What comes next?\n2 → 4 → 6 → 8 → ?',
    category: 'basic_aptitude',
    categoryLabel: '🧮 Basic Aptitude',
    options: ['9', '10', '11', '12'],
    correctAnswer: '10',
  },
  {
    id: 'a7',
    question: 'If 3 pencils cost ₹15, how much does 1 pencil cost?',
    category: 'basic_aptitude',
    categoryLabel: '🧮 Basic Aptitude',
    options: ['₹3', '₹5', '₹10', '₹15'],
    correctAnswer: '₹5',
  },
  {
    id: 'a8',
    question: 'Which number is different?\n2, 4, 6, 7, 8',
    category: 'basic_aptitude',
    categoryLabel: '🧮 Basic Aptitude',
    options: ['2', '4', '7', '8'],
    correctAnswer: '7',
  },
  {
    id: 'a9',
    question: 'Raju is taller than Amit. Amit is taller than Ravi.\nWho is the shortest?',
    category: 'basic_aptitude',
    categoryLabel: '🧮 Basic Aptitude',
    options: ['Raju', 'Amit', 'Ravi', 'Cannot tell'],
    correctAnswer: 'Ravi',
  },
  {
    id: 'a10',
    question: 'Which one does NOT belong?',
    category: 'basic_aptitude',
    categoryLabel: '🧮 Basic Aptitude',
    hint: 'Doctor, Nurse, Teacher, Hospital',
    options: ['Doctor', 'Nurse', 'Teacher', 'Hospital'],
    correctAnswer: 'Hospital',
  },

  // ── Practical Decision Making (5 questions) ──
  {
    id: 'a11',
    question: "You don't understand something in class. What should you do?",
    category: 'practical_decision_making',
    categoryLabel: '💡 Practical Decision Making',
    options: [
      'Give up',
      'Ask the teacher or someone who can help',
      'Copy someone',
      'Ignore it',
    ],
    correctAnswer: 'Ask the teacher or someone who can help',
  },
  {
    id: 'a12',
    question: 'You make a mistake while doing something. What should you do?',
    category: 'practical_decision_making',
    categoryLabel: '💡 Practical Decision Making',
    options: [
      'Hide it',
      'Blame someone',
      'Understand the mistake and try again',
      'Stop learning',
    ],
    correctAnswer: 'Understand the mistake and try again',
  },
  {
    id: 'a13',
    question: 'Two students in your group have different ideas. What should you do?',
    category: 'practical_decision_making',
    categoryLabel: '💡 Practical Decision Making',
    options: [
      'Fight',
      'Ignore the other person',
      'Listen to both ideas and discuss them',
      'Leave the group',
    ],
    correctAnswer: 'Listen to both ideas and discuss them',
  },
  {
    id: 'a14',
    question: 'You have two important tasks and limited time. What should you do?',
    category: 'practical_decision_making',
    categoryLabel: '💡 Practical Decision Making',
    options: [
      'Do nothing',
      'Decide which is more urgent and plan your time',
      'Randomly choose one',
      'Wait for someone else',
    ],
    correctAnswer: 'Decide which is more urgent and plan your time',
  },
  {
    id: 'a15',
    question: "You don't know how to do a new task. What is the best approach?",
    category: 'practical_decision_making',
    categoryLabel: '💡 Practical Decision Making',
    options: [
      'Pretend you know',
      'Ask questions, learn and try',
      'Give up',
      'Avoid the task',
    ],
    correctAnswer: 'Ask questions, learn and try',
  },
];
