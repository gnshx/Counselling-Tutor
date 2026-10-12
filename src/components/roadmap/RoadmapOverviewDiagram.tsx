'use client';

import React from 'react';
import {
  ArrowDown,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CareerStreamOption, CAREER_ROADMAP_ITEMS } from '@/lib/data/career-roadmap-data';
import { useLanguage } from '@/lib/context/LanguageContext';

interface RoadmapOverviewDiagramProps {
  onSelectItem: (item: CareerStreamOption) => void;
}

export function RoadmapOverviewDiagram({ onSelectItem }: RoadmapOverviewDiagramProps) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const findItem = (id: string) => CAREER_ROADMAP_ITEMS.find((item) => item.id === id);

  return (
    <div className="w-full space-y-8 select-none">
      {/* Visual Header / Diagram Banner */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>{isHindi ? 'चित्रमय समग्र अवलोकन' : 'Complete Flowchart Diagram Overview'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-[var(--font-heading)] font-extrabold text-[var(--color-text-primary)]">
          {isHindi ? '10वीं के बाद सभी शैक्षणिक एवं तकनीकी मार्ग' : 'Educational & Career Pathways After 10th Class'}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl mx-auto">
          {isHindi
            ? 'पाठ्यपुस्तक फ्लोचार्ट के अनुरूप संरचित समग्र नक्शा — किसी भी स्ट्रीम अथवा कोर्स पर क्लिक करके संपूर्ण विवरण देखें।'
            : 'Structured end-to-end flowchart schematic directly mapped to standard post-10th educational pathways across India.'}
        </p>

        {/* Root Flowchart Anchor (Matching the textbook hexagon/banner) */}
        <div className="mt-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-[var(--font-heading)] font-bold text-base sm:text-lg tracking-wider uppercase shadow-lg shadow-indigo-500/25 border-2 border-indigo-300/40 relative z-10"
          >
            {isHindi ? '10वीं कक्षा के बाद (AFTER 10TH CLASS)' : 'AFTER 10TH CLASS'}
          </motion.div>

          {/* Central Trunk Arrow */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-400" />
          <div className="w-2.5 h-2.5 rotate-45 border-r-2 border-b-2 border-indigo-500 -mt-1.5" />
        </div>
      </div>

      {/* Responsive Horizontal Scroll Container with Flowchart Canvas */}
      <div className="overflow-x-auto pb-6 pt-2 no-scrollbar">
        <div className="min-w-[1060px] space-y-8">
          {/* Main 5 Primary Streams Header Row */}
          <div className="grid grid-cols-5 gap-4">
            {/* Stream 1: INTERMEDIATE */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 text-white text-center font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md border border-indigo-400/40">
                {isHindi ? '1. इंटरमीडिएट' : '1. INTERMEDIATE'}
                <div className="text-[10px] font-normal text-indigo-200">
                  {isHindi ? '(2 वर्ष - उच्चतर माध्यमिक)' : '(2 Years / +2)'}
                </div>
              </div>
              <div className="w-0.5 h-5 bg-indigo-500" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-indigo-500 -mt-1" />
            </div>

            {/* Stream 2: POLYTECHNIC */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 text-white text-center font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md border border-cyan-400/40">
                {isHindi ? '2. पॉलिटेक्निक' : '2. POLYTECHNIC'}
                <div className="text-[10px] font-normal text-cyan-200">
                  {isHindi ? '(3 वर्ष - इंजीनियरिंग डिप्लोमा)' : '(3-Year Engg Diploma)'}
                </div>
              </div>
              <div className="w-0.5 h-5 bg-cyan-500" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-cyan-500 -mt-1" />
            </div>

            {/* Stream 3: VOCATIONAL INTERMEDIATE */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 px-3 rounded-xl bg-violet-600 text-white text-center font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md border border-violet-400/40">
                {isHindi ? '3. व्यावसायिक इंटर' : '3. VOCATIONAL (+2)'}
                <div className="text-[10px] font-normal text-violet-200">
                  {isHindi ? '(2 वर्ष - व्यावहारिक कौशल)' : '(2 Years Applied Skills)'}
                </div>
              </div>
              <div className="w-0.5 h-5 bg-violet-500" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-violet-500 -mt-1" />
            </div>

            {/* Stream 4: ITI CRAFTSMAN TRADES */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 px-3 rounded-xl bg-amber-600 text-white text-center font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md border border-amber-400/40">
                {isHindi ? '4. आईटीआई ट्रेड्स' : '4. ITI TRADES'}
                <div className="text-[10px] font-normal text-amber-200">
                  {isHindi ? '(1-2 वर्ष - शिल्पकार प्रशिक्षण)' : '(1-2 Years Craftsman)'}
                </div>
              </div>
              <div className="w-0.5 h-5 bg-amber-500" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-amber-500 -mt-1" />
            </div>

            {/* Stream 5: PARAMEDICAL */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-center font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md border border-emerald-400/40">
                {isHindi ? '5. पैरामेडिकल' : '5. PARAMEDICAL'}
                <div className="text-[10px] font-normal text-emerald-200">
                  {isHindi ? '(2-3 वर्ष - अस्पताल तकनीक)' : '(2-3 Years Hospital Tech)'}
                </div>
              </div>
              <div className="w-0.5 h-5 bg-emerald-500" />
              <div className="w-2 h-2 rotate-45 border-r-2 border-b-2 border-emerald-500 -mt-1" />
            </div>
          </div>

          {/* Detailed Branch Columns (Matching the textbook flowchart boxes) */}
          <div className="grid grid-cols-5 gap-4 items-start">
            {/* ──── COLUMN 1: INTERMEDIATE GROUPS & HIGHER STUDIES ──── */}
            <div className="space-y-4">
              {/* Group 1: MPC */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-indigo-500/30 hover:border-indigo-500 transition-all shadow-xs space-y-2.5">
                <div
                  onClick={() => {
                    const item = findItem('inter-mpc');
                    if (item) onSelectItem(item);
                  }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    1. MPC
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                  {isHindi ? 'गणित, भौतिकी, रसायन विज्ञान' : 'Maths, Physics, Chemistry'}
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {isHindi ? 'अगला कदम / उच्च शिक्षा' : 'Leads To (Entrances & Degrees)'}
                  </div>
                  <ul className="text-[11px] text-[var(--color-text-primary)] space-y-0.5">
                    <li>• 1. IIT-JEE & State EAMCET/CET</li>
                    <li>• 2. B.Tech (CSE, AI, ECE, Mech, Civil)</li>
                    <li>• 3. NDA (Army, Navy, Air Force)</li>
                    <li>• 4. Commercial Pilot (CPL + Aviation)</li>
                    <li>• 5. Merchant Navy (IMU-CET)</li>
                    <li>• 6. Architecture (NATA / B.Arch)</li>
                    <li>• 7. LAW / CLAT & Banking / SSC</li>
                  </ul>
                </div>
              </div>

              {/* Group 2: BiPC */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-emerald-500/30 hover:border-emerald-500 transition-all shadow-xs space-y-2.5">
                <div
                  onClick={() => {
                    const item = findItem('inter-bipc');
                    if (item) onSelectItem(item);
                  }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    2. BiPC / PCB
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                  {isHindi ? 'जीव विज्ञान, भौतिकी, रसायन' : 'Biology, Physics, Chemistry'}
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {isHindi ? 'अगला कदम / उच्च शिक्षा' : 'Leads To (Medical & Life Sciences)'}
                  </div>
                  <ul className="text-[11px] text-[var(--color-text-primary)] space-y-0.5">
                    <li>• 1. NEET-UG (MBBS, BDS, AYUSH)</li>
                    <li>• 2. B.Sc. Nursing & Paramedical</li>
                    <li>• 3. B.Pharm & Pharm.D (Pharma CET)</li>
                    <li>• 4. B.Sc. (Hons) Agriculture / ICAR</li>
                    <li>• 5. BVSc & AH (Veterinary Science)</li>
                    <li>• 6. BPT (Physiotherapy - 4.5 Yrs)</li>
                    <li>• 7. Biotechnology & Forensic Science</li>
                  </ul>
                </div>
              </div>

              {/* Group 3 & 4: CEC & MEC */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-amber-500/30 hover:border-amber-500 transition-all shadow-xs space-y-2.5">
                <div
                  onClick={() => {
                    const item = findItem('inter-mec') || findItem('inter-cec');
                    if (item) onSelectItem(item);
                  }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    3. CEC & 4. MEC
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                  {isHindi ? 'वाणिज्य, अर्थशास्त्र, गणित / नागरिक शास्त्र' : 'Commerce, Economics, Math / Civics'}
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {isHindi ? 'अगला कदम / उच्च शिक्षा' : 'Leads To (Commerce & Finance)'}
                  </div>
                  <ul className="text-[11px] text-[var(--color-text-primary)] space-y-0.5">
                    <li>• 1. B.Com. (Honours / Analytics)</li>
                    <li>• 2. B.B.A. / B.M.S. & IPM (IIMs)</li>
                    <li>• 3. CA (Chartered Accountancy)</li>
                    <li>• 4. CS (Company Secretary)</li>
                    <li>• 5. CMA (Cost Management)</li>
                    <li>• 6. Actuarial Science & Banking PO</li>
                    <li>• 7. Financial Markets & Stock Trading</li>
                  </ul>
                </div>
              </div>

              {/* Group 5: HEC */}
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-violet-500/30 hover:border-violet-500 transition-all shadow-xs space-y-2.5">
                <div
                  onClick={() => {
                    const item = findItem('inter-hec');
                    if (item) onSelectItem(item);
                  }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300 font-bold text-xs">
                    5. HEC / Arts
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-violet-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                  {isHindi ? 'इतिहास, अर्थशास्त्र, नागरिक शास्त्र' : 'History, Economics, Civics'}
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-surface-soft)] border border-[var(--color-border-subtle)] space-y-1">
                  <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {isHindi ? 'अगला कदम / उच्च शिक्षा' : 'Leads To (Law & Humanities)'}
                  </div>
                  <ul className="text-[11px] text-[var(--color-text-primary)] space-y-0.5">
                    <li>• 1. B.A. (History, Pol Sci, Economics)</li>
                    <li>• 2. LAW / CLAT (BA LLB - 5 Years)</li>
                    <li>• 3. Civil Services (UPSC IAS/IPS)</li>
                    <li>• 4. Journalism & Mass Media (BJMC)</li>
                    <li>• 5. Psychology & Social Work (BSW)</li>
                    <li>• 6. Teacher Education (D.Ed / B.Ed)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ──── COLUMN 2: POLYTECHNIC DIPLOMAS ──── */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-cyan-500/30 hover:border-cyan-500 transition-all shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                    {isHindi ? 'डिप्लोमा पाठ्यक्रम (3 वर्ष)' : 'Diploma Courses (3 Years)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold">
                    POLYCET
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--color-text-primary)]">
                  <div
                    onClick={() => onSelectItem(findItem('poly-mechanical')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 1. Automobile & Mechanical Engg.
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-civil')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 2. Civil Engg. & Architect Asst.
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-electrical-electronics')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 3. Electrical (EEE) & Electronics (ECE)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-computer-it')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 4. Computer Engineering & IT
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-specialized')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 5. Aeronautical & Aerospace Engg.
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-specialized')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 6. Biomedical Engineering
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-specialized')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 7. Apparel & Fashion Technology
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-specialized')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    • 8. Mining & Chemical Engineering
                  </div>
                </div>

                {/* Outcome Box */}
                <div className="pt-2 border-t border-[var(--color-border-subtle)] p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-800 dark:text-cyan-200">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'डिप्लोमा के बाद सीधा मार्ग' : 'Progression Pathway'}</span>
                  </div>
                  <p>
                    {isHindi
                      ? '• बी.टेक द्वितीय वर्ष में पार्श्व प्रवेश (ECET / LEET Lateral Entry)'
                      : '• Direct Lateral Entry into 2nd Year B.Tech (via ECET / LEET)'}
                  </p>
                  <p className="mt-1">
                    {isHindi
                      ? '• रेलवे, बिजली बोर्ड व उपक्रमों में जूनियर इंजीनियर (JE) भर्ती'
                      : '• Direct Junior Engineer (JE in Railways, State Grid, PSUs)'}
                  </p>
                </div>
              </div>
            </div>

            {/* ──── COLUMN 3: VOCATIONAL INTERMEDIATE ──── */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-violet-500/30 hover:border-violet-500 transition-all shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                    {isHindi ? 'व्यावसायिक पाठ्यक्रम (2 वर्ष)' : 'Vocational Courses (2 Yrs)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-700 dark:text-violet-300 font-bold">
                    Job-Ready
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--color-text-primary)]">
                  <div
                    onClick={() => onSelectItem(findItem('voc-health-mpwh')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 1. MPHW (Multi-Purpose Health Worker)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('voc-health-mpwh')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 2. MLT (Medical Laboratory Technology)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('voc-health-mpwh')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 3. PHRA Technology (Pharma Assistant)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('voc-business-retail')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 4. Retail Management & E-Commerce
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('voc-business-retail')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 5. Accounting & Taxation (GST/Tally)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('agri-diplomas')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 6. Agriculture & Crop Management
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('poly-computer-it')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    • 7. Computer Science & DTP
                  </div>
                </div>

                {/* Outcome Box */}
                <div className="pt-2 border-t border-[var(--color-border-subtle)] p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-800 dark:text-violet-200">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'करियर अवसर' : 'Career Outcomes'}</span>
                  </div>
                  <p>
                    {isHindi
                      ? '• प्राथमिक स्वास्थ्य केंद्र (PHC) व अस्पताल में तत्काल सेवा'
                      : '• Direct employment in Primary Health Centers (PHCs) & Clinics'}
                  </p>
                  <p className="mt-1">
                    {isHindi
                      ? '• रिटेल सुपरमार्केट्स, ई-कॉमर्स व बी.वॉक (B.Voc) डिग्री'
                      : '• Supermarkets, Logistics hubs, or Bachelor of Vocational Studies'}
                  </p>
                </div>
              </div>
            </div>

            {/* ──── COLUMN 4: ITI CRAFTSMAN TRADES ──── */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-amber-500/30 hover:border-amber-500 transition-all shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    {isHindi ? 'आईटीआई ट्रेड्स (1-2 वर्ष)' : 'ITI Trades (1-2 Years)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                    NCVT / SCVT
                  </span>
                </div>

                {/* Engineering Trades */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
                    {isHindi ? 'इंजीनियरिंग स्ट्रीम' : 'Engineering Stream'}
                  </span>
                  <div
                    onClick={() => onSelectItem(findItem('iti-electrician')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 1. Electrician & Wireman
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-fitter-machinist')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 2. Fitter, Machinist & Turner
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-motor-diesel')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 3. Mechanic Motor Vehicle & Diesel
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-draughtsman')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 4. Draughtsman (Civil & Mech)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-specialized-trades')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 5. Welder & RAC Technician
                  </div>
                </div>

                {/* Non-Engineering Trades */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
                    {isHindi ? 'गैर-इंजीनियरिंग स्ट्रीम' : 'Non-Engineering Stream'}
                  </span>
                  <div
                    onClick={() => onSelectItem(findItem('iti-non-engineering')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 6. COPA (Computer Operator)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-non-engineering')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 7. Stenographer & Secretarial
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-non-engineering')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 8. Beautician & Cosmetology
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('iti-non-engineering')!)}
                    className="p-1.5 rounded-lg bg-[var(--color-surface-soft)] hover:bg-amber-500/10 cursor-pointer text-xs"
                  >
                    • 9. Tailoring & Dress Making
                  </div>
                </div>

                {/* Outcome Box */}
                <div className="pt-2 border-t border-[var(--color-border-subtle)] p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'प्रगति मार्ग' : 'Progression'}</span>
                  </div>
                  <p>
                    {isHindi
                      ? '• रेलवे असिस्टेंट लोको पायलट (ALP) व सरकारी अप्रेंटिसशिप'
                      : '• Railway Assistant Loco Pilot (ALP) & National Apprenticeship (NAC)'}
                  </p>
                  <p className="mt-1">
                    {isHindi
                      ? '• पॉलिटेक्निक डिप्लोमा द्वितीय वर्ष में सीधा प्रवेश'
                      : '• Direct Lateral Entry into 2nd Year Polytechnic Diploma'}
                  </p>
                </div>
              </div>
            </div>

            {/* ──── COLUMN 5: PARAMEDICAL DIPLOMAS ──── */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border-2 border-emerald-500/30 hover:border-emerald-500 transition-all shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {isHindi ? 'पैरामेडिकल डिप्लोमा (2-3 वर्ष)' : 'Paramedical (2-3 Yrs)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
                    Healthcare
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--color-text-primary)]">
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-surgery-cardiac')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 1. Operation Theatre (DOTT)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-diagnostics')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 2. Medical Laboratory (DMLT)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-imaging')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 3. Radiology (X-Ray / CT / MRI)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-therapy-care')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 4. Dialysis Technology
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-therapy-care')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 5. Optometry & Ophthalmic Tech
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-therapy-care')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 6. Physiotherapy Assistant (DPT)
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('paramedical-surgery-cardiac')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 7. ECG & Cardiac Care Technology
                  </div>
                  <div
                    onClick={() => onSelectItem(findItem('voc-health-mpwh')!)}
                    className="p-2 rounded-lg bg-[var(--color-surface-soft)] hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    • 8. General Nursing & Midwifery (GNM)
                  </div>
                </div>

                {/* Outcome Box */}
                <div className="pt-2 border-t border-[var(--color-border-subtle)] p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-200">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'अस्पताल व स्वास्थ्य करियर' : 'Clinical Destinations'}</span>
                  </div>
                  <p>
                    {isHindi
                      ? '• मल्टीस्पेशलिटी अस्पताल, ट्रॉमा सेंटर व डायग्नोस्टिक लैब्स'
                      : '• Multispecialty Hospitals, ICU/OT Trauma Suites & Diagnostics'}
                  </p>
                  <p className="mt-1">
                    {isHindi
                      ? '• बी.एससी संबद्ध स्वास्थ्य विज्ञान (Allied Health) में आगे की पढ़ाई'
                      : '• Progression to B.Sc Allied Health Sciences & Overseas Practice'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ──── EXTRA ROW: DEFENSE & UNIFORMED SERVICES (DIRECT ENTRY) ──── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border-2 border-rose-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-[var(--font-heading)] font-bold text-sm sm:text-base text-[var(--color-text-primary)]">
                    {isHindi
                      ? '6. रक्षा, पुलिस एवं वर्दीधारी सेवाएं (सीधा चयन)'
                      : '6. Defense, Police & Uniformed Services (Direct Entries)'}
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    {isHindi
                      ? '10वीं एवं 12वीं के बाद सीधे राष्ट्र सेवा एवं सम्मानित सरकारी रोजगार'
                      : 'Direct honorable national service opportunities immediately following matriculation or 10+2'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectItem(findItem('defense-post-10th')!)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <span>{isHindi ? 'रक्षा विवरण देखें' : 'View Defense Pathways'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => onSelectItem(findItem('defense-post-10th')!)}
                className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-rose-500/40 cursor-pointer space-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--color-text-primary)]">
                    {isHindi ? '10वीं के बाद सीधा चयन' : 'Direct Entry After 10th'}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Agniveer</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  • Indian Army Agniveer GD / Tradesman • Indian Navy Matric Recruit (MR) • Indian Coast Guard Navik DB • SSC MTS / Havaldar • State Police Constable
                </p>
              </div>

              <div
                onClick={() => onSelectItem(findItem('defense-post-12th')!)}
                className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-rose-500/40 cursor-pointer space-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--color-text-primary)]">
                    {isHindi ? '12वीं के बाद अधिकारी कमीशन' : 'Officer Commission After 12th'}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">UPSC NDA</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  • National Defence Academy (NDA - Army, Navy, Air Force Officer) • Air Force Agniveer Vayu • Navy Agniveer SSR • Coast Guard Navik GD • SSC CHSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
