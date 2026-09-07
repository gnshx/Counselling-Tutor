'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, UserPlus, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function AddStudentPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    classGrade: '8',
    school: '',
    parentJob: '',
    familyIncome: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdStudent, setCreatedStudent] = useState<{ name: string; accessCode: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.classGrade) {
      setError('Student name, date of birth, and class/grade are required.');
      setError(
        language === 'hi'
          ? 'विद्यार्थी का नाम, जन्म तिथि और कक्षा अनिवार्य हैं।'
          : 'Student name, date of birth, and class/grade are required.'
      );
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create student');
        setError(data.error || (language === 'hi' ? 'विद्यार्थी बनाने में त्रुटि' : 'Failed to create student'));
        setIsLoading(false);
        return;
      }

      setCreatedStudent({
        name: data.student.name,
        accessCode: data.student.accessCode,
      });
    } catch {
      setError('Connection error. Please try again.');
      setError(language === 'hi' ? 'कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।' : 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] text-[var(--color-text-primary)] font-sans antialiased">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
          <span>{language === 'hi' ? 'डैशबोर्ड पर वापस जाएँ' : 'Back to Dashboard'}</span>
        </Link>

        {createdStudent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800/60 shadow-xs text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-[var(--font-heading)] text-[var(--color-text-primary)]">Student Profile Created</h2>
              <h2 className="text-xl font-[var(--font-heading)] text-[var(--color-text-primary)]">
                {language === 'hi' ? 'विद्यार्थी प्रोफ़ाइल बन गई है' : 'Student Profile Created'}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Provide this Access Code to <strong>{createdStudent.name}</strong> to begin their journey.
                {language === 'hi' ? (
                  <>यह एक्सेस कोड <strong>{createdStudent.name}</strong> को उनकी यात्रा शुरू करने के लिए दें।</>
                ) : (
                  <>Provide this Access Code to <strong>{createdStudent.name}</strong> to begin their journey.</>
                )}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-primary)] font-mono text-2xl sm:text-3xl font-extrabold tracking-widest border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center gap-3">
              <KeyRound className="w-6 h-6 text-[var(--color-text-muted)] shrink-0" />
              <span>{createdStudent.accessCode}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full text-xs font-semibold rounded-xl"
                onClick={() => {
                  setCreatedStudent(null);
                  setFormData({
                    name: '',
                    dob: '',
                    classGrade: '8',
                    school: '',
                    parentJob: '',
                    familyIncome: '',
                  });
                }}
              >
                Add Another Student
                {language === 'hi' ? 'अन्य विद्यार्थी जोड़ें' : 'Add Another Student'}
              </Button>
              <Button
                variant="gradient"
                className="w-full text-xs font-semibold rounded-xl"
                onClick={() => router.push('/dashboard')}
              >
                Return to Dashboard
                {language === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Return to Dashboard'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 sm:p-8 border border-[var(--color-border-subtle)] shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center border border-indigo-200 dark:border-indigo-800/40">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-[var(--font-heading)] text-[var(--color-text-primary)]">Add New Student Profile</h1>
                <p className="text-xs text-[var(--color-text-secondary)]">Create a student record to generate an access login code</p>
                <h1 className="text-lg font-[var(--font-heading)] text-[var(--color-text-primary)]">
                  {language === 'hi' ? 'नया विद्यार्थी प्रोफ़ाइल जोड़ें' : 'Add New Student Profile'}
                </h1>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {language === 'hi'
                    ? 'लॉगिन एक्सेस कोड जनरेट करने के लिए विद्यार्थी का विवरण दर्ज करें'
                    : 'Create a student record to generate an access login code'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={language === 'hi' ? 'विद्यार्थी का पूरा नाम' : 'Student Full Name'}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />

                <div className="w-full space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
                    {language === 'hi' ? 'कक्षा / श्रेणी' : 'Class / Grade'} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.classGrade}
                    onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] text-xs font-semibold focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="8">{language === 'hi' ? 'कक्षा 8' : 'Class 8'}</option>
                    <option value="9">{language === 'hi' ? 'कक्षा 9' : 'Class 9'}</option>
                    <option value="10">{language === 'hi' ? 'कक्षा 10' : 'Class 10'}</option>
                  </select>
                </div>
              </div>

              <Input
                label={language === 'hi' ? 'विद्यालय का नाम (वैकल्पिक)' : 'School Name (Optional)'}
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder={language === 'hi' ? 'उदा. राजकीय उच्चतर माध्यमिक विद्यालय' : 'e.g. Government Higher Secondary School'}
              />

              <Input
                label={language === 'hi' ? 'अभिभावक का व्यवसाय / पेशा' : 'Parent / Guardian Job / Occupation'}
                value={formData.parentJob}
                onChange={(e) => setFormData({ ...formData, parentJob: e.target.value })}
                placeholder={language === 'hi' ? 'उदा. शिक्षक, किसान, इंजीनियर, दुकानदार, निजी सेवा...' : 'e.g. Teacher, Farmer, Engineer, Shopkeeper, Private Service...'}
              />

              <div className="w-full space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)]">
                  {language === 'hi' ? 'पारिवारिक वार्षिक आय सीमा' : 'Family Annual Income Range'}
                </label>
                <select
                  value={formData.familyIncome}
                  onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)] text-xs font-semibold focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">{language === 'hi' ? 'आय सीमा चुनें (वैकल्पिक)' : 'Select Income Range (Optional)'}</option>
                  <option value="Below ₹1 Lakh">{language === 'hi' ? '₹1 लाख से कम प्रति वर्ष' : 'Below ₹1 Lakh per year'}</option>
                  <option value="₹1 Lakh - ₹3 Lakhs">{language === 'hi' ? '₹1 लाख - ₹3 लाख प्रति वर्ष' : '₹1 Lakh - ₹3 Lakhs per year'}</option>
                  <option value="₹3 Lakhs - ₹6 Lakhs">{language === 'hi' ? '₹3 लाख - ₹6 लाख प्रति वर्ष' : '₹3 Lakhs - ₹6 Lakhs per year'}</option>
                  <option value="₹6 Lakhs - ₹10 Lakhs">{language === 'hi' ? '₹6 लाख - ₹10 लाख प्रति वर्ष' : '₹6 Lakhs - ₹10 Lakhs per year'}</option>
                  <option value="Above ₹10 Lakhs">{language === 'hi' ? '₹10 लाख से अधिक प्रति वर्ष' : 'Above ₹10 Lakhs per year'}</option>
                  <option value="Prefer not to say">{language === 'hi' ? 'बताना नहीं चाहते' : 'Prefer not to say'}</option>
                </select>
              </div>

              {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 text-xs font-semibold rounded-xl"
                  onClick={() => router.push('/dashboard')}
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-1/2 text-xs font-semibold rounded-xl"
                  isLoading={isLoading}
                >
                  {language === 'hi' ? 'विद्यार्थी जोड़ें' : 'Create Student'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
