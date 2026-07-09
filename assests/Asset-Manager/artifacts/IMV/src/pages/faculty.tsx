import { AppLayout } from "@/components/layout/AppLayout";
import { useGetFaculty } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Award, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  Lightbulb, 
  FileText, 
  Users, 
  Phone, 
  Info,
  ChevronRight,
  Search
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
  "All",
  "BCA",
  "BBA",
  "MCA",
  "MBA",
];

export default function Faculty() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: facultyMembersData, isLoading } = useGetFaculty();
  
  const facultyMembers = Array.isArray(facultyMembersData) ? facultyMembersData : [];
  
  // Filter by department mappings to support both new and old names
  const deptFilteredFaculty = facultyMembers.filter((f) => {
    if (selectedDept === "All") return true;
    if (selectedDept === "BCA" || selectedDept === "MCA") {
      return f.department === "Computer Applications" || f.department === "BCA" || f.department === "MCA";
    }
    if (selectedDept === "BBA" || selectedDept === "MBA") {
      return f.department === "Management Studies" || f.department === "BBA" || f.department === "MBA";
    }
    return f.department === selectedDept;
  });
  
  // Sort faculty: HODs first
  const sortedFaculty = deptFilteredFaculty.length > 0 ? [...deptFilteredFaculty].sort((a, b) => {
    if (a.isHOD && !b.isHOD) return -1;
    if (!a.isHOD && b.isHOD) return 1;
    return 0;
  }) : [];

  const filteredFaculty = sortedFaculty.filter((f) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      (f.skills && f.skills.toLowerCase().includes(q)) ||
      (f.qualification && f.qualification.toLowerCase().includes(q)) ||
      f.department.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Faculty</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Learn from distinguished professors, department coordinators, and dedicated educators committed to your success.
          </p>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-border sticky top-[64px] md:top-[80px] z-40 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="overflow-x-auto pb-2 md:pb-0 -mb-2 md:mb-0">
            <div className="flex gap-2 min-w-max">
              {DEPARTMENTS.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDept === dept ? "default" : "outline"}
                  onClick={() => setSelectedDept(dept)}
                  className={selectedDept === dept ? "bg-accent hover:bg-accent/90" : ""}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative max-w-xs w-full shrink-0">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, role or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9.5 w-full rounded-lg border border-border bg-muted/30 text-xs focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/20 min-h-[50vh]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 w-full bg-muted flex items-center justify-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredFaculty.length > 0 ? (
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredFaculty.map((faculty) => {
                  const displayName = faculty.title ? `${faculty.title} ${faculty.name}` : faculty.name;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      key={faculty.id}
                      className="h-full flex"
                    >
                      <Card 
                        className={`overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border bg-white flex flex-col justify-between w-full ${
                          faculty.isHOD ? 'ring-2 ring-accent ring-offset-2' : ''
                        }`}
                      >
                        <div>
                          <div className="bg-gradient-to-b from-primary/10 to-transparent pt-8 pb-4 flex flex-col items-center">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4 bg-muted shrink-0 transition-transform duration-500 hover:scale-105">
                              {faculty.photoUrl ? (
                                <img src={faculty.photoUrl} alt={faculty.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary text-white text-3xl font-bold">
                                  {faculty.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            {faculty.isHOD && (
                              <Badge className="bg-accent text-white mb-2">Head of Department</Badge>
                            )}
                            {faculty.adminRoles && !faculty.isHOD && (
                              <Badge variant="secondary" className="mb-2 max-w-[90%] truncate">
                                {faculty.adminRoles}
                              </Badge>
                            )}
                            <h3 className="text-md font-bold text-primary text-center px-4 line-clamp-1">
                              {displayName}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground text-center px-4 line-clamp-1">
                              {faculty.designation}
                            </p>
                            <p className="text-[11px] text-accent mt-1">{faculty.department}</p>
                          </div>
                          
                          <CardContent className="p-4 border-t border-border/50">
                            <div className="space-y-2 text-xs">
                              {faculty.qualification && (
                                <div className="flex items-start gap-2">
                                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                  <span className="text-foreground line-clamp-1">{faculty.qualification}</span>
                                </div>
                              )}
                              {faculty.experience && (
                                <div className="flex items-start gap-2">
                                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                  <span className="text-foreground line-clamp-1">{faculty.experience}</span>
                                </div>
                              )}
                              {faculty.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <a href={`mailto:${faculty.email}`} className="text-accent hover:underline truncate">
                                    {faculty.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </div>

                        <div className="p-4 pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs font-semibold group flex items-center justify-center gap-1 cursor-pointer"
                            onClick={() => setSelectedMember(faculty)}
                          >
                            View Profile <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <h3 className="text-xl font-semibold text-primary mb-2">No faculty records found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Premium Profile CV Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 border-border bg-white">
          {selectedMember && (
            <div>
              {/* Profile Hero Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 bg-white/10 shrink-0">
                  {selectedMember.photoUrl ? (
                    <img src={selectedMember.photoUrl} alt={selectedMember.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent text-white text-4xl font-bold">
                      {selectedMember.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left space-y-2">
                  {selectedMember.isHOD && (
                    <Badge className="bg-accent hover:bg-accent text-white">Head of Department</Badge>
                  )}
                  <h2 className="text-2xl md:text-3xl font-extrabold">
                    {selectedMember.title ? `${selectedMember.title} ` : ""}{selectedMember.name}
                  </h2>
                  <p className="text-primary-foreground/90 font-medium">{selectedMember.designation}</p>
                  <p className="text-sm text-accent-foreground font-semibold">{selectedMember.department}</p>
                </div>
              </div>

              {/* CV Body Content */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-white">
                {/* Left Side: Quick Stats & Contact */}
                <div className="md:col-span-1 space-y-6">
                  {/* Contact Block */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-3">
                    <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Contact Info</h4>
                    <div className="space-y-2.5 text-sm">
                      {selectedMember.email && (
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground font-semibold">Official Email</p>
                            <a href={`mailto:${selectedMember.email}`} className="text-xs text-accent hover:underline break-all">
                              {selectedMember.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedMember.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground font-semibold">Contact No.</p>
                            <span className="text-xs text-foreground font-medium">{selectedMember.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Administrative Roles */}
                  {selectedMember.adminRoles && (
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-2">
                      <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Admin Responsibilities</h4>
                      <p className="text-xs text-foreground font-medium bg-white p-2 rounded border border-border/50 shadow-sm leading-relaxed">
                        {selectedMember.adminRoles}
                      </p>
                    </div>
                  )}

                  {/* Research Guide Status */}
                  {selectedMember.researchGuide && (
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-2">
                      <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Research Guide Status</h4>
                      <p className="text-xs text-foreground font-medium bg-white p-2 rounded border border-border/50 shadow-sm leading-relaxed">
                        {selectedMember.researchGuide}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side: Professional CV sections */}
                <div className="md:col-span-2 space-y-6">
                  {/* Biography */}
                  {selectedMember.bio && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1">
                        <Info className="w-4 h-4 text-accent shrink-0" /> Biography / Profile Summary
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    </div>
                  )}

                  {/* Academic Background */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1">
                      <GraduationCap className="w-4 h-4 text-accent shrink-0" /> Academic & Experience Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {selectedMember.qualification && (
                        <div className="bg-muted/20 p-3 rounded-lg border border-border/40">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Qualification</p>
                          <p className="text-xs text-foreground font-semibold mt-0.5">{selectedMember.qualification}</p>
                        </div>
                      )}
                      {selectedMember.specialization && (
                        <div className="bg-muted/20 p-3 rounded-lg border border-border/40">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Area of Specialization</p>
                          <p className="text-xs text-foreground font-semibold mt-0.5">{selectedMember.specialization}</p>
                        </div>
                      )}
                      {selectedMember.experience && (
                        <div className="bg-muted/20 p-3 rounded-lg border border-border/40 sm:col-span-2">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Experience</p>
                          <p className="text-xs text-foreground font-semibold mt-0.5">{selectedMember.experience}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Core Skills */}
                  {selectedMember.skills && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1">
                        <Lightbulb className="w-4 h-4 text-accent shrink-0" /> Core Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedMember.skills.split(",").map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-accent/5 text-accent border-accent/20 text-xs px-2.5 py-0.5">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications */}
                  {selectedMember.publications && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1">
                        <FileText className="w-4 h-4 text-accent shrink-0" /> Publications & Research Work
                      </h4>
                      <div className="bg-muted/10 border border-border/40 rounded-lg p-3.5 mt-1">
                        <p className="text-xs text-foreground whitespace-pre-line leading-relaxed font-medium">
                          {selectedMember.publications}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Professional Memberships */}
                  {selectedMember.memberships && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1">
                        <Users className="w-4 h-4 text-accent shrink-0" /> Professional Memberships
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                        {selectedMember.memberships}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
