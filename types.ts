export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string | null;
  registration_deadline: string | null;
  max_attendees: number | null;
  status: EventStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  designation: string | null;
  special_requirements: string | null;
  status: RegistrationStatus;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  event?: Event;
}

export type ContactStatus = 'new' | 'read' | 'replied';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export type Nationality = 'india' | 'international';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type ReviewStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'revision_required';

export interface PaperSubmission {
  id: string;
  submission_id: string;
  paper_title: string;
  authors: string;
  email: string;
  phone: string;
  institution: string;
  research_category: string;
  abstract: string;
  keywords: string;
  manuscript_url: string;
  nationality: Nationality;
  payment_amount: number;
  payment_currency: string;
  payment_status: PaymentStatus;
  review_status: ReviewStatus;
  review_time: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaperSubmissionInput {
  paper_title: string;
  authors: string;
  email: string;
  phone: string;
  institution: string;
  research_category: string;
  abstract: string;
  keywords: string;
  manuscript_url: string;
  nationality: Nationality;
}

export interface CreateEventInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url?: string | null;
  registration_deadline?: string | null;
  max_attendees?: number | null;
  status?: EventStatus;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

export interface CreateNewsInput {
  title: string;
  content: string;
  excerpt?: string | null;
  image_url?: string | null;
  published?: boolean;
  published_at?: string | null;
}

export interface UpdateNewsInput extends Partial<CreateNewsInput> {
  id: string;
}

export interface CreateRegistrationInput {
  event_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  designation?: string | null;
  special_requirements?: string | null;
}

export interface CreateContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}
