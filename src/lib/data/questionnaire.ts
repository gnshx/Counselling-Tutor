export interface QuestionOption {
  value: string;
  label: string;
  labelHi?: string;
  icon?: string;
  proofPrompt?: string;
  proofPromptHi?: string;
}

export interface BaseQuestion {
  id: string;
  question: string;
  questionHi?: string;
  category: string;
  categoryHi?: string;
  icon?: string;
  proofPrompt?: string;
  proofPromptHi?: string;
  proofPlaceholder?: string;
  proofPlaceholderHi?: string;
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
  placeholderHi?: string;
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
    questionHi: 'किन विषयों को पढ़ते समय आपकी जिज्ञासा और उत्साह बढ़ जाता है?',
    category: 'passions',
    categoryHi: 'मेरी रुचियाँ',
    icon: '🌱',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'mathematics', label: 'Mathematics & Logic', labelHi: 'गणित और तर्कशक्ति', icon: '🧮' },
      { value: 'science', label: 'Science & Discovery', labelHi: 'विज्ञान और खोज', icon: '🔬' },
      { value: 'computers', label: 'Computers & Technology', labelHi: 'कंप्यूटर और तकनीक', icon: '💻' },
      { value: 'languages', label: 'Languages & Literature', labelHi: 'भाषाएँ और साहित्य', icon: '📚' },
      { value: 'social_studies', label: 'Social Studies & History', labelHi: 'सामाजिक अध्ययन और इतिहास', icon: '🏛️' },
      { value: 'arts', label: 'Creative Arts & Music', labelHi: 'रचनात्मक कला और संगीत', icon: '🎨' },
      { value: 'sports', label: 'Sports & Athletics', labelHi: 'खेल और शारीरिक गतिविधियाँ', icon: '⚽' },
      { value: 'other', label: 'Other Exciting Subjects', labelHi: 'अन्य पसंदीदा विषय', icon: '✨' },
    ],
  },
  {
    id: 'q2',
    question: 'Which activities do you find most fun and fulfilling?',
    questionHi: 'किन गतिविधियों को करना आपको सबसे अधिक मज़ेदार और संतोषजनक लगता है?',
    category: 'joyful_activities',
    categoryHi: 'आनंददायक गतिविधियाँ',
    icon: '✨',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'solving_puzzles', label: 'Solving fun puzzles & brain teasers', labelHi: 'मज़ेदार पहेलियाँ और दिमागी प्रश्न हल करना', icon: '🧩' },
      { value: 'using_computers', label: 'Creating with technology & gadgets', labelHi: 'तकनीक और गैजेट्स के साथ कुछ नया बनाना', icon: '💻' },
      { value: 'building_repairing', label: 'Designing or building cool things', labelHi: 'नई चीज़ों को डिज़ाइन करना या बनाना', icon: '🛠️' },
      { value: 'drawing_designing', label: 'Drawing, sketching & creative design', labelHi: 'चित्र बनाना, स्केच करना और रचनात्मक डिज़ाइन करना', icon: '✏️' },
      { value: 'working_nature', label: 'Exploring nature & environment', labelHi: 'प्रकृति और पर्यावरण को जानना और समझना', icon: '🌿' },
      { value: 'helping_people', label: 'Inspiring & helping friends', labelHi: 'दोस्तों की मदद करना और उन्हें प्रेरित करना', icon: '🤝' },
      { value: 'sports_physical', label: 'Playing sports & staying active', labelHi: 'खेल खेलना और शारीरिक रूप से सक्रिय रहना', icon: '🏀' },
      { value: 'reading_learning', label: 'Discovering new books & ideas', labelHi: 'नई किताबें पढ़ना और नए विचारों को जानना', icon: '📖' },
      { value: 'talking_explaining', label: 'Sharing ideas & storytelling', labelHi: 'अपने विचार साझा करना और कहानियाँ सुनाना', icon: '🗣️' },
      { value: 'organizing_leading', label: 'Organizing events & leading teams', labelHi: 'कार्यक्रम आयोजित करना और टीम का नेतृत्व करना', icon: '🎯' },
    ],
  },
  {
    id: 'q3',
    question: 'What are your unique strengths and talents?',
    questionHi: 'आपकी विशिष्ट खूबियाँ और प्रतिभाएँ क्या हैं?',
    category: 'superpowers',
    categoryHi: 'मेरी विशेष क्षमताएँ',
    icon: '⭐',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'problem_solving', label: 'Creative Problem-Solving', labelHi: 'रचनात्मक तरीके से समस्याओं का समाधान करना', icon: '💡' },
      { value: 'communication', label: 'Expressing Ideas & Communication', labelHi: 'विचारों को व्यक्त करना और प्रभावी संवाद करना', icon: '💬' },
      { value: 'mathematics', label: 'Mathematical & Logical Thinking', labelHi: 'गणितीय और तार्किक सोच', icon: '📐' },
      { value: 'creativity', label: 'Artistic & Imaginative Thinking', labelHi: 'कलात्मक और कल्पनाशील सोच', icon: '🎨' },
      { value: 'computers', label: 'Digital & Tech Skills', labelHi: 'डिजिटल और तकनीकी कौशल', icon: '🤖' },
      { value: 'practical_technical', label: 'Hands-on Technical Ability', labelHi: 'व्यावहारिक और तकनीकी कार्य करने की क्षमता', icon: '⚙️' },
      { value: 'teamwork', label: 'Bringing People Together (Teamwork)', labelHi: 'लोगों को साथ लेकर चलना और टीम में काम करना', icon: '👥' },
      { value: 'leadership', label: 'Motivating Others (Leadership)', labelHi: 'दूसरों को प्रेरित करना और नेतृत्व करना', icon: '👑' },
      { value: 'helping_others', label: 'Empathy & Helping Spirit', labelHi: 'दूसरों की भावनाओं को समझना और मदद करने की भावना', icon: '❤️' },
      { value: 'sports', label: 'Physical Agility & Sports', labelHi: 'शारीरिक दक्षता और खेल-कूद', icon: '🏃' },
    ],
  },
  {
    id: 'q4',
    question: 'In what environment do you feel most energised?',
    questionHi: 'आप किस प्रकार के वातावरण में सबसे अधिक ऊर्जावान और उत्साहित महसूस करते हैं?',
    category: 'ideal_environment',
    categoryHi: 'आदर्श कार्य वातावरण',
    icon: '🤝',
    type: 'single-select',
    proofPrompt: 'Please give a quick real example or proof of what you did:',
    proofPromptHi: 'कृपया अपने द्वारा किए गए किसी कार्य का एक छोटा-सा वास्तविक उदाहरण या प्रमाण दें:',
    options: [
      {
        value: 'by_myself',
        label: 'Focused & independent space (Solo Work)',
        labelHi: 'शांत और एकाग्र वातावरण — अकेले काम करना',
        icon: '🧘',
        proofPrompt: 'Give a quick example or proof of solo work you completed on your own:',
        proofPromptHi: 'अपने आप किए गए किसी ऐसे कार्य या प्रोजेक्ट का छोटा-सा उदाहरण दें, जिसे आपने अकेले पूरा किया हो:',
      },
      {
        value: 'with_group',
        label: 'Vibrant team collaboration (Group Work)',
        labelHi: 'सक्रिय और सहयोगात्मक वातावरण — समूह में काम करना',
        icon: '👥',
        proofPrompt: 'Give a quick example or proof of group work you did with a team:',
        proofPromptHi: 'टीम के साथ किए गए किसी कार्य या प्रोजेक्ट का छोटा-सा उदाहरण दें:',
      },
      {
        value: 'both',
        label: 'A healthy mix of both (Group Work & Solo Work)',
        labelHi: 'दोनों का संतुलित मिश्रण — समूह और अकेले, दोनों तरह से काम करना',
        icon: '⚖️',
        proofPrompt: 'Give an example of a project you did (group or solo):',
        proofPromptHi: 'किसी ऐसे प्रोजेक्ट का उदाहरण दें जिसे आपने समूह में या अकेले किया हो:',
      },
      {
        value: 'depends',
        label: 'Dynamic — depending on the project',
        labelHi: 'परिस्थिति के अनुसार बदलने वाली कार्यशैली — प्रोजेक्ट पर निर्भर',
        icon: '🔄',
        proofPrompt: 'Give a quick example of a recent group or solo task:',
        proofPromptHi: 'हाल ही में किए गए किसी समूह या व्यक्तिगत कार्य का छोटा-सा उदाहरण दें:',
      },
      {
        value: 'exploring',
        label: 'Eager to try all work styles',
        labelHi: 'हर तरह की कार्यशैली आज़माने के लिए उत्सुक',
        icon: '🌟',
        proofPrompt: 'Give a quick example of a project or task you enjoyed:',
        proofPromptHi: 'किसी ऐसे प्रोजेक्ट या कार्य का छोटा-सा उदाहरण दें जिसे करने में आपको बहुत आनंद आया:',
      },
    ],
  },
  {
    id: 'q5',
    question: 'When faced with an exciting new challenge, how do you love to tackle it?',
    questionHi: 'जब आपके सामने कोई रोमांचक और नई चुनौती आती है, तो आप उसे किस तरह हल करना पसंद करते हैं?',
    category: 'growth_mindset',
    categoryHi: 'सोच का विकास',
    icon: '🚀',
    type: 'single-select',
    options: [
      { value: 'solve_myself', label: 'Dive right in and experiment on my own', labelHi: 'सीधे चुनौती में जुट जाना और खुद प्रयोग करके समाधान खोजना', icon: '🔍' },
      { value: 'try_then_ask', label: 'Explore first, then brainstorm with others', labelHi: 'पहले समझना और खोज करना, फिर दूसरों के साथ विचार-विमर्श करना', icon: '🧠' },
      { value: 'ask_immediately', label: 'Collaborate with a mentor or teammate right away', labelHi: 'तुरंत किसी मार्गदर्शक या टीम के साथी के साथ मिलकर काम करना', icon: '🙋' },
      { value: 'keep_trying', label: 'Stay curious and persevere until I solve it!', labelHi: 'जिज्ञासु बने रहना और समाधान मिलने तक लगातार प्रयास करते रहना!', icon: '💪' },
      { value: 'creative_ways', label: 'Find a novel, creative way around it', labelHi: 'चुनौती को हल करने के लिए कोई नया और रचनात्मक तरीका खोजना', icon: '🔮' },
    ],
  },
  {
    id: 'q6',
    question: 'Which career paths sound most exciting to explore?',
    questionHi: 'आप किन करियर क्षेत्रों को जानने और उनमें आगे बढ़ने के लिए सबसे अधिक उत्साहित हैं?',
    category: 'future_passions',
    categoryHi: 'भविष्य की रुचियाँ',
    icon: '🎯',
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { value: 'technology', label: 'Building the Future with Technology', labelHi: 'तकनीक के साथ भविष्य का निर्माण करना', icon: '💻' },
      { value: 'people', label: 'Working with & Empowering People', labelHi: 'लोगों के साथ काम करना और उन्हें सशक्त बनाना', icon: '🤝' },
      { value: 'numbers_data', label: 'Analyzing Data & Financial Insights', labelHi: 'आँकड़ों का विश्लेषण और वित्तीय जानकारी को समझना', icon: '📊' },
      { value: 'building_repairing', label: 'Engineering & Crafting Innovations', labelHi: 'इंजीनियरिंग और नई तकनीकों/वस्तुओं का निर्माण करना', icon: '🏗️' },
      { value: 'nature_agriculture', label: 'Sustainable Development & Nature', labelHi: 'सतत विकास और प्रकृति के साथ काम करना', icon: '🌱' },
      { value: 'creative_design', label: 'Arts, Media & Creative Design', labelHi: 'कला, मीडिया और रचनात्मक डिज़ाइन', icon: '🎨' },
      { value: 'teaching_helping', label: 'Healthcare, Education & Mentorship', labelHi: 'स्वास्थ्य सेवा, शिक्षा और मार्गदर्शन', icon: '🩺' },
      { value: 'business', label: 'Entrepreneurship & Business Innovation', labelHi: 'उद्यमिता और व्यवसाय में नए विचारों को आगे बढ़ाना', icon: '💼' },
      { value: 'outdoor', label: 'Outdoor Exploration & Environmental Fieldwork', labelHi: 'बाहरी गतिविधियाँ, प्रकृति की खोज और पर्यावरणीय क्षेत्रीय कार्य', icon: '🏕️' },
      { value: 'exploring_all', label: 'Open to discovering many exciting fields!', labelHi: 'कई अलग-अलग रोमांचक क्षेत्रों को जानने के लिए तैयार!', icon: '🌈' },
    ],
  },
  {
    id: 'q7',
    question: 'Is there a dream career or role you are eager to learn more about?',
    questionHi: 'क्या कोई ऐसा करियर या भूमिका है जिसके बारे में आप और अधिक जानने के लिए उत्सुक हैं?',
    category: 'aspirations',
    categoryHi: 'मेरी आकांक्षाएँ',
    icon: '🌈',
    type: 'conditional',
    options: [
      { value: 'yes_know_one', label: 'Yes! I have a dream career in mind', labelHi: 'हाँ! मेरे मन में एक पसंदीदा करियर है', icon: '🌟' },
      { value: 'few_ideas', label: 'I have several exciting ideas', labelHi: 'मेरे मन में कई रोचक करियर विकल्प हैं', icon: '💡' },
      { value: 'dont_know', label: 'I am ready to explore and discover new paths!', labelHi: 'मैं नए करियर विकल्पों को खोजने और जानने के लिए तैयार हूँ!', icon: '🚀' },
    ],
    followUp: {
      triggerValue: 'yes_know_one',
      question: {
        id: 'q7_followup',
        question: 'What dream career excites you? (Give a brief example / proof)',
        questionHi: 'आपको कौन-सा पसंदीदा करियर सबसे अधिक उत्साहित करता है? (संक्षिप्त उदाहरण / प्रमाण दें)',
        category: 'aspirations',
        type: 'text',
        maxLength: 100,
        placeholder: 'e.g. Software Engineer (built a small website), Doctor, Designer...',
        placeholderHi: 'उदा. सॉफ्टवेयर इंजीनियर (एक छोटी वेबसाइट बनाई), डॉक्टर, डिज़ाइनर...',
      },
    },
  },
  {
    id: 'q8',
    question: 'What inspires you about this path?',
    questionHi: 'इस करियर क्षेत्र के बारे में आपको क्या प्रेरित करता है?',
    category: 'inspiration',
    categoryHi: 'प्रेरणा',
    icon: '💡',
    type: 'multi-select',
    maxSelections: 4,
    options: [
      { value: 'enjoy_work', label: 'I truly enjoy doing this kind of work', labelHi: 'मुझे इस तरह का काम करना वास्तव में पसंद है', icon: '❤️' },
      { value: 'good_at_it', label: 'It aligns with my natural talents', labelHi: 'यह मेरी स्वाभाविक प्रतिभाओं और क्षमताओं से मेल खाता है', icon: '⭐' },
      { value: 'family_does_it', label: 'Inspired by role models in my family/community', labelHi: 'मेरे परिवार या समुदाय के किसी प्रेरणादायक व्यक्ति से प्रेरणा मिली है', icon: '👨‍👩‍👧' },
      { value: 'suggested', label: 'Encouraged by teachers or mentors', labelHi: 'शिक्षकों या मार्गदर्शकों ने मुझे इसके लिए प्रोत्साहित किया है', icon: '🎓' },
      { value: 'help_people', label: 'Opportunity to make a positive impact on the world', labelHi: 'दुनिया में सकारात्मक बदलाव लाने और लोगों की मदद करने का अवसर मिलता है', icon: '🌍' },
      { value: 'good_opportunities', label: 'Great growth & learning opportunities', labelHi: 'आगे बढ़ने और नई चीज़ें सीखने के अच्छे अवसर मिलते हैं', icon: '🚀' },
      { value: 'saw_read', label: 'Inspired by amazing stories & innovations', labelHi: 'प्रेरणादायक कहानियों और नई खोजों/आविष्कारों से प्रेरणा मिली है', icon: '📖' },
      { value: 'other', label: 'Other exciting reasons', labelHi: 'अन्य रोचक कारण', icon: '✨' },
    ],
  },
  {
    id: 'q9',
    question: 'How eager and ready do you feel to discover your future possibilities?',
    questionHi: 'आप अपने भविष्य की संभावनाओं को जानने और तलाशने के लिए कितने उत्सुक और तैयार महसूस करते हैं?',
    category: 'optimism',
    categoryHi: 'आशावाद',
    icon: '🌟',
    type: 'scale',
    options: [
      { value: '1', label: '🌱 1 - Curious to start exploring', labelHi: '🌱 1 – नई संभावनाओं को तलाशना शुरू करने के लिए उत्सुक हूँ', icon: '🌱' },
      { value: '2', label: '💡 2 - Learning new ideas every day', labelHi: '💡 2 – हर दिन नए विचार सीख रहा/रही हूँ', icon: '💡' },
      { value: '3', label: '🙂 3 - Positive and open-minded', labelHi: '🙂 3 – सकारात्मक हूँ और नए विचारों के लिए खुला/खुली हूँ', icon: '🙂' },
      { value: '4', label: '🌟 4 - Confident in my potential', labelHi: '🌟 4 – अपनी क्षमता पर मुझे विश्वास है', icon: '🌟' },
      { value: '5', label: '🚀 5 - Super excited & ready to shine!', labelHi: '🚀 5 – बहुत उत्साहित हूँ और अपनी पहचान बनाने के लिए पूरी तरह तैयार हूँ!', icon: '🚀' },
    ],
  },
  {
    id: 'q10',
    question: 'What positive opportunities or guidance would help you reach your highest potential?',
    questionHi: 'अपनी सर्वोच्च क्षमता तक पहुँचने के लिए आपके लिए कौन-से सकारात्मक अवसर या मार्गदर्शन उपयोगी होंगे?',
    category: 'growth_opportunities',
    categoryHi: 'विकास के अवसर',
    icon: '☀️',
    type: 'multi-select',
    maxSelections: 3,
    options: [
      { value: 'explore_tech', label: 'Exploring cutting-edge tech & practical skills', labelHi: 'नई और उन्नत तकनीकों को जानना तथा व्यावहारिक कौशल सीखना', icon: '💻' },
      { value: 'hands_on', label: 'Hands-on projects & creative experiments', labelHi: 'व्यावहारिक प्रोजेक्ट करना और रचनात्मक प्रयोग करना', icon: '🔬' },
      { value: 'mentorship', label: 'Mentorship & guidance from experts', labelHi: 'विशेषज्ञों से मार्गदर्शन और सलाह प्राप्त करना', icon: '🧠' },
      { value: 'workshops', label: 'Interactive workshops & team activities', labelHi: 'इंटरैक्टिव कार्यशालाओं और टीम गतिविधियों में भाग लेना', icon: '👥' },
      { value: 'arts_creative', label: 'Creative design & artistic opportunities', labelHi: 'रचनात्मक डिज़ाइन और कला से जुड़े अवसर प्राप्त करना', icon: '🎨' },
      { value: 'sports_leadership', label: 'Sports coaching & leadership programs', labelHi: 'खेल प्रशिक्षण और नेतृत्व विकास कार्यक्रमों में भाग लेना', icon: '🏆' },
      { value: 'top_colleges', label: 'Discovering top colleges & field exposures', labelHi: 'श्रेष्ठ कॉलेजों के बारे में जानना और विभिन्न क्षेत्रों का व्यावहारिक अनुभव प्राप्त करना', icon: '🏛️' },
      { value: 'discover_talents', label: 'Discovering hidden talents & strengths', labelHi: 'अपनी छिपी हुई प्रतिभाओं और क्षमताओं को पहचानना', icon: '⭐' },
      { value: 'general_guidance', label: 'Personalized career counselling', labelHi: 'व्यक्तिगत करियर परामर्श प्राप्त करना', icon: '🎯' },
    ],
  },
];

// Journey steps for the student flow UI
export const journeySteps = [
  { id: 'passions', label: 'My Passions', labelHi: 'मुझे क्या करना सबसे अच्छा लगता है?', icon: '🌱', questionIds: ['q1'] },
  { id: 'strengths', label: 'My Talents', labelHi: 'मेरी क्षमताएँ', icon: '⭐', questionIds: ['q2', 'q3'] },
  { id: 'style', label: 'My Style', labelHi: 'मेरी कार्यशैली', icon: '🚀', questionIds: ['q4', 'q5'] },
  { id: 'dreams', label: 'My Future Dreams', labelHi: 'मेरे भविष्य के सपने', icon: '🎯', questionIds: ['q6', 'q7', 'q8'] },
  { id: 'growth', label: 'My Growth Potential', labelHi: 'मेरी विकास क्षमता', icon: '☀️', questionIds: ['q9', 'q10'] },
];
