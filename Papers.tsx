import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Trash2, Eye, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPaperSubmissions, updatePaperSubmissionStatus, deletePaperSubmission } from '@/db/api';
import type { PaperSubmission, ReviewStatus, PaymentStatus } from '@/types/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Papers() {
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<PaperSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPapers = async () => {
    try {
      const data = await getPaperSubmissions();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast.error('Failed to load paper submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleStatusChange = async (
    id: string,
    reviewStatus: ReviewStatus,
    paymentStatus?: PaymentStatus
  ) => {
    try {
      await updatePaperSubmissionStatus(id, reviewStatus, paymentStatus);
      toast.success('Status updated successfully');
      fetchPapers();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      await deletePaperSubmission(id);
      toast.success('Submission deleted successfully');
      fetchPapers();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const getReviewStatusColor = (status: string) => {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Paper Submissions</h1>
          <p className="text-muted-foreground">Manage research paper submissions and reviews</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : papers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission ID</TableHead>
                      <TableHead>Paper Title</TableHead>
                      <TableHead>Authors</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Review Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {papers.map((paper) => (
                      <TableRow key={paper.id}>
                        <TableCell className="font-medium">{paper.submission_id}</TableCell>
                        <TableCell className="max-w-xs truncate">{paper.paper_title}</TableCell>
                        <TableCell>{paper.authors}</TableCell>
                        <TableCell className="text-sm">{paper.research_category}</TableCell>
                        <TableCell>{format(new Date(paper.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Select
                            value={paper.review_status}
                            onValueChange={(value) =>
                              handleStatusChange(paper.id, value as ReviewStatus)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue>
                                <Badge className={getReviewStatusColor(paper.review_status)}>
                                  {paper.review_status.replace('_', ' ')}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="revision_required">Revision Required</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={paper.payment_status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                paper.id,
                                paper.review_status,
                                value as PaymentStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>
                                <Badge className={getPaymentStatusColor(paper.payment_status)}>
                                  {paper.payment_status}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Dialog
                              open={dialogOpen && selectedPaper?.id === paper.id}
                              onOpenChange={(open) => {
                                setDialogOpen(open);
                                if (!open) setSelectedPaper(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedPaper(paper)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Submission Details</DialogTitle>
                                </DialogHeader>
                                {selectedPaper && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">
                                          Submission ID
                                        </p>
                                        <p className="font-semibold">{selectedPaper.submission_id}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">
                                          Submitted On
                                        </p>
                                        <p className="font-semibold">
                                          {format(new Date(selectedPaper.created_at), 'MMM dd, yyyy')}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Paper Title</p>
                                      <p className="font-semibold">{selectedPaper.paper_title}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Authors</p>
                                        <p className="font-semibold">{selectedPaper.authors}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Category</p>
                                        <p className="font-semibold">
                                          {selectedPaper.research_category}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-semibold">{selectedPaper.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-semibold">{selectedPaper.phone}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Institution</p>
                                      <p className="font-semibold">{selectedPaper.institution}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Abstract</p>
                                      <p className="text-sm">{selectedPaper.abstract}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Keywords</p>
                                      <p className="text-sm">{selectedPaper.keywords}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Nationality</p>
                                      <Badge>
                                        {selectedPaper.nationality === 'india'
                                          ? 'India'
                                          : 'International'}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Manuscript
                                      </p>
                                      <Button asChild variant="outline" size="sm">
                                        <a
                                          href={selectedPaper.manuscript_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          View Manuscript
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(paper.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No paper submissions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
