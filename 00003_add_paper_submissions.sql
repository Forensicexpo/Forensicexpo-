-- Create paper submissions table
CREATE TABLE public.paper_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id TEXT UNIQUE NOT NULL,
  paper_title TEXT NOT NULL,
  authors TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution TEXT NOT NULL,
  research_category TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT NOT NULL,
  manuscript_url TEXT NOT NULL,
  nationality TEXT NOT NULL CHECK (nationality IN ('india', 'international')),
  payment_amount DECIMAL NOT NULL,
  payment_currency TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed')),
  review_status TEXT DEFAULT 'submitted' NOT NULL CHECK (review_status IN ('submitted', 'under_review', 'accepted', 'rejected', 'revision_required')),
  review_time TIMESTAMPTZ,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create function to generate unique submission ID
CREATE OR REPLACE FUNCTION generate_submission_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate ID in format SUB + 7 random digits
    new_id := 'SUB' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0');
    
    -- Check if ID already exists
    SELECT EXISTS(SELECT 1 FROM public.paper_submissions WHERE submission_id = new_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_id;
END;
$$;

-- Create trigger to auto-generate submission ID
CREATE OR REPLACE FUNCTION set_submission_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.submission_id IS NULL OR NEW.submission_id = '' THEN
    NEW.submission_id := generate_submission_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_paper_submission
  BEFORE INSERT ON public.paper_submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_submission_id();

-- Enable RLS
ALTER TABLE public.paper_submissions ENABLE ROW LEVEL SECURITY;

-- Paper submissions policies
CREATE POLICY "Anyone can submit papers" ON public.paper_submissions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Users can view their own submissions" ON public.paper_submissions
  FOR SELECT TO public USING (
    auth.uid() = user_id OR 
    email = current_setting('request.jwt.claims', true)::json->>'email' OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can view all submissions" ON public.paper_submissions
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update submissions" ON public.paper_submissions
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete submissions" ON public.paper_submissions
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Create index for better performance
CREATE INDEX idx_paper_submissions_submission_id ON public.paper_submissions(submission_id);
CREATE INDEX idx_paper_submissions_email ON public.paper_submissions(email);
CREATE INDEX idx_paper_submissions_status ON public.paper_submissions(review_status);
CREATE INDEX idx_paper_submissions_payment ON public.paper_submissions(payment_status);