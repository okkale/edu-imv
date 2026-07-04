import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const DEPARTMENTS = [
  { name: "BCA", id: "bca" },
  { name: "BBA", id: "bba" },
  { name: "MCA", id: "mca" },
  { name: "MBA", id: "mba" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAdmissionDropdown, setShowAdmissionDropdown] = useState(false);
  const [showMobileAdmission, setShowMobileAdmission] = useState(false);

  // Refs to hold delayed-close timers so hover feels smooth
  const megaMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const admissionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMegaMenu = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
    setShowMegaMenu(true);
  };
  const closeMegaMenu = () => {
    megaMenuTimer.current = setTimeout(() => setShowMegaMenu(false), 280);
  };
  const openAdmission = () => {
    if (admissionTimer.current) clearTimeout(admissionTimer.current);
    setShowAdmissionDropdown(true);
  };
  const closeAdmission = () => {
    admissionTimer.current = setTimeout(() => setShowAdmissionDropdown(false), 280);
  };

  const navLinksBefore = [{ href: "/about", label: "About Us" }];

  const navLinksAfter = [
    { href: "/placements", label: "Placements" },
    { href: "/naac", label: "NAAC" },
    { href: "/support", label: "Support" },
    { href: "/news", label: "News & Events" },
    { href: "/media", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="w-full border-b border-border bg-background shadow-sm">
      <div className="bg-primary text-primary-foreground py-1 md:py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-4">
            <a href="mailto:admission@indrayanicollege.com" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Mail className="h-3 w-3" /> <span className="hidden md:inline">admission@indrayanicollege.com</span>
            </a>
            <a href="tel:+918983683005" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="h-3 w-3" /> <span className="hidden md:inline">+91 89836 83005</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>SPPU Affiliated</span>
            <span className="hidden md:inline font-semibold text-accent">AICTE Approved | DTE Code: 16173</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <img
            src="/ymkcoe_logo.png"
            alt="Indrayani Mahavidyalaya Logo"
            className="h-10 w-auto md:h-12 lg:h-14 xl:h-16 object-contain"
          />
          <div className="flex flex-col justify-center items-start text-left select-none whitespace-nowrap">
            <span className="text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] text-muted-foreground font-medium leading-none whitespace-nowrap">
              Indrayani Vidya Mandir's
            </span>
            <span className="font-bold text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-primary uppercase tracking-wide leading-tight mt-0.5 md:mt-1 whitespace-nowrap">
              Indrayani Mahavidyalaya
            </span>
            <span className="font-bold text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-primary uppercase tracking-wide leading-tight whitespace-nowrap">
              Talegaon Dabhade, Pune
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 select-none">
          <Link href="/">
            <span className={`flex items-center justify-center px-1 lg:px-1.5 xl:px-2.5 py-2 rounded-md text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${location === "/" ? "text-accent font-semibold" : "text-foreground"}`}>Home</span>
          </Link>

          {/* Courses Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={openMegaMenu}
            onMouseLeave={closeMegaMenu}
          >
            <Link href="/academics">
              <span className={`flex items-center justify-center gap-0.5 lg:gap-1 px-1 lg:px-1.5 xl:px-2.5 py-2 rounded-md text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${location.startsWith("/academics") || location.startsWith("/courses") ? "text-accent font-semibold" : "text-foreground"}`}>
                Courses <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </span>
            </Link>

            {showMegaMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] bg-background border border-border rounded-lg shadow-lg p-4 mt-1 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="col-span-2 mb-2 pb-2 border-b border-border">
                  <h3 className="font-semibold text-primary">Academic Departments</h3>
                </div>
                {DEPARTMENTS.map((dept) => (
                  <Link key={dept.id} href={`/courses/${dept.id}`}>
                    <span className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors">
                      {dept.name}
                    </span>
                  </Link>
                ))}
                <div className="col-span-2 mt-2 pt-2 border-t border-border">
                  <Link href="/courses">
                    <span className="block px-3 py-2 rounded-md text-sm font-medium text-accent hover:underline text-center">
                      View Academic Programs &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {navLinksBefore.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`flex items-center justify-center px-1 lg:px-1.5 xl:px-2.5 py-2 rounded-md text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${location.startsWith(link.href) ? "text-accent font-semibold" : "text-foreground"}`}>
                {link.label}
              </span>
            </Link>
          ))}

          {/* Admission Dropdown */}
          <div
            className="relative"
            onMouseEnter={openAdmission}
            onMouseLeave={closeAdmission}
          >
            <Link href="/admissions">
              <span className={`flex items-center justify-center gap-0.5 lg:gap-1 px-1 lg:px-1.5 xl:px-2.5 py-2 rounded-md text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${location.startsWith("/admissions") ? "text-accent font-semibold" : "text-foreground"}`}>
                Admission <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </span>
            </Link>

            {showAdmissionDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[240px] bg-background border border-border rounded-lg shadow-lg p-2 mt-1 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                <Link href="/admissions?tab=eligibility">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    Eligibility Criteria
                  </span>
                </Link>
                <Link href="/admissions?tab=documents">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    Documents Required
                  </span>
                </Link>
                <Link href="/admissions?tab=process">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    Admission Process
                  </span>
                </Link>
                <Link href="/admissions?tab=institute-level">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    Admission at Institute Level
                  </span>
                </Link>
                <Link href="/admissions?tab=tfw-code">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    TFW Code
                  </span>
                </Link>
                <Link href="/admissions?tab=fee-structure">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    Fee Structure
                  </span>
                </Link>
                <Link href="/admissions?tab=fra">
                  <span
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted hover:text-accent transition-colors cursor-pointer text-foreground"
                    onClick={() => setShowAdmissionDropdown(false)}
                  >
                    FRA
                  </span>
                </Link>
              </div>
            )}
          </div>

          {navLinksAfter.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`flex items-center justify-center px-1 lg:px-1.5 xl:px-2.5 py-2 rounded-md text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm font-medium transition-colors hover:bg-muted whitespace-nowrap ${location.startsWith(link.href) ? "text-accent font-semibold" : "text-foreground"}`}>
                {link.label}
              </span>
            </Link>
          ))}

          <div className="ml-1 pl-2 border-l border-border flex items-center">
            <Link href="/admissions">
              <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 px-2 lg:px-2.5 xl:px-4 text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm h-7 lg:h-8 xl:h-10 font-semibold shadow-sm whitespace-nowrap">Apply Now</Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
          <nav className="w-full px-4 py-4 flex flex-col space-y-2">
            <Link href="/">
              <span className="block px-4 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>Home</span>
            </Link>
            <Link href="/courses">
              <span className="block px-4 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>Courses</span>
            </Link>
            {navLinksBefore.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="block px-4 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>{link.label}</span>
              </Link>
            ))}
            <Link href="/naac">
              <span className="block px-4 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>NAAC</span>
            </Link>
            <Link href="/support">
              <span className="block px-4 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>Support</span>
            </Link>

            {/* Mobile Admission Accordion */}
            <div>
              <button
                onClick={() => setShowMobileAdmission(!showMobileAdmission)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-md text-base font-medium hover:bg-muted text-left"
              >
                Admission <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showMobileAdmission ? 'rotate-180' : ''}`} />
              </button>
              {showMobileAdmission && (
                <div className="pl-6 flex flex-col gap-1 mt-1 border-l border-border ml-4">
                  <Link href="/admissions?tab=eligibility">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>Eligibility Criteria</span>
                  </Link>
                  <Link href="/admissions?tab=documents">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>Documents Required</span>
                  </Link>
                  <Link href="/admissions?tab=process">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>Admission Process</span>
                  </Link>
                  <Link href="/admissions?tab=institute-level">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>Admission at Institute Level</span>
                  </Link>
                  <Link href="/admissions?tab=tfw-code">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>TFW Code</span>
                  </Link>
                  <Link href="/admissions?tab=fee-structure">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>Fee Structure</span>
                  </Link>
                  <Link href="/admissions?tab=fra">
                    <span className="block px-4 py-2 rounded-md text-sm hover:bg-muted text-foreground" onClick={() => setIsOpen(false)}>FRA</span>
                  </Link>
                </div>
              )}
            </div>

            {navLinksAfter.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="block px-4 py-2 rounded-md text-base font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>{link.label}</span>
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-border">
              <Link href="/admissions">
                <Button variant="default" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsOpen(false)}>Apply Now</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
