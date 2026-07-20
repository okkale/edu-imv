import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Eye, Award } from "lucide-react";

export default function About() {
  return (
    <AppLayout>
      {/* Header */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Indrayani Mahavidyalaya</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Nurturing excellence, fostering innovation, and building the leaders of tomorrow since 1965.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <Card className="border-border shadow-md">
            <CardContent className="p-8">
              <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                <Eye className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                "To provide higher &amp; quality education and enable the students from economically weaker sections to become professionals in today's competitive world."
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md">
            <CardContent className="p-8">
              <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-accent font-bold">&bull;</span>
                  To foster excellence in teaching, scholarship &amp; service to develop a cadre of students with positive attitude, leadership skills &amp; habit of lifelong learning.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">&bull;</span>
                  To create an academic environment where the highest standards of scholarship &amp; professional practice are observed and responsibilities to students are continuously met.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">&bull;</span>
                  To ensure achievement of overall education goals through effective, fair &amp; efficient administration of recruitment and career enhancement programs.
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">&bull;</span>
                  To use latest technology for the betterment of students and staff.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Accreditations & Achievements */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Accreditations & Recognition</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We hold ourselves to the highest standards of educational quality.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border text-center shadow-sm">
              <Award className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">AICTE Approved</h3>
              <p className="text-sm text-muted-foreground">Approved by the All India Council for Technical Education.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-border text-center shadow-sm">
              <Building2 className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">SPPU Affiliated</h3>
              <p className="text-sm text-muted-foreground">Affiliated to Savitribai Phule Pune University, Pune.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-border text-center shadow-sm">
              <Award className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Established 1965</h3>
              <p className="text-sm text-muted-foreground">Over 60 years of academic excellence under Indrayani Vidya Mandir.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-border text-center shadow-sm">
              <Building2 className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">15-Acre Campus</h3>
              <p className="text-sm text-muted-foreground">State-of-the-art infrastructure on a sprawling 15-acre campus at Talegaon Dabhade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg border border-border flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-muted h-64 md:h-auto relative">
              {/* Image placeholder */}
              <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center text-primary">
                <img
                  src="/directormanagement.png"
                  alt="Mrs. Vidya Bhegade"
                  className="h-100 w-80  object-cover shrink-0 shadow-sm border border-border bg-muted"
                />
              </div>
            </div>
            <div className="md:w-2/3 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-primary mb-2">Message from the Director</h2>
              <h3 className="text-accent font-semibold mb-6">Mrs. Vidya Bhegade (Pursuing Ph.D. in Management (AI in Education))</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "Welcome to Indrayani Mahavidyalaya. Our institution is committed to providing quality higher education that empowers students — especially those from economically weaker sections — to become confident professionals in today's competitive world. With dedicated faculty, student support services, and a values-driven campus culture, Indrayani Mahavidyalaya is the launchpad for your future."
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
