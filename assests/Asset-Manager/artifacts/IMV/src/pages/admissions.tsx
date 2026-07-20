import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdmissionFlowchart } from "@/components/AdmissionFlowchart";
import { useCreateAdmissionLead } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  CheckCircle, 
  HelpCircle, 
  Building2, 
  ClipboardList, 
  FileText, 
  IndianRupee, 
  Phone, 
  Mail,
  ExternalLink
} from "lucide-react";

const DEPARTMENTS = [
  "BCA",
  "BBA",
  "MCA",
  "MBA",
];

const admissionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  courseInterest: z.string().min(1, "Please select a course"),
  qualification: z.string().optional(),
  message: z.string().optional(),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

export default function Admissions() {
  const { toast } = useToast();
  const createLead = useCreateAdmissionLead();
  const [location] = useLocation();

  const tabSequence = ["eligibility", "process", "institute", "documents", "fees"];
  const [activeTab, setActiveTab] = useState("eligibility");
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState(window.location.search);

  // Listen to wouter / history changes including query parameters
  useEffect(() => {
    const handleLocationChange = () => {
      setSearch(window.location.search);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate", handleLocationChange);
    window.addEventListener("replacestate", handleLocationChange);

    // Override pushState and replaceState to trigger the custom events
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      window.dispatchEvent(new Event("pushstate"));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      window.dispatchEvent(new Event("replacestate"));
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
      window.removeEventListener("replacestate", handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Parse URL query parameter on load or location change
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setIsAutoCycling(false); // Stop cycling if user explicitly chose a tab via URL / dropdown
      setProgress(0);
      if (tabParam === "eligibility") setActiveTab("eligibility");
      else if (tabParam === "process") setActiveTab("process");
      else if (tabParam === "documents") setActiveTab("documents");
      else if (tabParam === "institute-level" || tabParam === "institute") setActiveTab("institute");
      else if (tabParam === "fee-structure" || tabParam === "fra" || tabParam === "tfw-code" || tabParam === "fees") setActiveTab("fees");
    }
  }, [search]);

  // Handle cycle interval and progress update
  useEffect(() => {
    if (!isAutoCycling || isHovered) return;

    const intervalTime = 40; // 40ms updates
    const duration = 4000; // 4 seconds total
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => {
            const currentIndex = tabSequence.indexOf(current);
            const nextIndex = (currentIndex + 1) % tabSequence.length;
            const nextTab = tabSequence[nextIndex];
            
            // Update URL query param to match (replace state to avoid cluttering history)
            const newUrl = `${window.location.pathname}?tab=${nextTab}`;
            window.history.replaceState(null, "", newUrl);
            
            return nextTab;
          });
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoCycling, isHovered]);

  // Handle scrolling to targeted dropdown section within the active tab
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTimeout(() => {
        const element = document.getElementById(tabParam);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          
          // Temporary highlight styling to guide user eye
          element.classList.add("ring-2", "ring-accent", "ring-offset-2");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-accent", "ring-offset-2");
          }, 2000);
        }
      }, 400); // Allow DOM rendering & transition animation to complete
    }
  }, [activeTab, search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsAutoCycling(false); // Permanently disable auto-cycle on manual click
    setProgress(0);
    const newUrl = `${window.location.pathname}?tab=${value}`;
    window.history.pushState(null, "", newUrl);
  };

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseInterest: "",
      qualification: "",
      message: "",
    },
  });

  const onSubmit = (data: AdmissionFormValues) => {
    createLead.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Application Submitted",
          description: "Our admissions team will contact you shortly.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem submitting your application. Please try again.",
        });
      }
    });
  };

  return (
    <AppLayout>
      <section className="bg-primary text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/30 via-primary/50 to-primary pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Admissions</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Admissions to the Management program are governed by the rules of the Government of Maharashtra, Directorate of Technical Education (DTE), and affiliated to Savitribai Phule Pune University, Pune (SPPU).
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Info Side */}
          <div className="lg:col-span-7 space-y-8">
            <div 
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
            >
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-muted/50 p-1.5 mb-8 rounded-xl border border-border">
                  <TabsTrigger value="eligibility" className="relative overflow-hidden py-2.5 px-3 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all cursor-pointer">
                    <span className="relative z-10">Eligibility</span>
                    {activeTab === "eligibility" && isAutoCycling && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="process" className="relative overflow-hidden py-2.5 px-3 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all cursor-pointer">
                    <span className="relative z-10">Process</span>
                    {activeTab === "process" && isAutoCycling && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="institute" className="relative overflow-hidden py-2.5 px-3 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all cursor-pointer">
                    <span className="relative z-10">Institute Level</span>
                    {activeTab === "institute" && isAutoCycling && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="relative overflow-hidden py-2.5 px-3 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all cursor-pointer">
                    <span className="relative z-10">Documents</span>
                    {activeTab === "documents" && isAutoCycling && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="fees" className="relative overflow-hidden py-2.5 px-3 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm transition-all col-span-2 md:col-span-1 cursor-pointer">
                    <span className="relative z-10">Fees & Scholarships</span>
                    {activeTab === "fees" && isAutoCycling && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* ── Eligibility Criteria Content ── */}
                <TabsContent value="eligibility" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div id="eligibility" className="space-y-4 scroll-mt-6">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-6 w-6 text-accent" />
                      <h2 className="text-2xl font-bold text-primary">Eligibility Criteria</h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Admissions to the Management program are governed by the rules of the Government of Maharashtra, Directorate of Technical Education (DTE), and affiliated to Savitribai Phule Pune University, Pune (SPPU).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b border-border">A. For Maharashtra State Candidates:</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>Candidate must be an Indian National.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>Must have passed the qualifying examination from a recognized board or university as prescribed for the respective course.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>Secured at least 45% marks (40% for reserved category) in the above subjects taken together.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>Must have appeared for MAH-CET conducted by the State Common Entrance Test Cell, Maharashtra.</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b border-border">B. For All India Candidates:</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>Must have passed the qualifying examination from a recognized board or university as prescribed for the respective course.</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>Admission shall be granted as per the eligibility criteria, rules, and regulations prescribed by the University, State CET Cell, and Government of Maharashtra.</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ── Admission Process Content ── */}
                <TabsContent value="process" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div id="process" className="space-y-4 scroll-mt-6">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="h-6 w-6 text-accent" />
                      <h2 className="text-2xl font-bold text-primary">Admission Process</h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Admissions are conducted through the Centralized Admission Process (CAP) by the Directorate of Technical Education, Maharashtra.
                    </p>
                  </div>

                  <AdmissionFlowchart />
                </TabsContent>

                {/* ── Admission at Institute Level Content ── */}
                <TabsContent value="institute" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div id="institute" className="space-y-4 scroll-mt-6">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-accent" />
                      <h2 className="text-2xl font-bold text-primary">Admission at Institute Level</h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A limited number of seats are available under the Institute Level / Management Quota, filled by the institute as per DTE norms.
                    </p>
                  </div>

                  <Card id="institute-level" className="border-border shadow-sm scroll-mt-6">
                    <CardContent className="p-6">
                      <ul className="space-y-4 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span className="leading-relaxed">Candidates must register separately at Indrayani Mahavidyalaya.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span className="leading-relaxed">Submit all necessary documents and appear for Personal interaction.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span className="leading-relaxed">Eligibility and fee criteria remain as per government regulation.</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── Required Documents Content ── */}
                <TabsContent value="documents" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div id="documents" className="space-y-4 scroll-mt-6">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-accent" />
                      <h2 className="text-2xl font-bold text-primary">Required Documents</h2>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold italic">
                      (Original and 2 sets of photocopies required)
                    </p>
                  </div>

                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        {[
                          "SSC Mark Sheet & Certificate",
                          "HSC Mark Sheet & Certificate",
                          "MAH-CET Score Card",
                          "School/College Leaving Certificate",
                          "Domicile Certificate (for Maharashtra candidates)",
                          "Caste Certificate, Caste Validity, and Non-Creamy Layer (if applicable)",
                          "Nationality Certificate / Passport / Birth Certificate",
                          "GAP Certificate (if applicable)",
                          "Migration Certificate (for other board/university)",
                          "Recent Passport-size Photographs",
                          "Bachlor's Degree Mark Sheets & Certificates (for PG courses)",
                        ].map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── Fees & Scholarships Content ── */}
                <TabsContent value="fees" className="space-y-6 animate-in fade-in-50 duration-300">
                  <div id="fees" className="space-y-4 scroll-mt-6">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-6 w-6 text-accent" />
                      <h2 className="text-2xl font-bold text-primary">Fees & Scholarships</h2>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Tuition and development fees are set in strict accordance with the Fee Regulating Authority (FRA) guidelines.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Fee Structure */}
                    <Card id="fee-structure" className="border-border shadow-sm scroll-mt-6 transition-all duration-300">
                      <CardContent className="p-6 space-y-2">
                        <h3 className="text-base font-bold text-primary">Fee Structure</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Tuition and development fees are as per Fee Regulating Authority (FRA) guidelines.
                        </p>
                      </CardContent>
                    </Card>

                    {/* FRA */}
                    <Card id="fra" className="border-border shadow-sm scroll-mt-6 transition-all duration-300">
                      <CardContent className="p-6 space-y-2">
                        <h3 className="text-base font-bold text-primary">Fee Regulating Authority (FRA)</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          All fee structures are approved by the Fee Regulating Authority (FRA), Government of Maharashtra. Detailed fee distributions can be verified on the official FRA portal.
                        </p>
                      </CardContent>
                    </Card>

                    {/* TFWS & Scholarships */}
                    <Card id="tfw-code" className="border-border shadow-sm scroll-mt-6 transition-all duration-300">
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-primary">TFWS Choice Codes & Scholarships</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            For the **Tuition Fee Waiver Scheme (TFWS)**, candidates must select the specific TFWS Choice Codes ending with 'T' (e.g., Choice Code for MBA is generally formatted under DTE Code 16173) during the CAP Option Form Filling rounds.
                          </p>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-border">
                          <h4 className="text-sm font-semibold text-primary">Available Scholarships:</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground pl-1">
                            {[
                              "Social Welfare Department",
                              "Tribal Development Department",
                              "Minority Development Department",
                              "EBC (Economically Backward Class)",
                              "TFWS (Tuition Fee Waiver Scheme)",
                            ].map((sch, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                                <span>{sch}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Help box */}
            <div className="bg-muted/50 border border-border p-6 rounded-xl space-y-4">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-primary">Need help with your application?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our admission desk is open Monday to Saturday, 9:00 AM to 5:00 PM.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <span className="font-semibold text-primary">+91 94223 50872 / +91 94223 50872</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <a href="mailto:admission@indrayanicollege.com" className="font-semibold text-primary hover:text-accent transition-colors">
                    admission@indrayanicollege.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-5">
            <Card className="border-t-4 border-t-accent shadow-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-primary">Apply Now</CardTitle>
                <p className="text-sm text-muted-foreground">Submit your details to start the admission process.</p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
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
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 94223 50872" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="courseInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interested Program *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEPARTMENTS.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 12th Science / Diploma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Any questions?</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Type your query here..." className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90 text-white h-12 text-lg mt-4 cursor-pointer"
                      disabled={createLead.isPending}
                    >
                      {createLead.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </AppLayout>
  );
}
