import { AppLayout } from "@/components/layout/AppLayout";
import { useGetCourses } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DEPARTMENTS = [
  "All",
  "BCA",
  "BBA",
  "MCA",
  "MBA",
];

export default function Courses() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  
  const { data: coursesData, isLoading } = useGetCourses(
    selectedDept !== "All" ? { department: selectedDept } : undefined
  );
  
  const courses = Array.isArray(coursesData) ? coursesData : [];

  return (
    <AppLayout>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Explore the undergraduate programs, departments, and academic pathways offered by Indrayani Mahavidyalaya.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background border-b border-border sticky top-[64px] md:top-[80px] z-40 shadow-sm">
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
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border-border">
                  <div className="h-48 bg-secondary/10 relative">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                        <BookOpen className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                      {course.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                      {course.department}
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{course.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {course.description || "No description provided."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg mt-auto">
                      <div className="flex items-center text-foreground">
                        <Clock className="h-4 w-4 mr-2 text-accent" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center text-foreground">
                        <Users className="h-4 w-4 mr-2 text-accent" />
                        <span>{course.seats} Seats</span>
                      </div>
                      <div className="col-span-2 text-xs text-muted-foreground pt-2 border-t border-border mt-2">
                        <span className="font-semibold text-foreground">Eligibility:</span> {course.eligibility || "Standard university norms"}
                      </div>
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
    </AppLayout>
  );
}
