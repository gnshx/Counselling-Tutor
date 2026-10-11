'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Sparkles, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';

export interface StudentInnovationItem {
  studentId: string;
  studentName: string;
  accessCode: string;
  classGrade: string;
  rawProof: string;
  title: string;
  category: string;
  academicDescription: string;
}

interface StudentInnovationsShowcaseProps {
  innovations: StudentInnovationItem[];
}

export function StudentInnovationsShowcase({ innovations }: StudentInnovationsShowcaseProps) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  if (!innovations || innovations.length === 0) {
    return null;
  }

  const categories = ['All', ...Array.from(new Set(innovations.map((i) => i.category)))];

  const filtered = innovations.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !search ||
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.rawProof.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Clean Energy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'AgTech':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Electrical':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'Software':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Waste Management':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
      case 'Traditional Craft':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'Community Service':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xs transition-all space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'hi' ? 'व्यावहारिक नवाचार' : 'Practical Proofs'}
            </span>
            <h3 className="text-base sm:text-lg font-[var(--font-heading)] font-semibold text-[var(--color-text-primary)]">
              {language === 'hi'
                ? 'छात्रों के वास्तविक प्रोजेक्ट्स एवं प्रयोगात्मक नवाचार'
                : 'Student Practical Inventions & Real-World Project Proofs'}
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            {language === 'hi'
              ? 'प्रश्नावली में विद्यार्थियों द्वारा दर्ज किए गए वास्तविक प्रोजेक्ट्स (टेस्ला कॉइल, बायो-बैटरी, स्मार्ट रोड, मल्टी-लेयर फार्मिंग, कोडिंग आदि)'
              : 'Verifiable empirical projects reported by students translated into formal academic competencies'}
          </p>
        </div>

        {/* Count Badge */}
        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] self-start sm:self-auto shrink-0">
          {filtered.length} / {innovations.length} {language === 'hi' ? 'प्रदर्शित' : 'showcased'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {cat === 'All' ? (language === 'hi' ? 'सभी श्रेणियां' : 'All Domains') : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'प्रोजेक्ट या छात्र खोजें...' : 'Search projects...'}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Innovation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item, index) => (
          <div
            key={`${item.studentId}-${index}`}
            className="p-5 rounded-2xl bg-[var(--color-surface-soft)]/70 border border-[var(--color-border-subtle)] hover:border-indigo-500/40 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wide ${getCategoryBadgeColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>

                <Link
                  href={`/dashboard/students/${item.studentId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Title & Student */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] font-[var(--font-heading)] leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                  {item.studentName} • Grade {item.classGrade} ({item.accessCode})
                </p>
              </div>

              {/* Student's Raw Words */}
              <div className="p-3 rounded-xl bg-[var(--color-surface)] border-l-4 border-l-indigo-500 border border-[var(--color-border-subtle)] text-xs shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                  {language === 'hi' ? 'छात्र का वास्तविक उत्तर (मूल रूप):' : 'Student Submission:'}
                </span>
                <span className="italic font-medium text-[var(--color-text-primary)] leading-relaxed block">
                  &ldquo;{item.rawProof}&rdquo;
                </span>
              </div>

              {/* Academic Interpretation */}
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <strong className="text-[var(--color-text-primary)] font-semibold">
                  {language === 'hi' ? 'अकादमिक विश्लेषण:' : 'Academic Evaluation:'}
                </strong>{' '}
                {item.academicDescription}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
