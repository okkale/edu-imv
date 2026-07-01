import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ShieldAlert, Laptop, UsersRound, FileText } from "lucide-react";

const SUPPORT_AREAS = [
  {
    icon: BookOpen,
    title: "Library & Digital Resources",
    description: "Reading rooms, reference support, e-resources, and access to learning material for all departments.",
  },
  {
    icon: ShieldAlert,
    title: "Grievance Redressal",
    description: "Transparent complaint handling and student support channels for academic and campus concerns.",
  },
  {
    icon: Laptop,
    title: "ICT Enablement",
    description: "Technology support for classrooms, labs, campus systems, and digital learning activities.",
  },
  {
    icon: UsersRound,
    title: "Student Support",
    description: "Mentoring, career guidance, wellness support, and co-curricular coordination for students.",
  },
  {
    icon: FileText,
    title: "Committees & Policies",
    description: "Quick access to key institutional committees, circulars, and administrative information.",
  },
];

export default function Support() {
  return (
    <AppLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Support</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Library services, grievance handling, ICT support, and student-facing institutional resources.
          </p>
        </div>
      </section>

      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {SUPPORT_AREAS.map((area) => (
              <Card key={area.title} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <area.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-primary">{area.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
