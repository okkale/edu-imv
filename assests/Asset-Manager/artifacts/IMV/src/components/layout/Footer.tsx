import { Link } from "wouter";
import { MapPin, Phone, Mail, ChevronRight, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* About */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold tracking-tight mb-4">Indrayani Mahavidyalaya</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Indrayani Mahavidyalaya is a premier institution under Indrayani Vidya Mandir, dedicated to excellence in higher education, student development, and community service.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-primary-foreground/10 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Admissions", href: "/admissions" },
                { label: "Academic Programs", href: "/academics" },
                { label: "Faculty Directory", href: "/faculty" },
                { label: "Placements", href: "/placements" },
                { label: "NAAC", href: "/naac" },
                { label: "Support", href: "/support" },
                { label: "Campus News", href: "/news" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-primary-foreground/80 hover:text-accent transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-primary-foreground/10 pb-2">Departments</h4>
            <ul className="space-y-2">
              {[
                "BCA",
                "BBA",
                "MCA",
                "MBA",
              ].map((dept) => (
                <li key={dept}>
                  <Link href={`/courses?dept=${encodeURIComponent(dept)}`}>
                    <span className="text-sm text-primary-foreground/80 hover:text-accent transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      {dept}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-primary-foreground/10 pb-2">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>Talegaon-Chakan Road, Talegaon Dabhade, Pune, Maharashtra 410507</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+91 89836 83005 / +91 89836 73005</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:admission@indrayanicollege.com" className="hover:text-accent transition-colors">admission@indrayanicollege.com</a>
              </li>
            </ul>
          </div>

        </div>
      </div>
      
      <div className="bg-primary/95 border-t border-primary-foreground/10 py-3">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>&copy; {currentYear} Indrayani Mahavidyalaya. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin"><span className="hover:text-accent transition-colors">Admin Portal</span></Link>
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
