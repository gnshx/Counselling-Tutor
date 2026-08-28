export interface QuestionOption {
  value: string;
  label: string;
}

export interface BaseQuestion {
  id: string;
  question: string;
  category: string;
  icon?: string;
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi-select';
  options: QuestionOption[];
  maxSelections: number;
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: 'single-select';
  options: QuestionOption[];
}

export interface ScaleQuestion extends BaseQuestion {
  type: 'scale';
  options: QuestionOption[];
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  maxLength?: number;
  placeholder?: string;
}

export interface ConditionalQuestion extends BaseQuestion {
  type: 'conditional';
  options: QuestionOption[];
  followUp?: {
    triggerValue: string;
    question: TextQuestion;
  };
}

export type QuestionnaireQuestion =
  | MultiSelectQuestion
  | SingleSelectQuestion
  | ScaleQuestion
  | TextQuestion
  | ConditionalQuestion;

export const questionnaireQuestions: QuestionnaireQuestion[] = [
  {
    id: 'q1',
    question: 'Which subjects do you enjoy the most?',
    category: 'interests',
    icon: '🌱',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'science', label: 'Science' },
      { value: 'computers', label: 'Computers' },
      { value: 'languages', label: 'Languages' },
      { value: 'social_studies', label: 'Social Studies' },
      { value: 'arts', label: 'Arts' },
      { value: 'sports', label: 'Sports' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'q2',
    question: 'Which activities do you enjoy doing?',
    category: 'interests',
    icon: '💡',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'solving_puzzles', label: 'Solving puzzles/problems' },
      { value: 'using_computers', label: 'Using computers/technology' },
      { value: 'building_repairing', label: 'Building or repairing things' },
      { value: 'drawing_designing', label: 'Drawing/designing/creating' },
      { value: 'working_nature', label: 'Working with plants/nature' },
      { value: 'helping_people', label: 'Helping people' },
      { value: 'sports_physical', label: 'Sports/physical activities' },
      { value: 'reading_learning', label: 'Reading/learning' },
      { value: 'talking_explaining', label: 'Talking/explaining things' },
      { value: 'organizing_leading', label: 'Organizing/leading people' },
    ],
  },
  {
    id: 'q3',
    question: 'What do you think you are good at?',
    category: 'strengths',
    icon: '🧩',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'problem_solving', label: 'Problem-solving' },
      { value: 'communication', label: 'Communication' },
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'creativity', label: 'Creativity' },
      { value: 'computers', label: 'Computers' },
      { value: 'practical_technical', label: 'Practical/technical work' },
      { value: 'teamwork', label: 'Teamwork' },
      { value: 'leadership', label: 'Leadership' },
      { value: 'helping_others', label: 'Helping others' },
      { value: 'sports', label: 'Sports' },
    ],
  },
  {
    id: 'q4',
    question: 'How do you prefer to work?',
    category: 'work_preference',
    icon: '🤝',
    type: 'single-select',
    options: [
      { value: 'by_myself', label: 'Mostly by myself' },
      { value: 'with_group', label: 'Mostly with a group' },
      { value: 'both', label: 'Both' },
      { value: 'depends', label: 'It depends on the task' },
      { value: 'not_sure', label: "I'm not sure" },
    ],
  },
  {
    id: 'q5',
    question: 'When you get a difficult task, what do you usually do?',
    category: 'persistence',
    icon: '💪',
    type: 'single-select',
    options: [
      { value: 'solve_myself', label: 'Try to solve it myself' },
      { value: 'try_then_ask', label: 'Try first, then ask for help' },
      { value: 'ask_immediately', label: 'Ask someone immediately' },
      { value: 'keep_trying', label: 'Keep trying even if it takes a long time' },
      { value: 'avoid', label: 'I usually avoid difficult tasks' },
    ],
  },
  {
    id: 'q6',
    question: 'Which type of work sounds most interesting to you?',
    category: 'career_interest',
    icon: '🎯',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { value: 'technology', label: 'Working with technology' },
      { value: 'people', label: 'Working with people' },
      { value: 'numbers_data', label: 'Working with numbers/data' },
      { value: 'building_repairing', label: 'Building/repairing things' },
      { value: 'nature_agriculture', label: 'Working with nature/agriculture' },
      { value: 'creative_design', label: 'Creative/design work' },
      { value: 'teaching_helping', label: 'Teaching/helping others' },
      { value: 'business', label: 'Business/starting something' },
      { value: 'outdoor', label: 'Outdoor/field work' },
      { value: 'dont_know', label: "I don't know yet" },
    ],
  },
  {
    id: 'q7',
    question: 'Is there a career/job you are currently interested in?',
    category: 'career_awareness',
    icon: '🔮',
    type: 'conditional',
    options: [
      { value: 'yes_know_one', label: 'Yes, I know one' },
      { value: 'few_ideas', label: 'I have a few ideas' },
      { value: 'dont_know', label: "I don't know yet" },
    ],
    followUp: {
      triggerValue: 'yes_know_one',
      question: {
        id: 'q7_followup',
        question: 'What career are you interested in?',
        category: 'career_awareness',
        type: 'text',
        maxLength: 100,
        placeholder: 'Type the career you are interested in...',
      },
    },
  },
  {
    id: 'q8',
    question: 'Why are you interested in that career?',
    category: 'career_motivation',
    icon: '❓',
    type: 'multi-select',
    maxSelections: 8,
    options: [
      { value: 'enjoy_work', label: 'I enjoy this type of work' },
      { value: 'good_at_it', label: 'I think I am good at it' },
      { value: 'family_does_it', label: 'Someone in my family does it' },
      { value: 'suggested', label: 'Someone suggested it to me' },
      { value: 'help_people', label: 'I want to help people' },
      { value: 'good_opportunities', label: 'I think it has good opportunities' },
      { value: 'saw_read', label: 'I saw/read about it' },
      { value: 'dont_know', label: "I don't know" },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'q9',
    question: 'How confident are you about choosing a career?',
    category: 'career_confidence',
    icon: '📊',
    type: 'scale',
    options: [
      { value: '1', label: '😟 Not confident' },
      { value: '2', label: '🙁 Slightly confident' },
      { value: '3', label: '😐 Not sure' },
      { value: '4', label: '🙂 Confident' },
      { value: '5', label: '🤩 Very confident' },
    ],
  },
  {
    id: 'q10',
    question: 'What is the biggest thing that may make it difficult for you to continue your education or reach your career goal?',
    category: 'barriers',
    icon: '🚧',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { value: 'financial', label: 'Money/financial problems' },
      { value: 'dont_know_study', label: "I don't know what to study" },
      { value: 'dont_know_options', label: "I don't know about career options" },
      { value: 'study_difficulty', label: 'Difficulty in studies' },
      { value: 'family_responsibilities', label: 'Family responsibilities' },
      { value: 'family_expectations', label: 'Family expectations' },
      { value: 'lack_courses', label: 'Lack of nearby courses/colleges' },
      { value: 'lack_confidence', label: 'Lack of confidence' },
      { value: 'no_difficulty', label: "I don't think I have any major difficulty" },
      { value: 'other', label: 'Other' },
    ],
  },
];

// Journey steps for the student flow UI
export const journeySteps = [
  { id: 'about', label: 'About Me', icon: '🌱', questionIds: ['q1'] },
  { id: 'interests', label: 'My Interests', icon: '💡', questionIds: ['q2', 'q3'] },
  { id: 'strengths', label: 'My Strengths', icon: '🧩', questionIds: ['q4', 'q5'] },
  { id: 'future', label: 'My Future', icon: '🎯', questionIds: ['q6', 'q7', 'q8'] },
  { id: 'confidence', label: 'My Confidence', icon: '📊', questionIds: ['q9', 'q10'] },
];
