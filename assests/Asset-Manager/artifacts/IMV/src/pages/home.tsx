import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, GraduationCap, Users, Building, Trophy, Calendar, CheckCircle2, MessageSquare, Quote, Landmark, History } from "lucide-react";
import { useGetCourses, useGetNews, useGetDashboardStats } from "@workspace/api-client-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const getCourseSlug = (courseName: string) => {
  const nameLower = courseName.toLowerCase();
  if (nameLower.includes("bca")) return "bca";
  if (nameLower.includes("mca")) return "mca";
  if (nameLower.includes("bba")) return "bba";
  if (nameLower.includes("mba")) return "mba";
  return "";
};

const getCourseImage = (courseName: string, imageUrl?: string | null) => {
  if (imageUrl) return imageUrl;
  const slug = getCourseSlug(courseName);
  return slug ? `/${slug}.png` : "/ymkcoe_logo.png";
};

export default function Home() {
  const { data: courses = [] } = useGetCourses();
  const { data: news = [] } = useGetNews({ category: "announcement" });
  const { data: stats } = useGetDashboardStats();

  const [activeLeader, setActiveLeader] = useState<{
    name: string;
    role: string;
    organization: string;
    image?: string;
    initials?: string;
    message: string;
  } | null>(null);

  const featuredCourses = Array.isArray(courses) ? courses.slice(0, 4) : [];
  const recentNews = Array.isArray(news) ? news.slice(0, 3) : [];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center bg-primary overflow-hidden">
        {/* Left Side Building Image with Responsive Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[55%] h-full z-0 select-none">
          <img
            src="/hero-building.png"
            alt="Indrayani Mahavidyalaya Campus Building"
            className="w-full h-full object-cover object-bottom"
          />
          {/* Gradients to fade building into background: vertical fade for mobile, horizontal fade for desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/80 to-primary lg:hidden"></div>
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent via-primary/50 to-primary"></div>
        </div>

        {/* Abstract Background Elements (shifted to right side) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[60%] rounded-full bg-accent blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[10%] w-[40%] h-[50%] rounded-full bg-secondary blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Empty spacer for the left side image on desktop */}
          <div className="hidden lg:block lg:col-span-6"></div>

          {/* Swapped Text and CTA block on the right */}
          <div className="lg:col-span-6 text-white space-y-6 lg:pl-8 flex flex-col items-start lg:items-end text-left lg:text-right">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
              Admissions Open for 2026-27
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-300">Future </span> Business & Technology Leaders
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg leading-relaxed ml-0 lg:ml-auto">
              Indrayani Mahavidyalaya — an institution under Indrayani Vidya Mandir — prepares the next generation of innovators, leaders, and problem solvers since 1965.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-start lg:justify-end w-full sm:w-auto">
              <Link href="/admissions">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 h-14 text-base w-full sm:w-auto shadow-lg shadow-accent/20">
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base w-full sm:w-auto backdrop-blur-sm">
                  Explore Programs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-border relative z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            <div className="py-8 px-4 text-center">
              <div className="flex justify-center mb-3 text-accent"><GraduationCap className="h-8 w-8" /></div>
              <div className="text-3xl font-bold text-primary mb-1">1965</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Established</div>
            </div>
            <div className="py-8 px-4 text-center">
              <div className="flex justify-center mb-3 text-accent"><Users className="h-8 w-8" /></div>
              <div className="text-3xl font-bold text-primary mb-1">15 Acres</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Campus Area</div>
            </div>
            <div className="py-8 px-4 text-center">
              <div className="flex justify-center mb-3 text-accent"><Building className="h-8 w-8" /></div>
              <div className="text-3xl font-bold text-primary mb-1">360</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Seats</div>
            </div>
            <div className="py-8 px-4 text-center">
              <div className="flex justify-center mb-3 text-accent"><Trophy className="h-8 w-8" /></div>
              <div className="text-3xl font-bold text-primary mb-1">AICTE</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Approved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Society Section */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <Landmark className="h-3.5 w-3.5" />
              Founding Legacy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Indrayani Vidya Mandir (IVM)</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Serving the Maval region since 1965, Indrayani Vidya Mandir is a premier educational society built on values of social reform and academic empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Society legacy */}
            <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <History className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">About the Society &amp; Trust</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Established in 1965, Indrayani Vidya Mandir stands as a pioneer institute of educational excellence in the region. The society was founded through the guidance of eminent personalities, including the celebrated writer and social leader <strong>Acharya P. K. Atre</strong>, Dr. M. M. Altekar, and other visionaries who aimed to bring affordable, high-quality instruction to the local community.
                </p>
                <div className="border-t border-border/60 pt-6">
                  <h4 className="font-semibold text-primary mb-3">Blessed by Towering Leaders</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    IVM's journey has been nurtured by prominent figures such as Prof. Ramkrishna More, Balasaheb Kibe, Dadasaheb Dhore, Balasaheb Barmukh, and former VC Dr. G. S. Mahajani, along with Balasaheb Desai (former Finance Minister of Maharashtra).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Campus & Institutions */}
            <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-8 md:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Campus &amp; Institutions</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Set on a sprawling <strong>15-acre green campus</strong> with top-tier infrastructure, IVM has continuously expanded its offerings through a broad educational ecosystem, student support services, and a strong community-first approach.
                </p>
                <div className="border-t border-border/60 pt-6">
                  <h4 className="font-semibold text-primary mb-3">Modern Infrastructure &amp; Amenities</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The campus features outstanding resources, including a modern auditorium, cafeteria, gymnasium, healthcare assistance, comfortable girls' and boys' hostels, advanced labs, a digital library, and full Wi-Fi connectivity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Messages Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <MessageSquare className="h-3.5 w-3.5" />
              Leadership Desk
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Messages from our Leadership</h2>
            <p className="text-lg text-muted-foreground">
              Hear from the leaders guiding our vision and commitment to engineering innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* President Card */}
            <Card className="border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <img
                      src="/president.jpg"
                      alt="Hon. Shri Ramdas Kakade"
                      className="h-14 w-14 rounded-full object-cover shrink-0 shadow-sm border border-border bg-muted"
                    />
                    <div>
                      <h3 className="font-bold text-base text-primary leading-tight">Hon. Shri Ramdas Kakade</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">President</p>
                      <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Indrayani Vidya Mandir</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed relative italic">
                    <Quote className="absolute -top-3 -left-2 h-8 w-8 text-primary/5 -z-10" />
                    "Indrayani Vidya Mandir has a distinctive mission and history that has made it the leader in the field of education in Maval area. Today’s Education not only focuses on imparting knowledge and skills but also on the overall development of the students. The Indrayani Institute of Yashoda Mahadeo Kakade College..."
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setActiveLeader({
                    name: "Hon. Shri Ramdas Kakade",
                    role: "President",
                    organization: "Indrayani Vidya Mandir",
                    image: "/president.jpg",
                    message: `"Indrayani Vidya Mandir has a distinctive mission and history that has made it the leader in the field of education in Maval area. Today’s Education not only focuses on imparting knowledge and skills but also on the overall development of the students. The Indrayani Institute of Yashoda Mahadeo Kakade College of Engineering is geared up to provide you with the experienced faculty, facilities and infrastructure to prepare you for the tough challenges ahead. We are providing our students an opportunity for personal development and bringing about social reforms in this very vital sector. We believe that the students leaving this campus should leave with confidence in their abilities, a sense of responsibility towards society and be fully equipped to face the challenges of life with dignity."`
                  })}
                  className="text-accent hover:text-accent/80 font-bold p-0 self-start mt-2 h-auto"
                >
                  Read Full Message →
                </Button>
              </CardContent>
            </Card>

            {/* Secretary Card */}
            <Card className="border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <img
                      src="/secretary.jpg"
                      alt="Hon. Shri Chandrakant Shete"
                      className="h-14 w-14 rounded-full object-cover shrink-0 shadow-sm border border-border bg-muted"
                    />
                    <div>
                      <h3 className="font-bold text-base text-primary leading-tight">Hon. Shri Chandrakant Shete</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Secretary</p>
                      <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Indrayani Vidya Mandir</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed relative italic">
                    <Quote className="absolute -top-3 -left-2 h-8 w-8 text-primary/5 -z-10" />
                    "Learning is not a process that ends with the conclusion of one's college career. It is indeed a lifelong process. This college is oriented to the total formation of a ward and to adaptations of various methods suiting the dynamics of a changing world in order to achieve common goals and..."
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setActiveLeader({
                    name: "Hon. Shri Chandrakant Shete",
                    role: "Secretary",
                    organization: "Indrayani Vidya Mandir",
                    image: "/secretary.jpg",
                    message: `"Learning is not a process that ends with the conclusion of one's college career. It is indeed a lifelong process. This college is oriented to the total formation of a ward and to adaptations of various methods suiting the dynamics of a changing world in order to achieve common goals and objectives. Our commitment to such learning will always persist in all our endeavors. Our faculty continues to provide their expertise through the continuing education programmes. The departments have also established rich and formal relationships with the industry through courses and regular classroom interactions, inviting industry professionals, and conducting seminars and other soft skill programmes. I sincerely hope that our students will use the facilities provided to them on our campus, find their profession, and justify the trust placed in them by their family, Society, and Nation."`
                  })}
                  className="text-accent hover:text-accent/80 font-bold p-0 self-start mt-2 h-auto"
                >
                  Read Full Message →
                </Button>
              </CardContent>
            </Card>

            {/* Principal Card */}
            <Card className="border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <img
                      src="/principal.png"
                      alt="Dr. S. K. Malghe"
                      className="h-14 w-14 rounded-full object-cover shrink-0 shadow-sm border border-border bg-muted"
                    />

                    <div>
                      <h3 className="font-bold text-base text-primary leading-tight">Dr. S. K. Malghe</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Principal</p>
                      <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Indrayani Mahavidyalaya</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed relative italic">
                    <Quote className="absolute -top-3 -left-2 h-8 w-8 text-primary/5 -z-10" />
                    "Welcome to Indrayani Vidya Mandir. Our institution is committed to providing quality technical education that empowers students — especially those from economically weaker sections — to become confident professionals in today's competitive world..."
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setActiveLeader({
                    name: "Dr. S. K. Malghe",
                    role: "Principal",
                    organization: "Indrayani Mahavidyalaya",
                    image: "/principal.png",
                    message: `Message from the Principal’s Desk

It is my privilege to welcome all aspiring students to Indrayani Vidya Mandir.

We are committed to fostering an academic environment that promotes knowledge, practical competence, and professional integrity across all disciplines. Our approach to education extends beyond the classroom, focusing on developing skills, critical thinking, and a strong foundation for future success.

As you take an important step in your academic journey, I encourage you to make informed choices that align with your aspirations and long-term goals.

We look forward to supporting you in shaping a purposeful and successful future.

Admissions Open for the Academic Year 2026–27

Principal
Indrayani Vidya Mandir.`
                  })}
                  className="text-accent hover:text-accent/80 font-bold p-0 self-start mt-2 h-auto"
                >
                  Read Full Message →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose Indrayani Mahavidyalaya?</h2>
            <p className="text-lg text-muted-foreground">
              We don't just teach business and technology; we empower students to think critically, lead confidently, and succeed professionally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-6">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Industry-Aligned Curriculum</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our syllabus is regularly updated in consultation with industry experts to ensure our graduates are job-ready from day one.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">State-of-the-Art Labs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experience practical learning through modern computer laboratories, industry-oriented projects, workshops, and skill development programs designed for real-world success.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Exceptional Placement Record</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our dedicated placement cell works tirelessly to bring top-tier companies to campus, resulting in consistently high placement rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses & News */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Courses */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">Featured Programs</h2>
                <p className="text-muted-foreground">Discover our most sought-after engineering degrees.</p>
              </div>
              <Link href="/courses">
                <Button variant="ghost" className="hidden sm:flex group">
                  View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCourses.length > 0 ? featuredCourses.map((course) => {
                const slug = getCourseSlug(course.name);
                const imageSrc = getCourseImage(course.name, course.imageUrl);
                return (
                  <Link key={course.id} href={`/courses/${slug}`}>
                    <Card className="overflow-hidden group cursor-pointer border-border hover:border-primary/20 transition-all shadow-sm hover:shadow-md h-full">
                      <div className="h-48 bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <img
                          src={imageSrc}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">{course.department}</div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{course.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                          <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {course.duration}</span>
                          <span className="flex items-center"><Users className="h-4 w-4 mr-1" /> {course.seats} Seats</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  No courses available at the moment.
                </div>
              )}
            </div>

            <Link href="/courses" className="sm:hidden mt-6 block">
              <Button variant="outline" className="w-full">View All Programs</Button>
            </Link>
          </div>

          {/* News Sidebar */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">Announcements</h2>
            </div>

            <div className="space-y-4">
              {recentNews.length > 0 ? recentNews.map((item) => (
                <Card key={item.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex gap-4">
                    <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-primary/5 rounded-lg border border-primary/10">
                      <span className="text-xl font-bold text-primary leading-none">
                        {new Date(item.publishedAt).getDate()}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {new Date(item.publishedAt).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        <Link href={`/news`}>{item.title}</Link>
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  No recent announcements.
                </div>
              )}

              <Link href="/news" className="block pt-2">
                <Button variant="ghost" className="w-full justify-between group">
                  All News & Events <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Turn Inspirations into Achievements</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            Join thousands of successful alumni who started their careers at Indrayani Mahavidyalaya. Admissions for the upcoming academic year are now open.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 h-14 text-base shadow-lg w-full sm:w-auto">
                Apply for Admission
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base backdrop-blur-sm w-full sm:w-auto">
                Contact Admissions Office
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leadership Full Message Modal */}
      <Dialog open={!!activeLeader} onOpenChange={(open) => !open && setActiveLeader(null)}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-background border border-border rounded-lg shadow-2xl">
          <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
            {/* Left side: Content / Text */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  {activeLeader?.image ? (
                    <img
                      src={activeLeader.image}
                      alt={activeLeader.name}
                      className="h-16 w-16 rounded-full object-cover shrink-0 shadow-sm border border-border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center font-bold text-white text-xl shrink-0 shadow-sm">
                      {activeLeader?.initials}
                    </div>
                  )}
                  <div>
                    <DialogTitle className="font-bold text-xl text-primary leading-tight">
                      {activeLeader?.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{activeLeader?.role}</p>
                    <p className="text-xs text-accent font-semibold uppercase tracking-wider">{activeLeader?.organization}</p>
                  </div>
                </div>

                {/* Full Message on the Left */}
                <div className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line italic relative pl-6 pr-2">
                  <Quote className="absolute top-0 left-0 h-6 w-6 text-primary/10" />
                  {activeLeader?.message}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  onClick={() => setActiveLeader(null)}
                  variant="outline"
                  className="font-semibold"
                >
                  Close Message
                </Button>
              </div>
            </div>

            {/* Right side: Large Image */}
            <div className="hidden md:block w-[35%] bg-muted relative shrink-0 border-l border-border select-none">
              {activeLeader?.image ? (
                <img
                  src={activeLeader.image}
                  alt={activeLeader.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary to-primary-light flex flex-col items-center justify-center font-bold text-white text-6xl shadow-sm">
                  {activeLeader?.initials}
                  <span className="text-sm font-medium mt-4 tracking-wide uppercase opacity-75">{activeLeader?.role}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
