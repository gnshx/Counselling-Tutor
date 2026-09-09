-- Enable Row Level Security (RLS) on all tables in public schema
-- This blocks unauthorized public access via Supabase PostgREST REST API
-- while allowing Next.js / Prisma (which connects via PostgreSQL native connection) to operate normally.

ALTER TABLE "Teacher" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuestionnaireResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssessmentResponse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeacherFeedback" ENABLE ROW LEVEL SECURITY;
