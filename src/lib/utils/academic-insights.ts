/**
 * Academic Insights, Annotations & Counseling Recommendation Engine
 * Consolidates the domain translations and academic classifications
 * previously maintained across Python and Node scripts.
 */

export interface ProofAnnotation {
  keywords: string[];
  title: string;
  category: 'Clean Energy' | 'AgTech' | 'Electrical' | 'Software' | 'Waste Management' | 'Traditional Craft' | 'Community Service' | 'Applied Science' | 'Leadership';
  academicDescription: string;
}

export const ACADEMIC_PROOF_ANNOTATIONS: ProofAnnotation[] = [
  {
    keywords: ['tesla coil'],
    title: 'Electromagnetic Tesla Coil Prototype',
    category: 'Electrical',
    academicDescription: 'Applied Electrical Engineering & Physics: Engineered and assembled a functional electromagnetic Tesla Coil demonstrating wireless electrical power transmission.',
  },
  {
    keywords: ['evo friendly battery', 'eco friendly battery', 'battery'],
    title: 'Eco-Friendly Battery Innovation',
    category: 'Clean Energy',
    academicDescription: 'Clean Energy Innovation: Developed and tested an eco-friendly prototype battery using chemical principles with peer lab partners.',
  },
  {
    keywords: ['samart rod', 'smart rod', 'water absorbing road'],
    title: 'Smart Infrastructure & Water-Absorbing Road',
    category: 'Applied Science',
    academicDescription: 'Civil & Smart Tech Infrastructure: Designed and fabricated a "Smart Road" / water-absorbing road model for urban sustainability.',
  },
  {
    keywords: ['multi layer farming', 'muitp layer forming', 'multp layer forming'],
    title: 'Multi-Layer Agro-Ecology Project',
    category: 'AgTech',
    academicDescription: 'Advanced Sustainable Agriculture: Hands-on Multi-layer Farming project (growing multiple crop tiers simultaneously) in cooperative peer teams.',
  },
  {
    keywords: ['gobar ka use kr  gamla', 'gobar ka use', 'gamla'],
    title: 'Organic Cow-Dung Flowerpots',
    category: 'Waste Management',
    academicDescription: 'Organic Eco-Innovation: Manufactured eco-friendly biodegradable flowerpots using cow dung, combining waste recycling with rural entrepreneurship.',
  },
  {
    keywords: ['kichan west', 'kitchen waste'],
    title: 'Kitchen Waste Composting & Planters',
    category: 'Waste Management',
    academicDescription: 'Waste Management & Eco-Pottery: Composted kitchen waste and organized a 5-member student team to fabricate organic planting pots.',
  },
  {
    keywords: ['khad banane', 'vibhinn prakar ke khad', 'vibhin prakar ke khad'],
    title: 'Indigenous Bio-Fertilizer Formulation',
    category: 'AgTech',
    academicDescription: 'Agricultural Chemistry: Formulated and tested diverse organic manures and indigenous bio-fertilizers with student peers.',
  },
  {
    keywords: ['khrpatvar', 'khrpatvarkeupar'],
    title: 'Agronomic Weed Control & Soil Study',
    category: 'AgTech',
    academicDescription: 'Agronomy & Crop Science: Scientific inquiry into weed management and local crop yield optimization conducted with a study partner.',
  },
  {
    keywords: ['coding seekhna', 'python', 'chatgpt'],
    title: 'Self-Directed Python & AI Programming',
    category: 'Software',
    academicDescription: 'Self-Taught Software Development: Independent Python programming; actively leverages AI tools to design, write, and debug algorithmic scripts.',
  },
  {
    keywords: ['pot banana', 'kumhar'],
    title: 'Traditional Ceramic Craftsmanship',
    category: 'Traditional Craft',
    academicDescription: 'Traditional Craftsmanship & Design: Clay pot manufacturing, modeling, and micro-enterprise pottery creation.',
  },
  {
    keywords: ['animals'],
    title: 'Agro-Veterinary & Animal Welfare',
    category: 'Community Service',
    academicDescription: 'Compassionate Agro-Veterinary Service: Combined collective family farming with proactive first-aid and rescue assistance for injured animals.',
  },
  {
    keywords: ['dhan ki ropai', 'farming'],
    title: 'Collaborative Agricultural Fieldwork',
    category: 'AgTech',
    academicDescription: 'Agro-Ecological Fieldwork & Team Leadership: Organized and executed collaborative paddy transplantation and synchronized labor in agricultural fields.',
  },
  {
    keywords: ['scout guide', 'red cross', 'redcross'],
    title: 'Civic Service & Scouts Teamwork',
    category: 'Community Service',
    academicDescription: 'Civic Engagement & Group Performance: Cultural group performance, first-aid drills, and collaborative leadership in Red Cross and Scouts.',
  },
  {
    keywords: ['iti'],
    title: 'Applied Polytechnic Workshop Tasks',
    category: 'Applied Science',
    academicDescription: 'Applied Technical Innovation: Hands-on fabrication, ITI-style technical workshop tasks, and school science project construction.',
  },
  {
    keywords: ['team project', 'dosto ke sath project', '4 dosto'],
    title: 'Collaborative Science Exhibition Model',
    category: 'Leadership',
    academicDescription: 'Collaborative Project Leadership: Coordinated peer science exhibition projects, delegating tasks and seeking teacher mentorship.',
  },
];

export const DREAM_ANNOTATIONS: Record<string, string> = {
  'saftvair enginear': 'Software Engineer (IT & Computing)',
  'ias': 'IAS Officer (Indian Administrative Service / Civil Services)',
  'police,': 'Police Officer / Public Law Enforcement',
  'police': 'Police Officer / Public Law Enforcement',
  'pot banana ': 'Craftsperson / Ceramic & Pottery Entrepreneur',
  'human body ,doctor': 'Medical Doctor / Physician (Human Anatomy & Medicine)',
  'IES OFFISAR': 'IES / Civil Services Officer (Indian Engineering / Administrative Services)',
  'ENGYR': 'Engineer (Technical & Innovation)',
  'water absorbing road': 'Civil & Environmental Infrastructure Engineer (Smart Roads)',
  'projakt me kam karna': 'Applied Research Scientist / Project Engineer',
  'docter ': 'Medical Doctor / Healthcare Professional',
  'doctor': 'Medical Doctor / Healthcare Professional',
  'air cart engineer': 'Aeronautical / Mechanical Engineer (Aircraft & Vehicles)',
  'Engineer': 'Engineer (Technology & Hardware)',
  'agriculture': 'Agricultural Sciences & Modern Agronomy',
  'computer science': 'Computer Science & Software Engineering (DCA Enrolled)',
};

export const KNOWN_STUDENT_CAREER_AIMS: Record<string, string> = {
  '01153FE4': 'Business Management & Entrepreneurship',
  '2C6D5135': 'Polytechnic / Applied Technical Science',
  'A85B63B8': 'Sustainable Agriculture & Agribusiness',
  '06EA7A34': 'Agricultural Sciences & Veterinary Medicine',
  'E4EBE837': 'Mechanical / Computer Engineering',
  'F6413650': 'Electrical Engineering & Robotics (Tesla Coil Maker)',
  'E0010B46': 'Sports Leadership & Public Administration',
  'AF386902': 'Computer Science & IT (Python Coder / DCA Student)',
};

export const KNOWN_COUNSELING_RECOMMENDATIONS: Record<string, string> = {
  '01153FE4': 'Commerce with Entrepreneurship or Applied Sciences. Benefits from structured stream orientation and confidence-building workshops to elevate career certainty.',
  '2C6D5135': 'Science-PCM or Polytechnic Diploma in Mechanical/Electrical Engineering. Flawless cognitive logic (15/15) combined with enthusiasm for ITI practical workshops.',
  'A85B63B8': 'Agricultural Sciences (B.Sc. Agriculture) or Commerce with Agribusiness. Demonstrates high intrinsic work ethic, flawless cognitive score (15/15), and natural group leadership.',
  '06EA7A34': 'Science-PCB / Agriculture Stream (B.Sc. Agriculture or Veterinary Medicine - B.V.Sc). Distinct synergy between stated dream career, animal rescue experience, and 100% aptitude score.',
  'E4EBE837': 'Science-PCM (Physics, Chemistry, Mathematics). Strong polytechnic aptitude and analytical inquiry suited for Computer Science, Electrical, or Mechanical Engineering.',
  'F6413650': 'Science-PCM with Focus on Core Electrical/Electronics or Robotics Engineering. Exceptional empirical hardware achievement ("Tesla Coil" working model) and 100% cognitive test result.',
  'E0010B46': 'Commerce / Humanities with Civil Services or Physical Education & Sports Leadership. Strong interpersonal synergy, peer management acumen, and perfect cognitive ability (15/15).',
  'AF386902': 'Science-PCM with Computer Science (Direct Pathway to B.Tech CS / BCA). Exceptional self-directed initiative: currently learning Python with AI and pursuing DCA alongside Class 10.',
};

/**
 * Normalizes student written project proof into professional academic context
 */
export function getAcademicProof(text?: string | null): {
  raw: string;
  title: string;
  category: string;
  academicDescription: string;
} | null {
  if (!text || !text.trim()) return null;
  const clean = text.trim();
  const lower = clean.toLowerCase();

  for (const ann of ACADEMIC_PROOF_ANNOTATIONS) {
    if (ann.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return {
        raw: clean,
        title: ann.title,
        category: ann.category,
        academicDescription: ann.academicDescription,
      };
    }
  }

  return {
    raw: clean,
    title: 'Applied Practical Initiative',
    category: 'Applied Science',
    academicDescription: `Applied Practical Learning: Independent empirical demonstration involving "${clean}".`,
  };
}

/**
 * Standardizes raw phonetic dream input into professional career title
 */
export function getStandardizedDreamCareer(rawDream?: string | null): string {
  if (!rawDream || !rawDream.trim()) return 'Exploring Diverse Options';
  const clean = rawDream.trim();
  if (DREAM_ANNOTATIONS[clean]) {
    return DREAM_ANNOTATIONS[clean];
  }
  const lower = clean.toLowerCase();
  for (const [key, val] of Object.entries(DREAM_ANNOTATIONS)) {
    if (lower.includes(key.toLowerCase().trim())) {
      return val;
    }
  }
  return clean;
}

/**
 * Deduce recommended educational stream & counseling guidance for any student
 */
export function deduceRecommendedStream(params: {
  accessCode?: string;
  score?: number;
  totalQuestions?: number;
  passions?: string[];
  superpowers?: string[];
  dreamCareer?: string;
  rawProof?: string;
}): {
  recommendedStream: string;
  recommendedPathway: string;
  guidanceNote: string;
  confidence: 'High' | 'Solid';
} {
  const code = (params.accessCode || '').toUpperCase();
  if (KNOWN_COUNSELING_RECOMMENDATIONS[code]) {
    const stream = KNOWN_COUNSELING_RECOMMENDATIONS[code].split('.')[0];
    return {
      recommendedStream: stream,
      recommendedPathway: KNOWN_STUDENT_CAREER_AIMS[code] || stream,
      guidanceNote: KNOWN_COUNSELING_RECOMMENDATIONS[code],
      confidence: 'High',
    };
  }

  const passions = (params.passions || []).map((p) => p.toLowerCase());
  const powers = (params.superpowers || []).map((p) => p.toLowerCase());
  const dream = (params.dreamCareer || '').toLowerCase();
  const proof = (params.rawProof || '').toLowerCase();
  const score = params.score ?? 0;
  const scorePct = params.totalQuestions ? Math.round((score / params.totalQuestions) * 100) : 0;

  // 1. Computer Science / Software / Robotics / Electronics
  if (
    dream.includes('software') ||
    dream.includes('computer') ||
    dream.includes('enginear') ||
    dream.includes('engineer') ||
    dream.includes('smart rod') ||
    dream.includes('battery') ||
    proof.includes('tesla') ||
    proof.includes('python') ||
    proof.includes('battery') ||
    passions.includes('computers') ||
    powers.includes('computers')
  ) {
    if (scorePct >= 80) {
      return {
        recommendedStream: 'Science-PCM (Physics, Chemistry, Mathematics)',
        recommendedPathway: 'Engineering & Computing (B.Tech / B.E / BCA)',
        guidanceNote: `Demonstrates strong analytical thinking (${score}/15) and keen enthusiasm for technology and hardware. Direct pathway to Computer Science, Electronics, or Mechanical Engineering.`,
        confidence: 'High',
      };
    }
    return {
      recommendedStream: 'Polytechnic Diploma or Science-PCM',
      recommendedPathway: 'Applied Technical Engineering / IT Diploma',
      guidanceNote: 'Hands-on practical orientation with strong technical inclination. Ideal for 3-Year Polytechnic Engineering or Applied Computing diploma.',
      confidence: 'Solid',
    };
  }

  // 2. Medicine / Life Sciences / Healthcare
  if (
    dream.includes('doctor') ||
    dream.includes('docter') ||
    dream.includes('human body') ||
    dream.includes('biology') ||
    proof.includes('biology') ||
    proof.includes('animal') ||
    passions.includes('science')
  ) {
    if (scorePct >= 80) {
      return {
        recommendedStream: 'Science-PCB (Physics, Chemistry, Biology)',
        recommendedPathway: 'Medical & Healthcare Sciences (MBBS, BDS, BAMS, B.Sc Biotech)',
        guidanceNote: `Strong academic aptitude (${score}/15) paired with deep scientific curiosity. Prime candidate for medical, veterinary, or biotechnology streams.`,
        confidence: 'High',
      };
    }
    return {
      recommendedStream: 'Science-PCB / Allied Health Sciences',
      recommendedPathway: 'Pharmacy & Paramedical Sciences (B.Pharm, DMLT, Nursing)',
      guidanceNote: 'Interest in biology and community health aligns well with professional pharmaceutical and healthcare technology pathways.',
      confidence: 'Solid',
    };
  }

  // 3. Agriculture & Environmental Sciences
  if (
    dream.includes('agriculture') ||
    proof.includes('farming') ||
    proof.includes('khad') ||
    proof.includes('crop') ||
    proof.includes('gobar') ||
    proof.includes('waste') ||
    passions.includes('nature') ||
    passions.includes('working_nature')
  ) {
    return {
      recommendedStream: 'Agricultural Sciences (Science-Agriculture Stream)',
      recommendedPathway: 'B.Sc Agriculture / Horticulture / Agribusiness',
      guidanceNote: 'Remarkable hands-on mastery in eco-farming and resource management. Strong foundation for state agricultural universities and modern AgTech.',
      confidence: 'High',
    };
  }

  // 4. Civil Services / Administration / Law / Police
  if (
    dream.includes('ias') ||
    dream.includes('ies') ||
    dream.includes('police') ||
    dream.includes('offisar') ||
    powers.includes('leadership') ||
    powers.includes('communication')
  ) {
    return {
      recommendedStream: 'Humanities or Commerce with Public Administration',
      recommendedPathway: 'Civil Services (UPSC/State PSC), Defense & Law (BALLB)',
      guidanceNote: `High civic awareness and verbal communication skills (${score}/15). Excellent alignment with competitive civil services exams, defense academy, and public administration.`,
      confidence: 'High',
    };
  }

  // 5. Traditional Crafts / Design / Entrepreneurship
  if (dream.includes('pot') || proof.includes('pot') || proof.includes('rakhi') || passions.includes('arts')) {
    return {
      recommendedStream: 'Design & Applied Arts / Commerce with Entrepreneurship',
      recommendedPathway: 'Industrial Design, Fine Arts (BFA) or Micro-Enterprise',
      guidanceNote: 'Remarkable spatial and artistic dexterity. Combine commercial design training with small business management to elevate artisanal craft into a modern brand.',
      confidence: 'Solid',
    };
  }

  // Default balanced recommendation
  return {
    recommendedStream: scorePct >= 80 ? 'Science-PCM / Science-PCB' : 'Commerce / Applied Vocational Stream',
    recommendedPathway: 'General Higher Secondary Stream with Career Mentorship',
    guidanceNote: `Solid cognitive baseline (${score}/15). Will benefit from stream discovery workshops and industry field visits before class 11 stream selection.`,
    confidence: 'Solid',
  };
}
