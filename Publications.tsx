import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Upload, Search, FileText, Clock, CheckCircle, Award } from 'lucide-react';

export default function Publications() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 max-sm:text-3xl">
            <span className="gradient-text">Publish Your Research</span>
          </h1>
          <p className="text-lg text-muted-foreground max-sm:text-base">
            Submit your forensic science research papers for peer review and publication in our
            international journal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col @md:flex-row gap-4 justify-center mb-16 @container max-w-2xl mx-auto animate-fade-in-up stagger-1">
          <Button asChild size="lg" className="flex-1 hover-lift hover-glow">
            <Link to="/publications/submit">
              <Upload className="mr-2 h-5 w-5" />
              Submit Paper
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 hover-lift">
            <Link to="/publications/track">
              <Search className="mr-2 h-5 w-5" />
              Track Paper
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-card hover-lift transition-smooth animate-fade-in-up stagger-2">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-float">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Fast Review</h3>
              <p className="text-muted-foreground">
                Get your paper reviewed in just 1 minute with our streamlined process.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover-lift transition-smooth animate-fade-in-up stagger-3">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-float stagger-1">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Tracking</h3>
              <p className="text-muted-foreground">
                Track your submission status anytime with your unique submission ID.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover-lift transition-smooth animate-fade-in-up stagger-4">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-float stagger-2">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Global Reach</h3>
              <p className="text-muted-foreground">
                Publish in an internationally recognized forensic science journal.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Research Categories */}
        <Card className="shadow-card mb-16 animate-fade-in-up stagger-5">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Research Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
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
              ].map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent hover:border-primary transition-smooth hover-scale"
                >
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground text-sm">{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Publication Fees */}
        <Card className="shadow-card animate-fade-in-up stagger-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Publication Fees
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="p-6 border-2 border-primary rounded-lg text-center hover-lift transition-smooth bg-gradient-background">
                <h3 className="text-lg font-semibold text-foreground mb-2">Indian Authors</h3>
                <div className="text-4xl font-bold text-primary mb-2">₹1,500</div>
                <p className="text-sm text-muted-foreground">INR per paper</p>
              </div>
              <div className="p-6 border-2 border-secondary rounded-lg text-center hover-lift transition-smooth bg-gradient-background">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  International Authors
                </h3>
                <div className="text-4xl font-bold text-secondary mb-2">$50</div>
                <p className="text-sm text-muted-foreground">USD per paper</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
