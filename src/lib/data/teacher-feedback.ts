export interface TeacherFeedbackQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multi-select' | 'single-select' | 'text';
  maxSelections?: number;
  options?: { value: string; label: string }[];
  maxLength?: number;
  required: boolean;
}

export const teacherFeedbackQuestions: TeacherFeedbackQuestion[] = [
  {
    id: 'tf1',
    question: "How well do the student's reported interests match what you have observed?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf2',
    question: "How well do the student's reported strengths match your observations?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf3',
    question: "How would you rate the student's problem-solving ability?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf4',
    question: "How would you rate the student's ability to learn independently?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf5',
    question: "How would you rate the student's teamwork?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf6',
    question: "How would you rate the student's communication?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf7',
    question: "How would you rate the student's persistence when facing difficult tasks?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf_sincerity',
    question: "How would you rate the student's sincerity and dedication towards learning and duties?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf_attendance',
    question: "How would you rate the student's attendance, punctuality, and regularity?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf_discipline',
    question: "How would you rate the student's obedience and classroom discipline?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf_respect',
    question: "How would you rate the student's level of respect towards teachers, staff, and peers?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf_cleanliness',
    question: "How would you rate the student's personal cleanliness, neatness, and care for belongings?",
    type: 'rating',
    required: true,
  },
  {
    id: 'tf8',
    question: "Which areas appear to be the student's strongest based on your observations?",
    type: 'multi-select',
    maxSelections: 3,
    required: true,
    options: [
      { value: 'academic', label: 'Academic' },
      { value: 'problem_solving', label: 'Problem-solving' },
      { value: 'communication', label: 'Communication' },
      { value: 'creativity', label: 'Creativity' },
      { value: 'technical_practical', label: 'Technical/practical skills' },
      { value: 'leadership', label: 'Leadership' },
      { value: 'teamwork', label: 'Teamwork' },
      { value: 'sports', label: 'Sports' },
      { value: 'helping_others', label: 'Helping others' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'tf9',
    question: 'Which areas does the student appear most interested in?',
    type: 'multi-select',
    maxSelections: 3,
    required: true,
    options: [
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'science', label: 'Science' },
      { value: 'computers_technology', label: 'Computers/Technology' },
      { value: 'arts_creativity', label: 'Arts/Creativity' },
      { value: 'sports', label: 'Sports' },
      { value: 'agriculture_nature', label: 'Agriculture/Nature' },
      { value: 'technical_machines', label: 'Technical/Machines' },
      { value: 'helping_people', label: 'Helping people' },
      { value: 'business', label: 'Business' },
      { value: 'leadership', label: 'Leadership' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'tf10',
    question: "What is the student's preferred working style based on your observation?",
    type: 'single-select',
    required: true,
    options: [
      { value: 'independent', label: 'Mostly independent (Solo Work)' },
      { value: 'group_based', label: 'Mostly group-based (Team Collaboration)' },
      { value: 'both', label: 'Comfortable with both (Group Work & Solo Work)' },
      { value: 'depends', label: 'Depends on the task context' },
      { value: 'not_enough', label: 'Not enough observation' },
    ],
  },
  {
    id: 'tf_comment',
    question: "Educator Observations & Detailed Assessment (Up to 400–500 words)",
    type: 'text',
    maxLength: 3500,
    required: false,
  },
];
