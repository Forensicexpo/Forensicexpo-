import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Upload, CheckCircle, Mail, Search, Clock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createPaperSubmission, uploadImage } from '@/db/api';
import type { Nationality } from '@/types/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const RESEARCH_CATEGORIES = [
  'Forensic Biology',
  'Digital Forensics',
  'Forensic Ballistics',
  'Forensic Toxicology',
  'Forensic Biometrics',
  'Forensic Entomology',
  'Forensic Psychology',
  'Forensic Anthropology',
  'Crime Scene Investigation',
  'Forensic Chemistry',
  'Forensic Pathology',
  'Forensic Odontology',
  'Forensic DNA Analysis',
  'Forensic Serology',
  'Forensic Document Examination',
  'Forensic Accounting',
  'Forensic Engineering',
  'Forensic Botany',
  'Forensic Geology',
  'Forensic Archaeology',
  'Forensic Linguistics',
  'Forensic Nursing',
  'Forensic Psychiatry',
  'Forensic Radiology',
  'Forensic Taphonomy',
  'Bloodstain Pattern Analysis',
  'Fingerprint Analysis',
  'Trace Evidence Analysis',
  'Forensic Firearms Examination',
  'Forensic Tool Mark Analysis',
  'Forensic Hair and Fiber Analysis',
  'Forensic Glass Analysis',
  'Forensic Paint Analysis',
  'Forensic Soil Analysis',
  'Forensic Handwriting Analysis',
  'Forensic Voice Analysis',
  'Forensic Image Analysis',
  'Forensic Video Analysis',
  'Cyber Forensics',
  'Mobile Device Forensics',
  'Network Forensics',
  'Forensic Data Recovery',
  'Forensic Malware Analysis',
  'Forensic Cryptanalysis',
  'Wildlife Forensics',
  'Environmental Forensics',
  'Forensic Meteorology',
  'Forensic Limnology',
  'Forensic Palynology',
  'Questioned Document Analysis',
  'Forensic Explosives Analysis',
  'Forensic Arson Investigation',
  'Forensic Accident Reconstruction',
  'Forensic Biomechanics',
  'Forensic Gait Analysis',
  'Forensic Facial Reconstruction',
  'Forensic Age Estimation',
  'Forensic Sex Determination',
  'Forensic Ancestry Analysis',
  'Forensic Mitochondrial DNA',
  'Forensic Y-STR Analysis',
  'Forensic SNP Analysis',
  'Forensic Epigenetics',
  'Forensic Proteomics',
  'Forensic Metabolomics',
  'Forensic Microbiome Analysis',
  'Forensic Isotope Analysis',
  'Forensic Mass Spectrometry',
  'Forensic Chromatography',
  'Forensic Spectroscopy',
  'Forensic Microscopy',
  'Forensic Imaging Techniques',
  'Forensic 3D Scanning',
  'Forensic Photogrammetry',
  'Forensic Drone Technology',
  'Forensic Artificial Intelligence',
  'Forensic Machine Learning',
  'Forensic Blockchain Analysis',
  'Forensic Social Media Analysis',
  'Forensic Dark Web Investigation',
  'Forensic Cloud Computing',
  'Forensic IoT Analysis',
  'Forensic Wearable Technology',
  'Forensic Bioinformatics',
  'Forensic Nanotechnology',
  'Forensic Quality Assurance',
  'Forensic Laboratory Management',
  'Forensic Ethics and Law',
  'Forensic Expert Testimony',
  'Forensic Case Management',
  'Forensic Evidence Collection',
  'Forensic Evidence Preservation',
  'Forensic Chain of Custody',
  'Forensic Report Writing',
  'Forensic Statistical Analysis',
  'Forensic Probability Theory',
  'Forensic Bayesian Analysis',
  'Forensic Population Genetics',
  'Forensic Comparative Analysis',
  'Forensic Pattern Recognition',
  'Other Forensic Sciences',
];

const paperSchema = z.object({
  paper_title: z.string().min(10, 'Paper title must be at least 10 characters'),
  authors: z.string().min(5, 'Please provide author name(s)'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please provide a valid phone number'),
  institution: z.string().min(3, 'Institution/Organization is required'),
  research_category: z.string().min(1, 'Please select a research category'),
  abstract: z.string().min(200, 'Abstract must be at least 200 characters').max(300, 'Abstract must not exceed 300 characters'),
  keywords: z.string().min(10, 'Please provide keywords separated by commas'),
  nationality: z.enum(['india', 'international']),
});

type PaperFormData = z.infer<typeof paperSchema>;

export default function SubmitPaper() {
  const navigate = useNavigate();
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const form = useForm<PaperFormData>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      paper_title: '',
      authors: '',
      email: '',
      phone: '',
      institution: '',
      research_category: '',
      abstract: '',
      keywords: '',
      nationality: 'india',
    },
  });

  const nationality = form.watch('nationality');
  const paymentAmount = nationality === 'india' ? '₹1,500 INR' : '$50 USD';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['doc', 'docx'].includes(fileExt || '')) {
        toast.error('Please upload a DOC or DOCX file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setManuscriptFile(file);
    }
  };

  const onSubmit = async (data: PaperFormData) => {
    if (!manuscriptFile) {
      toast.error('Please upload your manuscript');
      return;
    }

    setSubmitting(true);
    try {
      // Upload manuscript
      const manuscriptUrl = await uploadImage(manuscriptFile, 'manuscripts');

      // Create submission
      const submission = await createPaperSubmission({
        ...data,
        manuscript_url: manuscriptUrl,
      });

      setSubmissionData(submission);
      setSubmitted(true);
      toast.success('Paper submitted successfully!');
    } catch (error) {
      console.error('Error submitting paper:', error);
      toast.error('Failed to submit paper. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && submissionData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-card border-2 border-success">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Submission Successful!
                </h1>
                <p className="text-muted-foreground mb-8">
                  Your paper has been submitted for review
                </p>

                <Card className="bg-accent mb-8">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Your Submission ID</p>
                    <p className="text-3xl font-bold text-primary mb-2">
                      {submissionData.submission_id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please save this ID for tracking your submission
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      A confirmation email has been sent to{' '}
                      <span className="font-semibold text-foreground">{submissionData.email}</span>
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Search className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      You can track your paper status using the Track Paper feature
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Our review process typically takes 1 minute
                    </p>
                  </div>
                </div>

                <Alert className="mb-8 bg-warning/10 border-warning">
                  <AlertDescription className="text-sm">
                    <strong>Payment Required:</strong> Please complete the payment of{' '}
                    <strong>{paymentAmount}</strong> to proceed with the review process.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col @md:flex-row gap-4 @container">
                  <Button
                    onClick={() =>
                      navigate('/publications/payment', {
                        state: { submission: submissionData },
                      })
                    }
                    className="flex-1"
                  >
                    Proceed to Payment
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/publications/track">Track Paper</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 max-sm:text-3xl">
              Submit Paper
            </h1>
            <p className="text-muted-foreground">
              Submit your research paper for publication
            </p>
          </div>

          <Alert className="mb-8 bg-info/10 border-info">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Before You Submit:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Ensure your manuscript follows our publication guidelines</li>
                <li>• Download and use the paper format template</li>
                <li>• File format: DOC, DOCX (Maximum size: 10 MB)</li>
                <li>• Review time: 1 minute</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Paper Submission Form</CardTitle>
              <p className="text-sm text-muted-foreground">
                All fields marked with * are required
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paper_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the title of your research paper" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author(s) Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dr. John Doe, Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @container">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
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
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution/Organization *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your university or research institution" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @container">
                    <FormField
                      control={form.control}
                      name="research_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Research Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RESEARCH_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author Nationality *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="india">India</SelectItem>
                              <SelectItem value="international">International</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abstract *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a brief abstract of your research (200-300 words)"
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          {field.value.length}/300 characters
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Separate keywords with commas (e.g., DNA Analysis, Forensic Science)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Upload Manuscript *</FormLabel>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <Input
                        type="file"
                        accept=".doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="manuscript-upload"
                      />
                      <label htmlFor="manuscript-upload" className="cursor-pointer">
                        <span className="text-primary font-medium hover:underline">
                          Click to upload
                        </span>{' '}
                        <span className="text-muted-foreground">or drag and drop</span>
                        <p className="text-sm text-muted-foreground mt-2">
                          DOC or DOCX (max. 10MB)
                        </p>
                      </label>
                      {manuscriptFile && (
                        <p className="text-sm text-success mt-4">
                          ✓ {manuscriptFile.name} selected
                        </p>
                      )}
                    </div>
                  </div>

                  <Alert className="bg-accent">
                    <AlertDescription>
                      <strong>Publication Fee:</strong> {paymentAmount}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        Payment will be required after submission to proceed with the review.
                      </span>
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Paper for Review'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
