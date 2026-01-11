import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Smartphone, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { PaperSubmission } from '@/types/types';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const submission = (location.state as any)?.submission as PaperSubmission | undefined;

  useEffect(() => {
    if (!submission) {
      toast.error('No submission data found');
      navigate('/publications');
    }
  }, [submission, navigate]);

  if (!submission) {
    return null;
  }

  const paymentAmount = submission.payment_amount;
  const currency = submission.payment_currency;
  const upiId = 'satotechetan6@okhdfcbank';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUPIPayment = () => {
    if (currency === 'INR') {
      // For Indian authors - use web UPI link
      const amount = paymentAmount;
      const webUpiUrl = `https://www.upi.me/pay?pa=${upiId}&am=${amount}`;
      
      // Open in new tab
      window.open(webUpiUrl, '_blank');
      
      toast.info('Opening UPI payment page... Please complete the payment');
    } else {
      // For international authors - show payment instructions
      toast.info('Please contact us for international payment options');
    }
  };

  const handleMobileUPIPayment = () => {
    if (currency === 'INR') {
      // Generate UPI payment URL for mobile apps
      const upiUrl = `upi://pay?pa=${upiId}&pn=Forensic Expo Organisation&am=${paymentAmount}&cu=${currency}&tn=Paper Submission ${submission.submission_id}`;
      
      // Open UPI app
      window.location.href = upiUrl;
      
      toast.info('Opening UPI app... Please complete the payment');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 max-sm:text-3xl">
              Complete Payment
            </h1>
            <p className="text-muted-foreground">
              Complete your payment to proceed with the review process
            </p>
          </div>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-accent rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Submission ID</p>
                  <p className="font-semibold text-foreground">{submission.submission_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {currency === 'INR' ? '₹' : '$'}
                    {paymentAmount}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Paper Title</p>
                <p className="font-medium text-foreground">{submission.paper_title}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Author(s)</p>
                <p className="font-medium text-foreground">{submission.authors}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                {currency === 'INR' ? (
                  <>
                    <Smartphone className="mr-2 h-5 w-5" />
                    UPI Payment
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    International Payment
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currency === 'INR' ? (
                <>
                  <Alert className="bg-info/10 border-info">
                    <AlertDescription>
                      <strong>Payment Method:</strong> UPI (Unified Payments Interface)
                      <br />
                      <span className="text-sm">
                        You can pay using any UPI app like Google Pay, PhonePe, Paytm, or BHIM
                      </span>
                    </AlertDescription>
                  </Alert>

                  <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                    <p className="text-sm text-muted-foreground mb-2">UPI ID</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-foreground">{upiId}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUPI}
                        className="shrink-0"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-foreground">Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Click the "Pay with UPI" button below to open the payment page</li>
                      <li>Or click "Open UPI App" to pay directly from your mobile UPI app</li>
                      <li>Verify the payment details (Amount: ₹{paymentAmount})</li>
                      <li>Complete the payment using your UPI PIN</li>
                      <li>Save the transaction ID for your records</li>
                    </ol>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button onClick={handleUPIPayment} className="w-full" size="lg">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Pay with UPI
                    </Button>
                    
                    <Button 
                      onClick={handleMobileUPIPayment} 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                    >
                      <Smartphone className="mr-2 h-5 w-5" />
                      Open UPI App
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Or scan the QR code in your UPI app with the UPI ID above
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Alert className="bg-info/10 border-info">
                    <AlertDescription>
                      <strong>International Payment:</strong> ${paymentAmount} USD
                      <br />
                      <span className="text-sm">
                        Please contact us for international payment options
                      </span>
                    </AlertDescription>
                  </Alert>

                  <div className="p-6 border-2 border-primary rounded-lg bg-primary/5 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Contact Email</p>
                      <p className="text-lg font-semibold text-foreground">forensicexpo392@gmail.com</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Contact Phone</p>
                      <p className="text-lg font-semibold text-foreground">+91 90751 30604</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Your Submission ID</p>
                      <p className="text-lg font-semibold text-foreground">{submission.submission_id}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-foreground">Payment Instructions:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Contact us via email or phone with your submission ID</li>
                      <li>We will provide international payment options (Wire Transfer, PayPal, etc.)</li>
                      <li>Complete the payment as per the instructions provided</li>
                      <li>Send payment confirmation to our email</li>
                      <li>Your submission will be processed after payment verification</li>
                    </ol>
                  </div>

                  <Button 
                    onClick={() => window.location.href = 'mailto:forensicexpo392@gmail.com?subject=International Payment - ' + submission.submission_id}
                    className="w-full" 
                    size="lg"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Contact Us for Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Alert className="mb-6">
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> After completing the payment, your submission will be
              automatically processed for review. You will receive a confirmation email once the
              payment is verified.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col @md:flex-row gap-4 @container">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/publications')}>
              Back to Publications
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/publications/track')}
            >
              Track Submission
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
