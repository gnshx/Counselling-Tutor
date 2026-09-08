export interface TeacherFeedbackQuestion {
  id: string;
  question: string;
  questionHi?: string;
  type: 'rating' | 'multi-select' | 'single-select' | 'text';
  maxSelections?: number;
  options?: { value: string; label: string; labelHi?: string }[];
  maxLength?: number;
  required: boolean;
  guidance?: string[];
  guidanceHi?: string[];
}

export const teacherFeedbackQuestions: TeacherFeedbackQuestion[] = [
  {
    id: 'tf1',
    question: "How well do the student's reported interests match what you have observed?",
    questionHi: 'विद्यार्थी द्वारा बताई गई रुचियाँ आपके अवलोकन से कितनी मेल खाती हैं?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf2',
    question: "How well do the student's reported strengths match your observations?",
    questionHi: 'विद्यार्थी द्वारा बताई गई खूबियाँ आपके अवलोकन से कितनी मेल खाती हैं?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf3',
    question: "How would you rate the student's problem-solving ability?",
    questionHi: 'आप विद्यार्थी की समस्या-समाधान क्षमता को कैसे आँकेंगे?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf4',
    question: "How would you rate the student's ability to learn independently?",
    questionHi: 'आप विद्यार्थी की स्वतंत्र रूप से सीखने की क्षमता को कैसे आँकेंगे?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf5',
    question: "How would you rate the student's teamwork?",
    questionHi: 'आप विद्यार्थी की टीम में काम करने की क्षमता को कैसे आँकेंगे?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf6',
    question: "How would you rate the student's communication?",
    questionHi: 'आप विद्यार्थी के संवाद एवं संचार कौशल को कैसे आँकेंगे?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf7',
    question: "How would you rate the student's persistence when facing difficult tasks?",
    questionHi: 'कठिन कार्यों का सामना करते समय विद्यार्थी के निरंतर प्रयास करने की क्षमता को आप कैसे आँकेंगे?',
    type: 'rating',
    required: true,
  },
  {
    id: 'tf_sincerity',
    question: "How would you rate the student's sincerity and dedication towards learning and duties?",
    questionHi: 'सीखने और अपनी जिम्मेदारियों के प्रति विद्यार्थी की ईमानदारी एवं समर्पण को आप कैसे आँकेंगे?',
    type: 'rating',
    required: true,
    guidance: [
      'Genuine effort and earnestness in class assignments and projects.',
      'Honesty, authenticity, and taking personal ownership of learning.',
      'Sustained focus without requiring continuous teacher intervention.',
    ],
    guidanceHi: [
      'कक्षा के कार्यों और प्रोजेक्ट में वास्तविक प्रयास एवं गंभीरता।',
      'सीखने के प्रति ईमानदारी, स्वयं की जिम्मेदारी लेना और अपने कार्य का स्वामित्व रखना।',
      'लगातार शिक्षक के हस्तक्षेप की आवश्यकता के बिना ध्यान केंद्रित करके कार्य करना।',
    ],
  },
  {
    id: 'tf_attendance',
    question: "How would you rate the student's attendance, punctuality, and regularity?",
    questionHi: 'विद्यार्थी की उपस्थिति, समय की पाबंदी और नियमितता को आप कैसे आँकेंगे?',
    type: 'rating',
    required: true,
    guidance: [
      'Regularity in class attendance with minimal unexcused absences.',
      'Arriving on time for classes, laboratory sessions, and group activities.',
      'Timely submission of homework, projects, and lab reports.',
    ],
    guidanceHi: [
      'बिना उचित कारण अनुपस्थित हुए नियमित रूप से कक्षा में उपस्थित रहना।',
      'कक्षाओं, प्रयोगशाला सत्रों और समूह गतिविधियों में समय पर पहुँचना।',
      'गृहकार्य, प्रोजेक्ट और प्रयोगशाला रिपोर्ट समय पर जमा करना।',
    ],
  },
  {
    id: 'tf_discipline',
    question: "How would you rate the student's obedience and classroom discipline?",
    questionHi: 'विद्यार्थी के अनुशासन और निर्देशों का पालन करने की क्षमता को आप कैसे आँकेंगे?',
    type: 'rating',
    required: true,
    guidance: [
      'Adherence to school policies, classroom decorum, and instructions.',
      'Maintaining self-control during independent work and group activities.',
      'Respectful, non-disruptive behavior towards teachers and classmates.',
    ],
    guidanceHi: [
      'विद्यालय के नियमों, कक्षा के अनुशासन और दिए गए निर्देशों का पालन करना।',
      'व्यक्तिगत कार्य और समूह गतिविधियों के दौरान आत्म-नियंत्रण बनाए रखना।',
      'शिक्षकों और सहपाठियों के प्रति सम्मानजनक एवं बिना व्यवधान वाला व्यवहार करना।',
    ],
  },
  {
    id: 'tf_respect',
    question: "How would you rate the student's level of respect towards teachers, staff, and peers?",
    questionHi: 'शिक्षकों, विद्यालय के कर्मचारियों और सहपाठियों के प्रति विद्यार्थी के सम्मान के स्तर को आप कैसे आँकेंगे?',
    type: 'rating',
    required: true,
    guidance: [
      'Polite tone, active listening, and courteous speech with teachers and staff.',
      'Openness to constructive feedback, advice, and guidance.',
      'Empathy, inclusion, and kindness towards peers of all backgrounds.',
    ],
    guidanceHi: [
      'शिक्षकों और कर्मचारियों के साथ विनम्र भाषा, ध्यानपूर्वक सुनना और शिष्ट व्यवहार।',
      'रचनात्मक प्रतिक्रिया, सलाह और मार्गदर्शन को स्वीकार करने की तत्परता।',
      'सभी सहपाठियों के प्रति संवेदनशीलता, समावेशी व्यवहार और सहयोग की भावना।',
    ],
  },
  {
    id: 'tf_cleanliness',
    question: "How would you rate the student's personal cleanliness, neatness, and care for belongings?",
    questionHi: 'विद्यार्थी की व्यक्तिगत स्वच्छता, साफ-सफाई और अपनी वस्तुओं की देखभाल को आप कैसे आँकेंगे?',
    type: 'rating',
    required: true,
    guidance: [
      'Keeping study desk, laboratory bench, and workspace organized.',
      'Careful handling and neat presentation of books, notebooks, and equipment.',
      'Personal hygiene, tidy uniform/attire, and pride in neat work.',
    ],
    guidanceHi: [
      'अध्ययन की मेज़, प्रयोगशाला की कार्य-मेज और कार्यस्थल को व्यवस्थित रखना।',
      'पुस्तकों, नोटबुक और उपकरणों को सावधानी से संभालना और व्यवस्थित रखना।',
      'व्यक्तिगत स्वच्छता, साफ-सुथरी वेशभूषा और अपने कार्य को साफ-सुथरा रखने की आदत।',
    ],
  },
  {
    id: 'tf8',
    question: "Which areas appear to be the student's strongest based on your observations?",
    questionHi: 'आपके अवलोकन के आधार पर विद्यार्थी की सबसे मजबूत क्षमताएँ किन क्षेत्रों में दिखाई देती हैं?',
    type: 'multi-select',
    maxSelections: 3,
    required: true,
    options: [
      { value: 'academic', label: 'Academic', labelHi: 'शैक्षणिक क्षमता' },
      { value: 'problem_solving', label: 'Problem-solving', labelHi: 'समस्या-समाधान' },
      { value: 'communication', label: 'Communication', labelHi: 'संचार कौशल' },
      { value: 'creativity', label: 'Creativity', labelHi: 'रचनात्मकता' },
      { value: 'technical_practical', label: 'Technical/practical skills', labelHi: 'तकनीकी/व्यावहारिक कौशल' },
      { value: 'leadership', label: 'Leadership', labelHi: 'नेतृत्व क्षमता' },
      { value: 'teamwork', label: 'Teamwork', labelHi: 'टीमवर्क' },
      { value: 'sports', label: 'Sports', labelHi: 'खेल-कूद' },
      { value: 'helping_others', label: 'Helping others', labelHi: 'दूसरों की मदद करना' },
      { value: 'other', label: 'Other', labelHi: 'अन्य' },
    ],
  },
  {
    id: 'tf9',
    question: 'Which career direction interest areas align best with this student?',
    questionHi: 'विद्यार्थी की रुचियों के अनुसार कौन-से करियर क्षेत्र सबसे अधिक उपयुक्त दिखाई देते हैं?',
    type: 'multi-select',
    maxSelections: 3,
    required: true,
    options: [
      { value: 'mathematics', label: 'Mathematics', labelHi: 'गणित' },
      { value: 'science', label: 'Science', labelHi: 'विज्ञान' },
      { value: 'computers_technology', label: 'Computers/Technology', labelHi: 'कंप्यूटर/तकनीक' },
      { value: 'arts_creativity', label: 'Arts/Creativity', labelHi: 'कला/रचनात्मकता' },
      { value: 'sports', label: 'Sports', labelHi: 'खेल' },
      { value: 'agriculture_nature', label: 'Agriculture/Nature', labelHi: 'कृषि/प्रकृति' },
      { value: 'technical_machines', label: 'Technical/Machines', labelHi: 'तकनीकी कार्य/मशीनें' },
      { value: 'helping_people', label: 'Helping people', labelHi: 'लोगों की मदद करना' },
      { value: 'business', label: 'Business', labelHi: 'व्यवसाय' },
      { value: 'leadership', label: 'Leadership', labelHi: 'नेतृत्व' },
      { value: 'other', label: 'Other', labelHi: 'अन्य' },
    ],
  },
  {
    id: 'tf10',
    question: 'What working environment style suits this student best?',
    questionHi: 'विद्यार्थी के लिए कौन-सी कार्यशैली सबसे अधिक उपयुक्त दिखाई देती है?',
    type: 'single-select',
    required: true,
    options: [
      { value: 'independent', label: 'Mostly independent (Solo Work)', labelHi: 'मुख्य रूप से स्वतंत्र रूप से काम करना (अकेले काम)' },
      { value: 'group_based', label: 'Mostly group-based (Team Collaboration)', labelHi: 'मुख्य रूप से समूह में काम करना (टीम सहयोग)' },
      { value: 'both', label: 'Comfortable with both (Group Work & Solo Work)', labelHi: 'दोनों में सहज (समूह और अकेले काम)' },
      { value: 'depends', label: 'Depends on the task context', labelHi: 'कार्य की परिस्थिति के अनुसार' },
      { value: 'not_enough', label: 'Not enough observation', labelHi: 'पर्याप्त अवलोकन उपलब्ध नहीं है' },
    ],
  },
  {
    id: 'tf_comment',
    question: 'Educator Observations & Detailed Assessment (Up to 400–500 words) [OPTIONAL]',
    questionHi: 'शिक्षक/परामर्शदाता के अवलोकन एवं विस्तृत आकलन [वैकल्पिक]',
    type: 'text',
    maxLength: 3500,
    required: false,
  },
];
