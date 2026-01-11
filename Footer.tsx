import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1">
                <img
                  src="https://miaoda-edit-image.s3cdn.medo.dev/8u5hf9geercx/IMG-8u8en50euk8w.jpg"
                  alt="Forensic Expo Logo"
                  className="w-full h-full object-contain"
                  data-editor-config="%7B%22defaultSrc%22%3A%22https%3A%2F%2Fmiaoda-edit-image.s3cdn.medo.dev%2F8u5hf9geercx%2FIMG-8u8en50euk8w.jpg%22%7D" />
              </div>
              <span className="font-bold text-xl text-foreground">Forensic Expo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Leading the way in forensic science exhibitions and professional development.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">forensicexpo392@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-muted-foreground">
                  <div>+91 90751 30604 (Mr. Chetan Satote)</div>
                  <div className="mt-1">+91 76205 31909 (Mr. Pratik Nawathe)</div>
                </div>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Chatrapati Sambhaji Nagar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 Forensic Expo Organisation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
