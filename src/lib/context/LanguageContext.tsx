'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const UI_TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  // Navigation & General
  studentAccess: { en: '← Student Access', hi: '← विद्यार्थी प्रवेश' },
  educatorPortal: { en: 'Educator Portal', hi: 'शिक्षक पोर्टल' },
  myJourney: { en: 'My Journey', hi: 'मेरी यात्रा' },
  logout: { en: 'Logout', hi: 'लॉगआउट' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  backToProfile: { en: 'Back to Student Profile', hi: 'विद्यार्थी प्रोफ़ाइल पर वापस जाएँ' },
  
  // Actions
  next: { en: 'Next', hi: 'अगला' },
  previous: { en: 'Previous', hi: 'पिछला' },
  submit: { en: 'Submit Responses', hi: 'उत्तर जमा करें' },
  submitting: { en: 'Submitting...', hi: 'जमा किया जा रहा है...' },
  continue: { en: 'Continue', hi: 'आगे बढ़ें' },
  finish: { en: 'Finish & View Summary', hi: 'समाप्त करें और सारांश देखें' },
  saveDraft: { en: 'Draft Saved', hi: 'ड्राफ्ट सुरक्षित' },
  savingDraft: { en: 'Saving...', hi: 'सुरक्षित हो रहा है...' },
  
  // Encouraging notes
  noWrongAnswer: {
    en: 'There are no right or wrong answers. Choose what feels most like you.',
    hi: 'यहाँ कोई सही या गलत उत्तर नहीं है। वही चुनें जो आपको अपने सबसे करीब लगे।',
  },
  chooseUpTo: { en: 'Choose up to', hi: 'अधिकतम चुनें:' },
  selected: { en: 'selected', hi: 'चुने गए' },
  giveProof: { 
    en: 'Please give a quick real example or proof of what you did:', 
    hi: 'कृपया अपने द्वारा किए गए कार्य का एक छोटा-सा वास्तविक उदाहरण या प्रमाण दें:' 
  },
  proofPlaceholder: { 
    en: 'e.g. Science project with 3 friends / Solved 10 math puzzles on my own...', 
    hi: 'उदा. दोस्तों के साथ विज्ञान प्रोजेक्ट बनाया / 10 गणित की पहेलियाँ खुद हल कीं...' 
  },
  exploreHowYouThink: {
    en: 'Explore How You Think',
    hi: 'अपनी सोचने की शैली को समझें',
  },
  timeRemaining: {
    en: 'Time Remaining',
    hi: 'शेष समय',
  },
  question: {
    en: 'Question',
    hi: 'प्रश्न',
  },
  of: {
    en: 'of',
    hi: 'में से',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi', // Default to Hindi as requested
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to 'hi' as requested by user
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('app_language') as Language | null;
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
      } else {
        setLanguageState('hi');
        localStorage.setItem('app_language', 'hi');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    const entry = UI_TRANSLATIONS[key];
    if (entry) {
      return language === 'hi' ? entry.hi : entry.en;
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
