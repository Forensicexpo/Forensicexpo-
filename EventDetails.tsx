import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEventById, createRegistration } from '@/db/api';
import type { Event } from '@/types/types';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const registrationSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  organization: z.string().optional(),
  designation: z.string().optional(),
  special_requirements: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      organization: '',
      designation: '',
      special_requirements: '',
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const data = await getEventById(id);
        if (!data) {
          navigate('/404');
          return;
        }
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const onSubmit = async (data: RegistrationFormData) => {
    if (!event) return;

    setSubmitting(true);
    try {
      await createRegistration({
        event_id: event.id,
        ...data,
      });
      setRegistered(true);
      toast.success('Registration submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-info text-white';
      case 'ongoing':
        return 'bg-success text-white';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8" />
            <div className="h-96 bg-muted rounded mb-8" />
            <div className="h-6 bg-muted rounded w-2/3 mb-4" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return null;
  }

  const canRegister = event.status === 'upcoming' && (!event.registration_deadline || new Date(event.registration_deadline) > new Date());

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {/* Event Image */}
            {event.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-card">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl xl:text-5xl font-bold text-foreground max-sm:text-3xl">
                  {event.title}
                </h1>
                <Badge className={getStatusColor(event.status)}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3 text-muted-foreground">
                  <Calendar className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Date</div>
                    <div>
                      {format(new Date(event.start_date), 'MMMM dd, yyyy')} -{' '}
                      {format(new Date(event.end_date), 'MMMM dd, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Location</div>
                    <div>{event.location}</div>
                  </div>
                </div>
                {event.registration_deadline && (
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Clock className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">Registration Deadline</div>
                      <div>{format(new Date(event.registration_deadline), 'MMMM dd, yyyy')}</div>
                    </div>
                  </div>
                )}
                {event.max_attendees && (
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Users className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">Maximum Attendees</div>
                      <div>{event.max_attendees} participants</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold text-foreground mb-4">About This Event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="xl:col-span-1">
            <Card className="sticky top-4 shadow-card">
              <CardHeader>
                <CardTitle>
                  {registered ? 'Registration Confirmed' : 'Event Registration'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {registered ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Thank You!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your registration has been submitted successfully. We'll contact you soon with
                      further details.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/events">Browse More Events</Link>
                    </Button>
                  </div>
                ) : canRegister ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="Your organization" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                              <Input placeholder="Your role/title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="special_requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any special requirements or notes"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Register Now'}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {event.status === 'completed'
                        ? 'This event has ended.'
                        : event.status === 'cancelled'
                        ? 'This event has been cancelled.'
                        : 'Registration is currently closed.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
