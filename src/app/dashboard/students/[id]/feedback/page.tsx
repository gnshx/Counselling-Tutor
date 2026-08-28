'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/teacher/Header';
import { RatingScale } from '@/components/ui/RatingScale';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { teacherFeedbackQuestions } from '@/lib/data/teacher-feedback';

export default function TeacherFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [student, setStudent] = useState<{ id: string; name: string; classGrade: string } | null>(null);
  const [ratings, setRatings] = useState<Record<string, number | 'N/O'>>({});
  const [strongestAreas, setStrongestAreas] = useState<string[]>([]);
  const [interestedAreas, setInterestedAreas] = useState<string[]>([]);
  const [workingStyle, setWorkingStyle] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
          if (data.student.feedbackStatus === 'completed') {
            setIsSuccess(true);
          }
        }
      } catch {
        console.error('Error fetching student');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  const handleRatingChange = (qId: string, val: number | 'N/O') => {
    setRatings((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required questions (tf1 - tf7 must be answered)
    const requiredRatingIds = ['tf1', 'tf2', 'tf3', 'tf4', 'tf5', 'tf6', 'tf7'];
    for (const qId of requiredRatingIds) {
      if (ratings[qId] === undefined) {
        setError('Please complete all ratings (1-7) before submitting.');
        return;
      }
    }

    if (strongestAreas.length === 0) {
      setError("Please select at least 1 area for student's strongest areas.");
      return;
    }

    if (interestedAreas.length === 0) {
      setError("Please select at least 1 area for student's interest areas.");
      return;
    }

    if (!workingStyle) {
      setError('Please select preferred working style.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const formattedRatings = Object.entries(ratings).map(([questionId, rating]) => ({
        questionId,
        rating,
      }));

      const res = await fetch(`/api/students/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings: formattedRatings,
          strongestAreas,
          interestedAreas,
          workingStyle,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit feedback');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <Header />
        <div className="max-w-3xl mx-auto p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading feedback form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link
          href={`/dashboard/students/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Profile</span>
        </Link>

        {isSuccess ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800/50 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Feedback Submitted!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Teacher observation feedback for <strong>{student?.name}</strong> has been saved.
              </p>
            </div>

            <div className="pt-2">
              <Button variant="primary" onClick={() => router.push('/dashboard')}>
                Return to Teacher Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Teacher Observation Feedback</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Evaluating <strong>{student?.name}</strong> (Class {student?.classGrade})
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating Questions 1-7 */}
              <div className="space-y-6">
                <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Ratings (1 = Very Low, 5 = Very Good, N/O = Not Observed)
                </h2>

                {teacherFeedbackQuestions
                  .filter((q) => q.type === 'rating')
                  .map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-3">
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                        {idx + 1}. {q.question} <span className="text-pink-500">*</span>
                      </label>
                      <RatingScale
                        value={ratings[q.id] ?? null}
                        onChange={(val) => handleRatingChange(q.id, val)}
                      />
                    </div>
                  ))}
              </div>

              {/* Question 8: Strongest Areas */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-3">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  8. Which areas appear to be the student&apos;s strongest based on your observations? <span className="text-pink-500">*</span>
                </label>
                <MultiSelect
                  options={teacherFeedbackQuestions.find((q) => q.id === 'tf8')?.options || []}
                  selectedValues={strongestAreas}
                  onChange={setStrongestAreas}
                  maxSelections={3}
                  colorTheme="indigo"
                />
              </div>

              {/* Question 9: Interested Areas */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-3">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  9. Which areas does the student appear most interested in? <span className="text-pink-500">*</span>
                </label>
                <MultiSelect
                  options={teacherFeedbackQuestions.find((q) => q.id === 'tf9')?.options || []}
                  selectedValues={interestedAreas}
                  onChange={setInterestedAreas}
                  maxSelections={3}
                  colorTheme="indigo"
                />
              </div>

              {/* Question 10: Preferred Working Style */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-3">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  10. What is the student&apos;s preferred working style based on your observation? <span className="text-pink-500">*</span>
                </label>
                <RadioGroup
                  options={teacherFeedbackQuestions.find((q) => q.id === 'tf10')?.options || []}
                  selectedValue={workingStyle}
                  onChange={setWorkingStyle}
                  colorTheme="indigo"
                />
              </div>

              {/* Optional Comment */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-2">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Optional Teacher Comment (Max 200 characters)
                </label>
                <p className="text-xs text-slate-500">
                  Is there anything important about this student&apos;s strengths or interests that the questions did not capture?
                </p>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type any additional observations..."
                  className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-right text-xs text-slate-400 font-semibold">{comment.length} / 200</div>
              </div>

              {error && <p className="text-xs font-bold text-rose-500 text-center">{error}</p>}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => router.push(`/dashboard/students/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-1/2"
                  isLoading={isSubmitting}
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
