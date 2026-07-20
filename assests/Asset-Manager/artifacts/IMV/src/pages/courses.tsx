import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Briefcase, BrainCircuit, Users, ArrowRight } from "lucide-react";

const ACADEMIC_PROGRAMS = [
  {
    id: "bca",
    program: "B.C.A.",
    name: "Bachelor of Computer Applications",
    intake: "120",
    coursecode: "1617310170U",
    tfwscode: "1617310171UT",
    icon: Laptop,
    description: "A three-year undergraduate course specializing in computer applications, logic building, software development, and modern web frameworks.",
    color: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600",
  },
  {
    id: "bba",
    program: "B.B.A.",
    name: "Bachelor of Business Administration",
    intake: "180",
    coursecode: "1617310170U",
    tfwscode: "1617310171UT",
    icon: Briefcase,
    description: "A three-year undergraduate management course focusing on business administration principles, corporate finance, marketing, and leadership skills.",
    color: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600",
  },
  {
    id: "mca",
    program: "M.C.A.",
    name: "Master of Computer Applications",
    intake: "60",
    coursecode: "1617324210",
    tfwscode: "1617324211T",
    icon: BrainCircuit,
    description: "A two-year postgraduate degree covering advanced computer science, cloud architectures, database engineering, and machine learning models.",
    color: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600",
  },
  {
    id: "mba",
    program: "M.B.A.",
    name: "Master of Business Administration",
    intake: "60",
    coursecode: "1617310110",
    tfwscode: "1617310111T",
    icon: Users,
    description: "A two-year postgraduate management course designed for developing corporate strategists, managers, and entrepreneurs with global vision.",
    color: "from-teal-500/10 to-emerald-500/10",
    iconColor: "text-teal-600",
  },
];

export default function Courses() {
  const [, setLocation] = useLocation();

  const handleRowClick = (id: string) => {
    setLocation(`/courses/${id}`);
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Explore our comprehensive range of undergraduate and postgraduate programs designed to foster technical competence, business leadership, and career readiness.
          </p>
        </div>
      </section>

      {/* Programs Table Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                Academic Programs Offered by Indrayani Mahavidyalaya
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                DTE Code: 16173 - Total intake: 420 seats across 4 programs
              </p>
            </div>
            <Link href="/admissions">
              <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold flex items-center gap-2 group px-6 py-5 rounded-lg shadow-md transition-all duration-300">
                Apply Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-border/80 shadow-md bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f59e0b] text-white">
                  <th className="p-4 font-bold text-sm md:text-base tracking-wide border-r border-white/20">Program</th>
                  <th className="p-4 font-bold text-sm md:text-base tracking-wide border-r border-white/20">Name of Course</th>
                  <th className="p-4 font-bold text-sm md:text-base tracking-wide text-center border-r border-white/20">Intake</th>
                  <th className="p-4 font-bold text-sm md:text-base tracking-wide">Course Code</th>
                  <th className="p-4 font-bold text-sm md:text-base tracking-wide">TFWS Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-white">
                {ACADEMIC_PROGRAMS.map((prog) => (
                  <tr
                    key={prog.id}
                    onClick={() => handleRowClick(prog.id)}
                    className="hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer group"
                  >
                    <td className="p-4 text-sm md:text-base text-foreground font-medium border-r border-border/40">
                      {prog.program}
                    </td>
                    <td className="p-4 text-sm md:text-base text-primary font-semibold group-hover:text-[#f59e0b] transition-colors border-r border-border/40">
                      {prog.name}
                    </td>
                    <td className="p-4 text-sm md:text-base text-foreground font-bold text-center border-r border-border/40">
                      {prog.intake}
                    </td>
                    <td className="p-4 text-sm md:text-base text-muted-foreground font-mono tracking-tight">
                      {prog.coursecode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Explore Each Department Section */}
      <section className="py-16 bg-muted/20 border-t border-border/60">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary tracking-tight mb-3">
            Explore Each Department
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Select a department to view faculty, academics, syllabus, and more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto text-left">
            {ACADEMIC_PROGRAMS.map((prog) => {
              const Icon = prog.icon;
              return (
                <Card
                  key={prog.id}
                  onClick={() => handleRowClick(prog.id)}
                  className="hover:shadow-lg border-border/80 transition-all duration-300 cursor-pointer flex flex-col h-full group hover:border-[#f59e0b]/50"
                >
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${prog.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-[#f59e0b] transition-colors leading-snug">
                        {prog.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {prog.description}
                      </p>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-[#f59e0b] group-hover:underline mt-auto">
                      Explore Department <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
