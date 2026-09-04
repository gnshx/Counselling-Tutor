export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
  proofPrompt?: string;
}

export interface BaseQuestion {
  id: string;
  question: string;
  category: string;
  icon?: string;
  proofPrompt?: string;
  proofPlaceholder?: string;
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
      { value: 'mathematics', label: 'Mathematics & Logic', icon: '🧮' },
      { value: 'science', label: 'Science & Discovery', icon: '🔬' },
      { value: 'computers', label: 'Computers & Technology', icon: '💻' },
      { value: 'languages', label: 'Languages & Literature', icon: '📚' },
      { value: 'social_studies', label: 'Social Studies & History', icon: '🏛️' },
      { value: 'arts', label: 'Creative Arts & Music', icon: '🎨' },
      { value: 'sports', label: 'Sports & Athletics', icon: '⚽' },
      { value: 'other', label: 'Other Exciting Subjects', icon: '✨' },
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
      { value: 'solving_puzzles', label: 'Solving fun puzzles & brain teasers', icon: '🧩' },
      { value: 'using_computers', label: 'Creating with technology & gadgets', icon: '💻' },
      { value: 'building_repairing', label: 'Designing or building cool things', icon: '🛠️' },
      { value: 'drawing_designing', label: 'Drawing, sketching & creative design', icon: '✏️' },
      { value: 'working_nature', label: 'Exploring nature & environment', icon: '🌿' },
      { value: 'helping_people', label: 'Inspiring & helping friends', icon: '🤝' },
      { value: 'sports_physical', label: 'Playing sports & staying active', icon: '🏀' },
      { value: 'reading_learning', label: 'Discovering new books & ideas', icon: '📖' },
      { value: 'talking_explaining', label: 'Sharing ideas & storytelling', icon: '🗣️' },
      { value: 'organizing_leading', label: 'Organizing events & leading teams', icon: '🎯' },
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
      { value: 'problem_solving', label: 'Creative Problem-Solving', icon: '💡' },
      { value: 'communication', label: 'Expressing Ideas & Communication', icon: '💬' },
      { value: 'mathematics', label: 'Mathematical & Logical Thinking', icon: '📐' },
      { value: 'creativity', label: 'Artistic & Imaginative Thinking', icon: '🎨' },
      { value: 'computers', label: 'Digital & Tech Skills', icon: '🤖' },
      { value: 'practical_technical', label: 'Hands-on Technical Ability', icon: '⚙️' },
      { value: 'teamwork', label: 'Bringing People Together (Teamwork)', icon: '👥' },
      { value: 'leadership', label: 'Motivating Others (Leadership)', icon: '👑' },
      { value: 'helping_others', label: 'Empathy & Helping Spirit', icon: '❤️' },
      { value: 'sports', label: 'Physical Agility & Sports', icon: '🏃' },
    ],
  },
  {
    id: 'q4',
    question: 'In what environment do you feel most energised?',
    category: 'ideal_environment',
    icon: '🤝',
    type: 'single-select',
    proofPrompt: 'Please give a quick real example or proof of what you did:',
    options: [
      {
        value: 'by_myself',
        label: 'Focused & independent space (Solo Work)',
        icon: '🧘',
        proofPrompt: 'Give a quick example or proof of solo work you completed on your own:',
      },
      {
        value: 'with_group',
        label: 'Vibrant team collaboration (Group Work)',
        icon: '👥',
        proofPrompt: 'Give a quick example or proof of group work you did with a team:',
      },
      {
        value: 'both',
        label: 'A healthy mix of both (Group Work & Solo Work)',
        icon: '⚖️',
        proofPrompt: 'Give an example of a project you did (group or solo):',
      },
      {
        value: 'depends',
        label: 'Dynamic — depending on the project',
        icon: '🔄',
        proofPrompt: 'Give a quick example of a recent group or solo task:',
      },
      {
        value: 'exploring',
        label: 'Eager to try all work styles',
        icon: '🌟',
        proofPrompt: 'Give a quick example of a project or task you enjoyed:',
      },
    ],
  },
  {
    id: 'q5',
    question: 'When faced with an exciting new challenge, how do you love to tackle it?',
    category: 'growth_mindset',
    icon: '🚀',
    type: 'single-select',
    options: [
      { value: 'solve_myself', label: 'Dive right in and experiment on my own', icon: '🔍' },
      { value: 'try_then_ask', label: 'Explore first, then brainstorm with others', icon: '🧠' },
      { value: 'ask_immediately', label: 'Collaborate with a mentor or teammate right away', icon: '🙋' },
      { value: 'keep_trying', label: 'Stay curious and persevere until I solve it!', icon: '💪' },
      { value: 'creative_ways', label: 'Find a novel, creative way around it', icon: '🔮' },
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
      { value: 'technology', label: 'Building the Future with Technology', icon: '💻' },
      { value: 'people', label: 'Working with & Empowering People', icon: '🤝' },
      { value: 'numbers_data', label: 'Analyzing Data & Financial Insights', icon: '📊' },
      { value: 'building_repairing', label: 'Engineering & Crafting Innovations', icon: '🏗️' },
      { value: 'nature_agriculture', label: 'Sustainable Development & Nature', icon: '🌱' },
      { value: 'creative_design', label: 'Arts, Media & Creative Design', icon: '🎨' },
      { value: 'teaching_helping', label: 'Healthcare, Education & Mentorship', icon: '🩺' },
      { value: 'business', label: 'Entrepreneurship & Business Innovation', icon: '💼' },
      { value: 'outdoor', label: 'Outdoor Exploration & Environmental Fieldwork', icon: '🏕️' },
      { value: 'exploring_all', label: 'Open to discovering many exciting fields!', icon: '🌈' },
    ],
  },
  {
    id: 'q7',
    question: 'Is there a dream career or role you are eager to learn more about?',
    category: 'aspirations',
    icon: '🌈',
    type: 'conditional',
    options: [
      { value: 'yes_know_one', label: 'Yes! I have a dream career in mind', icon: '🌟' },
      { value: 'few_ideas', label: 'I have several exciting ideas', icon: '💡' },
      { value: 'dont_know', label: 'I am ready to explore and discover new paths!', icon: '🚀' },
    ],
    followUp: {
      triggerValue: 'yes_know_one',
      question: {
        id: 'q7_followup',
        question: 'What dream career excites you? (Give a brief example / proof)',
        category: 'aspirations',
        type: 'text',
        maxLength: 100,
        placeholder: 'e.g. Software Engineer (built a small website), Doctor, Designer...',
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
      { value: 'enjoy_work', label: 'I truly enjoy doing this kind of work', icon: '❤️' },
      { value: 'good_at_it', label: 'It aligns with my natural talents', icon: '⭐' },
      { value: 'family_does_it', label: 'Inspired by role models in my family/community', icon: '👨‍👩‍👧' },
      { value: 'suggested', label: 'Encouraged by teachers or mentors', icon: '🎓' },
      { value: 'help_people', label: 'Opportunity to make a positive impact on the world', icon: '🌍' },
      { value: 'good_opportunities', label: 'Great growth & learning opportunities', icon: '🚀' },
      { value: 'saw_read', label: 'Inspired by amazing stories & innovations', icon: '📖' },
      { value: 'other', label: 'Other exciting reasons', icon: '✨' },
    ],
  },
  {
    id: 'q9',
    question: 'How eager and ready do you feel to discover your future possibilities?',
    category: 'optimism',
    icon: '🌟',
    type: 'scale',
    options: [
      { value: '1', label: '🌱 Curious to start exploring', icon: '🌱' },
      { value: '2', label: '💡 Learning new ideas every day', icon: '💡' },
      { value: '3', label: '🙂 Positive and open-minded', icon: '🙂' },
      { value: '4', label: '🌟 Confident in my potential', icon: '🌟' },
      { value: '5', label: '🚀 Super excited & ready to shine!', icon: '🚀' },
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
      { value: 'explore_tech', label: 'Exploring cutting-edge tech & practical skills', icon: '💻' },
      { value: 'hands_on', label: 'Hands-on projects & creative experiments', icon: '🔬' },
      { value: 'mentorship', label: 'Mentorship & guidance from experts', icon: '🧠' },
      { value: 'workshops', label: 'Interactive workshops & team activities', icon: '👥' },
      { value: 'arts_creative', label: 'Creative design & artistic opportunities', icon: '🎨' },
      { value: 'sports_leadership', label: 'Sports coaching & leadership programs', icon: '🏆' },
      { value: 'top_colleges', label: 'Discovering top colleges & field exposures', icon: '🏛️' },
      { value: 'discover_talents', label: 'Discovering hidden talents & strengths', icon: '⭐' },
      { value: 'general_guidance', label: 'Personalized career counselling', icon: '🎯' },
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
