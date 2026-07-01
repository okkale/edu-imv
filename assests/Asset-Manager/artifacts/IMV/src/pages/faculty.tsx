import { AppLayout } from "@/components/layout/AppLayout";
import { useGetFaculty } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Award, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DEPARTMENTS = [
  "All",
  "BCA",
  "BBA",
  "MCA",
  "MBA",
];

export default function Faculty() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  
  const { data: facultyMembersData, isLoading } = useGetFaculty(
    selectedDept !== "All" ? { department: selectedDept } : undefined
  );
  
  const facultyMembers = Array.isArray(facultyMembersData) ? facultyMembersData : [];

  // Sort faculty: HODs first
  const sortedFaculty = facultyMembers.length > 0 ? [...facultyMembers].sort((a, b) => {
    if (a.isHOD && !b.isHOD) return -1;
    if (!a.isHOD && b.isHOD) return 1;
    return 0;
  }) : [];

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
          ) : sortedFaculty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedFaculty.map((faculty) => (
                <Card key={faculty.id} className={`overflow-hidden hover:shadow-md transition-shadow border-border ${faculty.isHOD ? 'ring-2 ring-accent ring-offset-2' : ''}`}>
                  <div className="bg-gradient-to-b from-primary/10 to-transparent pt-8 pb-4 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4 bg-muted">
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
                    <h3 className="text-lg font-bold text-primary text-center px-4">{faculty.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{faculty.designation}</p>
                    <p className="text-xs text-accent mt-1">{faculty.department}</p>
                  </div>
                  
                  <CardContent className="p-5 border-t border-border/50 bg-white">
                    <div className="space-y-3 text-sm">
                      {faculty.qualification && (
                        <div className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-foreground">{faculty.qualification}</span>
                        </div>
                      )}
                      {faculty.specialization && (
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-foreground">{faculty.specialization}</span>
                        </div>
                      )}
                      {faculty.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <a href={`mailto:${faculty.email}`} className="text-accent hover:underline break-all">
                            {faculty.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <h3 className="text-xl font-semibold text-primary mb-2">No faculty records found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
