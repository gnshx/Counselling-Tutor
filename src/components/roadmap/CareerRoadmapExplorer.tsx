'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Printer,
  GitFork,
  LayoutGrid,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  CareerStreamOption,
  CAREER_ROADMAP_ITEMS,
  STREAM_CATEGORIES,
} from '@/lib/data/career-roadmap-data';
import { RoadmapOverviewDiagram } from '@/components/roadmap/RoadmapOverviewDiagram';
import { RoadmapTreeView } from '@/components/roadmap/RoadmapTreeView';
import { RoadmapCardGrid } from '@/components/roadmap/RoadmapCardGrid';
import { RoadmapDetailModal } from '@/components/roadmap/RoadmapDetailModal';
import { useLanguage } from '@/lib/context/LanguageContext';

export function CareerRoadmapExplorer() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'diagram' | 'tree' | 'grid'>('diagram');
  const [selectedItem, setSelectedItem] = useState<CareerStreamOption | null>(null);

  // Filter items according to search and category
  const filteredItems = useMemo(() => {
    return CAREER_ROADMAP_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      if (!searchQuery.trim()) return matchesCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q) || item.nameHi.includes(q);
      const matchDesc = item.shortDesc.toLowerCase().includes(q) || item.shortDescHi.includes(q);
      const matchExams = item.keyEntranceExams.some((e) => e.toLowerCase().includes(q));
      const matchDegrees =
        item.higherEducationDegrees.some((d) => d.toLowerCase().includes(q)) ||
        item.higherEducationDegreesHi.some((d) => d.includes(q));
      const matchRoles =
        item.careerRoles.some((r) => r.toLowerCase().includes(q)) ||
        item.careerRolesHi.some((r) => r.includes(q));
      const matchSubjects =
        item.subjectsOrTrades.some((s) => s.toLowerCase().includes(q)) ||
        item.subjectsOrTradesHi.some((s) => s.includes(q));

      return matchesCategory && (matchName || matchDesc || matchExams || matchDegrees || matchRoles || matchSubjects);
    });
  }, [activeCategory, searchQuery]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const faqs = [
    {
      q: isHindi ? '10वीं के बाद सही स्ट्रीम का चुनाव कैसे करें?' : 'How should a student choose the right stream after 10th?',
      a: isHindi
        ? 'अपनी प्राकृतिक रुचियों, गणित व विज्ञान में सहजता, कार्य करने की शैली (सैद्धांतिक बनाम व्यावहारिक) और भविष्य के लक्ष्य को समझें। किसी के दबाव में न आएं।'
        : 'Align your choice with your natural interests, comfort in quantitative vs life sciences vs commerce, learning style (theoretical degree vs hands-on diploma), and long-term goals.',
    },
    {
      q: isHindi ? 'पॉलिटेक्निक डिप्लोमा और इंटरमीडिएट में क्या अंतर है?' : 'What is the key difference between Polytechnic and Intermediate (+2)?',
      a: isHindi
        ? 'इंटरमीडिएट 2 वर्ष का पूर्व-विश्वविद्यालयीन अध्ययन है जो बी.टेक, एमबीबीएस या डिग्री की प्रतियोगी परीक्षाओं (JEE, NEET) हेतु तैयार करता है। पॉलिटेक्निक 3 वर्ष का व्यावहारिक तकनीकी प्रशिक्षण है जो तुरंत जूनियर इंजीनियर की नौकरी दिलाता है या बी.टेक के द्वितीय वर्ष में सीधे प्रवेश (लैटरल एंट्री ECET) देता है।'
        : 'Intermediate is 2-year academic coursework aimed at competitive entrances (JEE, NEET, CLAT, CA). Polytechnic is 3-year hands-on technical training offering direct Junior Engineer jobs in PSUs/industry or direct lateral entry into 2nd year B.Tech.',
    },
    {
      q: isHindi ? 'क्या आईटीआई के बाद भी आगे डिग्री या इंजीनियरिंग की जा सकती है?' : 'Can an ITI graduate pursue a diploma or degree later?',
      a: isHindi
        ? 'हाँ! आईटीआई उत्तीर्ण छात्र 2 वर्षीय पॉलिटेक्निक डिप्लोमा के द्वितीय वर्ष में सीधे प्रवेश ले सकते हैं, तथा उसके बाद बी.टेक में भी लेटरल एंट्री प्राप्त कर सकते हैं।'
        : 'Yes! ITI certificate holders can take direct lateral entry into the 2nd year of a Polytechnic Engineering Diploma, and subsequently progress into B.Tech or CITS instructor roles.',
    },
    {
      q: isHindi ? 'पैरामेडिकल पाठ्यक्रमों में क्या भविष्य है?' : 'What is the future scope of Paramedical Diplomas?',
      a: isHindi
        ? 'अत्यधिक उज्ज्वल। हर आधुनिक अस्पताल और डायग्नोस्टिक लैब को प्रशिक्षित लैब टेक्नोलॉजिस्ट, एक्स-रे/एमआरआई तकनीशियन, डायलिसिस और ओटी विशेषज्ञों की भारी आवश्यकता रहती है।'
        : 'Extremely high demand. Modern healthcare facilities cannot function without certified Operation Theatre, Radiology, Medical Lab, Optometry, and Dialysis technologists.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Search, Filter Toolbar & View Mode Toggle */}
      <div className="bg-[var(--color-surface)] rounded-2xl p-4 sm:p-6 border border-[var(--color-border-subtle)] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? 'करियर, डिग्री या विषय खोजें (उदा: Doctor, B.Tech, Electrician, Pilot, NEET, Law, CA)...'
                  : 'Search any career, degree, trade or exam (e.g., Doctor, Software Engineer, Electrician, Pilot, NEET, CA)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] focus:border-indigo-500 focus:bg-[var(--color-surface)] text-xs sm:text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle and Print Button */}
          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-soft)] rounded-xl border border-[var(--color-border-subtle)]">
              <button
                type="button"
                onClick={() => setViewMode('diagram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'diagram'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isHindi ? 'चित्रमय नक्शा' : 'Diagram Map'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>{isHindi ? 'पिलर्स फ्लो' : 'Stream Pillars'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{isHindi ? 'सभी कार्ड्स' : 'All Cards'}</span>
              </button>
            </div>

            {/* Print Action */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-indigo-500/40 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all shadow-2xs cursor-pointer"
              title={isHindi ? 'रोडमैप प्रिंट या पीडीएफ में सुरक्षित करें' : 'Print or Export as PDF'}
            >
              <Printer className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">{isHindi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          {STREAM_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                activeCategory === cat.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)] hover:border-indigo-500/30'
              }`}
            >
              {isHindi ? cat.titleHi.split('(')[0].trim() : cat.title.split('/')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Presentation */}
      {viewMode === 'diagram' && activeCategory === 'all' && !searchQuery ? (
        <RoadmapOverviewDiagram onSelectItem={(item) => setSelectedItem(item)} />
      ) : viewMode === 'tree' && activeCategory === 'all' && !searchQuery ? (
        <RoadmapTreeView onSelectItem={(item) => setSelectedItem(item)} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] px-1">
            <span>
              {isHindi
                ? `कुल ${filteredItems.length} करियर विकल्प प्रदर्शित`
                : `Showing ${filteredItems.length} career pathways`}
            </span>
            {searchQuery && (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {isHindi ? `खोज परिणाम: "${searchQuery}"` : `Matches for: "${searchQuery}"`}
              </span>
            )}
            {activeCategory !== 'all' && !searchQuery && (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {isHindi
                  ? `श्रेणी: ${STREAM_CATEGORIES.find((c) => c.key === activeCategory)?.titleHi || activeCategory}`
                  : `Filtered by: ${STREAM_CATEGORIES.find((c) => c.key === activeCategory)?.title || activeCategory}`}
              </span>
            )}
          </div>
          <RoadmapCardGrid
            items={filteredItems}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        </div>
      )}

      {/* Decision-Making FAQ / Student Guidance Section */}
      <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800/60">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-[var(--font-heading)] font-bold text-base sm:text-lg text-[var(--color-text-primary)]">
              {isHindi ? 'विद्यार्थी मार्गदर्शन एवं सामान्य प्रश्न' : 'Student Guidance & Key Decisions'}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {isHindi ? 'स्ट्रीम और करियर चयन से जुड़े महत्वपूर्ण उत्तर' : 'Frequently asked questions to help you choose with confidence'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-2"
            >
              <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed pl-3.5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <RoadmapDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
