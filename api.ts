import { supabase } from './supabase';
import type {
  Event,
  News,
  Registration,
  ContactSubmission,
  Profile,
  CreateEventInput,
  UpdateEventInput,
  CreateNewsInput,
  UpdateNewsInput,
  CreateRegistrationInput,
  CreateContactInput,
  PaperSubmission,
  CreatePaperSubmissionInput,
  ReviewStatus,
  PaymentStatus,
} from '@/types/types';

// Events API
export const getEvents = async (status?: string): Promise<Event[]> => {
  let query = supabase.from('events').select('*').order('start_date', { ascending: true });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getEventById = async (id: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...input,
      created_by: user?.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateEvent = async (input: UpdateEventInput): Promise<Event> => {
  const { id, ...updates } = input;
  
  const { data, error } = await supabase
    .from('events')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
};

// News API
export const getPublishedNews = async (limit?: number): Promise<News[]> => {
  let query = supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getNewsById = async (id: string): Promise<News | null> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createNews = async (input: CreateNewsInput): Promise<News> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const newsData: any = {
    ...input,
    created_by: user?.id,
  };
  
  if (input.published && !input.published_at) {
    newsData.published_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('news')
    .insert(newsData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateNews = async (input: UpdateNewsInput): Promise<News> => {
  const { id, ...updates } = input;
  
  const newsData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  if (updates.published && !updates.published_at) {
    newsData.published_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('news')
    .update(newsData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteNews = async (id: string): Promise<void> => {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
};

// Registrations API
export const getRegistrations = async (eventId?: string): Promise<Registration[]> => {
  let query = supabase
    .from('registrations')
    .select('*, event:events(*)')
    .order('created_at', { ascending: false });
  
  if (eventId) {
    query = query.eq('event_id', eventId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getRegistrationById = async (id: string): Promise<Registration | null> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, event:events(*)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createRegistration = async (input: CreateRegistrationInput): Promise<Registration> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      ...input,
      user_id: user?.id || null,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateRegistrationStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<Registration> => {
  const { data, error } = await supabase
    .from('registrations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteRegistration = async (id: string): Promise<void> => {
  const { error } = await supabase.from('registrations').delete().eq('id', id);
  if (error) throw error;
};

// Contact Submissions API
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createContactSubmission = async (input: CreateContactInput): Promise<ContactSubmission> => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(input)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateContactStatus = async (
  id: string,
  status: 'new' | 'read' | 'replied'
): Promise<ContactSubmission> => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Profiles API
export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Image Upload API
export const uploadImage = async (file: File, folder: string = 'general'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('app-8u5hf9geercx_forensic_images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('app-8u5hf9geercx_forensic_images')
    .getPublicUrl(data.path);
  
  return publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  const path = url.split('/').slice(-2).join('/');
  
  const { error } = await supabase.storage
    .from('app-8u5hf9geercx_forensic_images')
    .remove([path]);
  
  if (error) throw error;
};

// Paper Submissions API
export const getPaperSubmissions = async (): Promise<PaperSubmission[]> => {
  const { data, error } = await supabase
    .from('paper_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getPaperSubmissionById = async (submissionId: string): Promise<PaperSubmission | null> => {
  const { data, error } = await supabase
    .from('paper_submissions')
    .select('*')
    .eq('submission_id', submissionId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createPaperSubmission = async (input: CreatePaperSubmissionInput): Promise<PaperSubmission> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Determine payment amount based on nationality
  const paymentAmount = input.nationality === 'india' ? 1500 : 50;
  const paymentCurrency = input.nationality === 'india' ? 'INR' : 'USD';
  
  const { data, error } = await supabase
    .from('paper_submissions')
    .insert({
      ...input,
      payment_amount: paymentAmount,
      payment_currency: paymentCurrency,
      user_id: user?.id || null,
      submission_id: '', // Will be auto-generated by trigger
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePaperSubmissionStatus = async (
  id: string,
  reviewStatus: ReviewStatus,
  paymentStatus?: PaymentStatus
): Promise<PaperSubmission> => {
  const updates: any = {
    review_status: reviewStatus,
    updated_at: new Date().toISOString(),
  };
  
  if (reviewStatus === 'under_review' || reviewStatus === 'accepted') {
    updates.review_time = new Date().toISOString();
  }
  
  if (paymentStatus) {
    updates.payment_status = paymentStatus;
  }
  
  const { data, error } = await supabase
    .from('paper_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePaperSubmission = async (id: string): Promise<void> => {
  const { error } = await supabase.from('paper_submissions').delete().eq('id', id);
  if (error) throw error;
};
