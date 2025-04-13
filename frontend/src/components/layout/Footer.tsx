
import { Link } from 'react-router-dom';
import { BookOpen, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpen className="h-5 w-5 text-book-burgundy" />
            <span className="text-lg font-semibold">BookWorm Hub</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link to="/browse" className="text-sm hover:text-primary transition-colors">
              Browse Books
            </Link>
            <a href="#" className="text-sm hover:text-primary transition-colors">
              About Us
            </a>
            <a href="#" className="text-sm hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@bookwormhub.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BookWorm Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
