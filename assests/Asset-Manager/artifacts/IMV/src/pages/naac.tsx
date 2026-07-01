import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, ClipboardList, FilePieChart, ScrollText } from "lucide-react";

const QUALITY_AREAS = [
  {
    icon: BadgeCheck,
    title: "IQAC",
    description: "Institutional quality practices, internal reviews, and continuous improvement initiatives.",
  },
  {
    icon: ClipboardList,
    title: "Criterion-wise Documentation",
    description: "Supporting materials, policy references, and structured evidence for accreditation work.",
  },
  {
    icon: FilePieChart,
    title: "AQAR & Reports",
    description: "Annual quality reports, summaries, and compliance-oriented institutional documentation.",
  },
  {
    icon: ScrollText,
    title: "NAAC Support Pages",
    description: "Legacy NAAC content consolidated into a single, easier-to-navigate section.",
  },
];

export default function Naac() {
  return (
    <AppLayout>
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">NAAC & IQAC</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Accreditation, quality assurance, and legacy compliance material for institutional review.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUALITY_AREAS.map((area) => (
            <Card key={area.title} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <area.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-primary">{area.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
