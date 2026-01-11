import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, Download, Mail, Phone, User, Calendar, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getPaperSubmissionById } from '@/db/api';
import type { PaperSubmission } from '@/types/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const trackSchema = z.object({
  submission_id: z.string().min(10, 'Please enter a valid submission ID'),
});

type TrackFormData = z.infer<typeof trackSchema>;

export default function TrackPaper() {
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState<PaperSubmission | null>(null);
  const navigate = useNavigate();

  const form = useForm<TrackFormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      submission_id: '',
    },
  });

  const onSubmit = async (data: TrackFormData) => {
    setLoading(true);
    try {
      const result = await getPaperSubmissionById(data.submission_id);
      if (result) {
        setSubmission(result);
        toast.success('Submission found successfully!');
      } else {
        toast.error('Submission not found. Please check your ID and try again.');
        setSubmission(null);
      }
    } catch (error) {
      console.error('Error tracking submission:', error);
      toast.error('Failed to track submission. Please try again.');
      setSubmission(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="h-8 w-8 text-info" />;
      case 'under_review':
        return <Clock className="h-8 w-8 text-warning" />;
      case 'accepted':
        return <CheckCircle className="h-8 w-8 text-success" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-destructive" />;
      case 'revision_required':
        return <AlertCircle className="h-8 w-8 text-warning" />;
      default:
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-info text-white';
      case 'under_review':
        return 'bg-warning text-white';
      case 'accepted':
        return 'bg-success text-white';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'revision_required':
        return 'bg-warning text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Your paper has been successfully submitted and is awaiting initial review';
      case 'under_review':
        return 'Your paper is currently being reviewed by our expert panel';
      case 'accepted':
        return 'Congratulations! Your paper has been accepted for publication';
      case 'rejected':
        return 'Your paper has been rejected. Please contact us for detailed feedback';
      case 'revision_required':
        return 'Revisions are required. Please check your email for detailed comments';
      default:
        return 'Status information not available';
    }
  };

  const handleCompletePayment = () => {
    if (submission) {
      navigate('/publications/payment', { state: { submission } });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-4 max-sm:text-3xl">
              Track Your Paper
            </h1>
            <p className="text-lg text-muted-foreground max-sm:text-base">
              Enter your submission ID to check the status of your paper submission
            </p>
          </div>

          <Card className="shadow-card mb-8">
            <CardHeader className="bg-gradient-background">
              <CardTitle className="flex items-center text-foreground">
                <Search className="mr-2 h-5 w-5" />
                Search Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="submission_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Submission ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., SUB1230967" 
                            {...field}
                            className="text-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    <Search className="mr-2 h-5 w-5" />
                    {loading ? 'Searching...' : 'Track Submission'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {submission && (
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="shadow-card border-2 border-primary">
                <CardContent className="pt-6">
                  <div className="flex flex-col @md:flex-row items-center @md:items-start space-y-4 @md:space-y-0 @md:space-x-6 @container">
                    <div className="shrink-0">
                      {getStatusIcon(submission.review_status)}
                    </div>
                    <div className="flex-1 text-center @md:text-left">
                      <div className="flex flex-col @md:flex-row @md:items-center @md:justify-between mb-2">
                        <h2 className="text-2xl font-bold text-foreground mb-2 @md:mb-0">
                          Current Status
                        </h2>
                        <Badge className={`${getStatusColor(submission.review_status)} text-sm px-4 py-1`}>
                          {submission.review_status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {getStatusMessage(submission.review_status)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Details */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Submission ID</p>
                        <p className="font-semibold text-foreground">{submission.submission_id}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                        <p className="font-semibold text-foreground">
                          {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 md:col-span-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Paper Title</p>
                        <p className="font-semibold text-foreground">{submission.paper_title}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Authors</p>
                        <p className="font-semibold text-foreground">{submission.authors}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Research Category</p>
                        <p className="font-semibold text-foreground">{submission.research_category}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-semibold text-foreground">{submission.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="font-semibold text-foreground">{submission.phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col @md:flex-row items-center justify-between p-6 bg-gradient-background rounded-lg @container">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                      <Badge className={`${getPaymentStatusColor(submission.payment_status)} text-base px-4 py-1`}>
                        {submission.payment_status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-center @md:text-right mt-4 @md:mt-0">
                      <p className="text-sm text-muted-foreground mb-1">Amount</p>
                      <p className="text-3xl font-bold text-primary">
                        {submission.payment_currency === 'INR' ? '₹' : '$'}
                        {submission.payment_amount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Information */}
              {submission.review_time && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Review Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Review Completed On</p>
                        <p className="font-semibold text-foreground">
                          {format(new Date(submission.review_time), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col @md:flex-row gap-4 @container">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="lg"
                  onClick={() => {
                    setSubmission(null);
                    form.reset();
                  }}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track Another Paper
                </Button>
                {submission.payment_status === 'pending' && (
                  <Button 
                    className="flex-1" 
                    size="lg"
                    onClick={handleCompletePayment}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Complete Payment
                  </Button>
                )}
                {submission.manuscript_url && (
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    size="lg"
                    onClick={() => window.open(submission.manuscript_url, '_blank')}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Manuscript
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
