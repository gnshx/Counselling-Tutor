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
    question: 'Which subjects bring out your curiosity and enthusiasm?',
    category: 'passions',
    icon: '🌱',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'mathematics', label: 'Mathematics & Logic' },
      { value: 'science', label: 'Science & Discovery' },
      { value: 'computers', label: 'Computers & Technology' },
      { value: 'languages', label: 'Languages & Literature' },
      { value: 'social_studies', label: 'Social Studies & History' },
      { value: 'arts', label: 'Creative Arts & Music' },
      { value: 'sports', label: 'Sports & Athletics' },
      { value: 'other', label: 'Other Exciting Subjects' },
    ],
  },
  {
    id: 'q2',
    question: 'Which activities do you find most fun and fulfilling?',
    category: 'joyful_activities',
    icon: '✨',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'solving_puzzles', label: 'Solving fun puzzles & brain teasers' },
      { value: 'using_computers', label: 'Creating with technology & gadgets' },
      { value: 'building_repairing', label: 'Designing or building cool things' },
      { value: 'drawing_designing', label: 'Drawing, sketching & creative design' },
      { value: 'working_nature', label: 'Exploring nature & environment' },
      { value: 'helping_people', label: 'Inspiring & helping friends' },
      { value: 'sports_physical', label: 'Playing sports & staying active' },
      { value: 'reading_learning', label: 'Discovering new books & ideas' },
      { value: 'talking_explaining', label: 'Sharing ideas & storytelling' },
      { value: 'organizing_leading', label: 'Organizing events & leading teams' },
    ],
  },
  {
    id: 'q3',
    question: 'What are your unique strengths and talents?',
    category: 'superpowers',
    icon: '⭐',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'problem_solving', label: 'Creative Problem-Solving' },
      { value: 'communication', label: 'Expressing Ideas & Communication' },
      { value: 'mathematics', label: 'Mathematical & Logical Thinking' },
      { value: 'creativity', label: 'Artistic & Imaginative Thinking' },
      { value: 'computers', label: 'Digital & Tech Skills' },
      { value: 'practical_technical', label: 'Hands-on Technical Ability' },
      { value: 'teamwork', label: 'Bringing People Together (Teamwork)' },
      { value: 'leadership', label: 'Motivating Others (Leadership)' },
      { value: 'helping_others', label: 'Empathy & Helping Spirit' },
      { value: 'sports', label: 'Physical Agility & Sports' },
    ],
  },
  {
    id: 'q4',
    question: 'In what environment do you feel most energised?',
    category: 'ideal_environment',
    icon: '🤝',
    type: 'single-select',
    options: [
      { value: 'by_myself', label: 'Focused & independent space' },
      { value: 'with_group', label: 'Vibrant team collaboration' },
      { value: 'both', label: 'A healthy mix of both!' },
      { value: 'depends', label: 'Dynamic — depending on the exciting project' },
      { value: 'exploring', label: 'Eager to try all work styles' },
    ],
  },
  {
    id: 'q5',
    question: 'When faced with an exciting new challenge, how do you love to tackle it?',
    category: 'growth_mindset',
    icon: '🚀',
    type: 'single-select',
    options: [
      { value: 'solve_myself', label: 'Dive right in and experiment on my own' },
      { value: 'try_then_ask', label: 'Explore first, then brainstorm with others' },
      { value: 'ask_immediately', label: 'Collaborate with a mentor or teammate right away' },
      { value: 'keep_trying', label: 'Stay curious and persevere until I solve it!' },
      { value: 'creative_ways', label: 'Find a novel, creative way around it' },
    ],
  },
  {
    id: 'q6',
    question: 'Which career paths sound most exciting to explore?',
    category: 'future_passions',
    icon: '🎯',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { value: 'technology', label: 'Building the Future with Technology' },
      { value: 'people', label: 'Working with & Empowering People' },
      { value: 'numbers_data', label: 'Analyzing Data & Financial Insights' },
      { value: 'building_repairing', label: 'Engineering & Crafting Innovations' },
      { value: 'nature_agriculture', label: 'Sustainable Development & Nature' },
      { value: 'creative_design', label: 'Arts, Media & Creative Design' },
      { value: 'teaching_helping', label: 'Healthcare, Education & Mentorship' },
      { value: 'business', label: 'Entrepreneurship & Business Innovation' },
      { value: 'outdoor', label: 'Outdoor Exploration & Environmental Fieldwork' },
      { value: 'exploring_all', label: 'Open to discovering many exciting fields!' },
    ],
  },
  {
    id: 'q7',
    question: 'Is there a dream career or role you are eager to learn more about?',
    category: 'aspirations',
    icon: '🌈',
    type: 'conditional',
    options: [
      { value: 'yes_know_one', label: 'Yes! I have a dream career in mind' },
      { value: 'few_ideas', label: 'I have several exciting ideas' },
      { value: 'dont_know', label: 'I am ready to explore and discover new paths!' },
    ],
    followUp: {
      triggerValue: 'yes_know_one',
      question: {
        id: 'q7_followup',
        question: 'What dream career excites you?',
        category: 'aspirations',
        type: 'text',
        maxLength: 100,
        placeholder: 'e.g. Software Engineer, Doctor, Designer, Entrepreneur...',
      },
    },
  },
  {
    id: 'q8',
    question: 'What inspires you about this path?',
    category: 'inspiration',
    icon: '💡',
    type: 'multi-select',
    maxSelections: 4,
    options: [
      { value: 'enjoy_work', label: 'I truly enjoy doing this kind of work' },
      { value: 'good_at_it', label: 'It aligns with my natural talents' },
      { value: 'family_does_it', label: 'Inspired by role models in my family/community' },
      { value: 'suggested', label: 'Encouraged by teachers or mentors' },
      { value: 'help_people', label: 'Opportunity to make a positive impact on the world' },
      { value: 'good_opportunities', label: 'Great growth & learning opportunities' },
      { value: 'saw_read', label: 'Inspired by amazing stories & innovations' },
      { value: 'other', label: 'Other exciting reasons' },
    ],
  },
  {
    id: 'q9',
    question: 'How eager and ready do you feel to discover your future possibilities?',
    category: 'optimism',
    icon: '🌟',
    type: 'scale',
    options: [
      { value: '1', label: '🌱 Curious to start exploring' },
      { value: '2', label: '💡 Learning new ideas every day' },
      { value: '3', label: '🙂 Positive and open-minded' },
      { value: '4', label: '🌟 Confident in my potential' },
      { value: '5', label: '🚀 Super excited & ready to shine!' },
    ],
  },
  {
    id: 'q10',
    question: 'What positive opportunities or guidance would help you reach your highest potential?',
    category: 'growth_opportunities',
    icon: '☀️',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'explore_tech', label: 'Exploring cutting-edge tech & practical skills' },
      { value: 'hands_on', label: 'Hands-on projects & creative experiments' },
      { value: 'mentorship', label: 'Mentorship & guidance from experts' },
      { value: 'workshops', label: 'Interactive workshops & team activities' },
      { value: 'arts_creative', label: 'Creative design & artistic opportunities' },
      { value: 'sports_leadership', label: 'Sports coaching & leadership programs' },
      { value: 'top_colleges', label: 'Discovering top colleges & field exposures' },
      { value: 'discover_talents', label: 'Discovering hidden talents & strengths' },
      { value: 'general_guidance', label: 'Personalized career counselling' },
    ],
  },
];

// Journey steps for the student flow UI
export const journeySteps = [
  { id: 'passions', label: 'My Passions', icon: '🌱', questionIds: ['q1'] },
  { id: 'strengths', label: 'My Talents', icon: '⭐', questionIds: ['q2', 'q3'] },
  { id: 'style', label: 'My Style', icon: '🚀', questionIds: ['q4', 'q5'] },
  { id: 'dreams', label: 'My Future Dreams', icon: '🎯', questionIds: ['q6', 'q7', 'q8'] },
  { id: 'growth', label: 'My Growth Potential', icon: '☀️', questionIds: ['q9', 'q10'] },
];
