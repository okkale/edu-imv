import { AppLayout } from "@/components/layout/AppLayout";
// API client import removed since we are hardcoding the courses now
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DEPARTMENTS = [
  "All",
  "Management",
  "Computer Application",

];

const PHARMACY_COURSES = [
  { id: '1', name: 'BBA', department: 'Management', type: 'Undergraduate', duration: '3 Years', seats: 180, eligibility: '10+2 with Any Stream', description: 'A three-year undergraduate management course focusing on business administration, finance, and marketing.', imageUrl: '/bba.png' },
  { id: '2', name: 'BCA', department: 'Computer Application', type: 'Undergraduate', duration: '3 Years', seats: 120, eligibility: '10+2 with Any Stream', description: 'A three-year undergraduate IT course specializing in computer applications, programming, and software development.', imageUrl: '/bca.png' },
  { id: '3', name: 'MBA', department: 'Management', type: 'Postgraduate', duration: '2 Years', seats: 60, eligibility: 'Any Graduate', description: ' A two-year postgraduate management degree designed for advanced leadership, strategy, and specialized business roles.', imageUrl: '/mba.png' },
  { id: '4', name: 'MCA', department: 'Computer Application', type: 'Postgraduate', duration: '2 Years', seats: 60, eligibility: 'BCA', description: 'A two-year postgraduate IT degree covering advanced software engineering, data science, and system architecture.', imageUrl: '/mca.png' },
];

export default function Courses() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [activeCourse, setActiveCourse] = useState<any>(null);

  const isLoading = false;
  const courses = selectedDept === "All"
    ? PHARMACY_COURSES
    : PHARMACY_COURSES.filter(c => c.department === selectedDept);

  return (
    <AppLayout>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Explore our comprehensive range of undergraduate and postgraduate programs designed to build excellence.
          </p>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-border sticky top-[64px] md:top-[0px] z-40 shadow-xsm">
        <div className="container mx-auto px-4 overflow-x-auto pb-2 -mb-2">
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
      </section>

      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-6" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card 
                  key={course.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border-border cursor-pointer group"
                  onClick={() => setActiveCourse(course)}
                >
                  <div className="h-48 bg-secondary/10 relative overflow-hidden">
                    {(course as any).imageUrl ? (
                      <img 
                        src={(course as any).imageUrl} 
                        alt={course.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                        <BookOpen className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                        {course.department}
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{course.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description || "No description provided."}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm font-medium text-accent">
                      <span>View Course Details</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No courses found</h3>
              <p className="text-muted-foreground">We couldn't find any courses matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!activeCourse} onOpenChange={(open) => !open && setActiveCourse(null)}>
        {activeCourse && (
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border bg-background">
            <div className="h-64 relative bg-secondary/10">
              {activeCourse.imageUrl ? (
                <img 
                  src={activeCourse.imageUrl} 
                  alt={activeCourse.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                  <BookOpen className="h-16 w-16 opacity-20" />
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-accent text-white">
                {activeCourse.type}
              </Badge>
            </div>
            <div className="p-6">
              <DialogHeader className="mb-4">
                <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                  {activeCourse.department} Department
                </div>
                <DialogTitle className="text-3xl font-bold text-primary">
                  {activeCourse.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {activeCourse.description || "No description provided."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-4 text-sm bg-muted/50 p-5 rounded-xl border border-border/50 mb-6">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Duration</span>
                  <div className="flex items-center text-foreground font-medium">
                    <Clock className="h-4 w-4 mr-1.5 text-accent shrink-0" />
                    <span>{activeCourse.duration}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Intake Seats</span>
                  <div className="flex items-center text-foreground font-medium">
                    <Users className="h-4 w-4 mr-1.5 text-accent shrink-0" />
                    <span>{activeCourse.seats} Seats</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Course Type</span>
                  <div className="flex items-center text-foreground font-medium">
                    <BookOpen className="h-4 w-4 mr-1.5 text-accent shrink-0" />
                    <span>{activeCourse.type}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <h4 className="text-sm font-semibold text-primary mb-2">Eligibility Criteria</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeCourse.eligibility || "Standard university norms."}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setActiveCourse(null)}>
                  Close
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Apply Now
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </AppLayout>
  );
}
