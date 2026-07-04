import { AppLayout } from "@/components/layout/AppLayout";
import { useGetPlacementStats, useGetPlacements } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, TrendingUp, Award, Building2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface TopRecruiter {
  company: string;
  count: number;
}

interface YearTrend {
  year: string;
  count: number;
}

interface PlacementStats {
  totalPlaced?: number;
  averagePackage?: string;
  highestPackage?: string;
  byYear?: YearTrend[];
  topCompanies?: TopRecruiter[];
}

export default function Placements() {
  const { data: statsData, isLoading: statsLoading } = useGetPlacementStats();
  const { data: placementsData, isLoading: placementsLoading } = useGetPlacements();
  
  const stats = (statsData || {}) as PlacementStats;
  const placements = Array.isArray(placementsData) ? placementsData : [];

  return (
    <AppLayout>
      {/* Header */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Training & Placement Cell</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Connecting our students with industry leaders. We ensure our graduates are equipped to launch successful careers.
          </p>
        </div>
      </section>

      {/* High Level Stats */}
      <section className="py-12 bg-background border-b border-border -mt-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-accent/20">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Placements</p>
                  <h3 className="text-4xl font-bold text-primary">
                    {statsLoading ? <Skeleton className="h-10 w-24" /> : `${stats?.totalPlaced || 0}+`}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Average Package</p>
                  <h3 className="text-4xl font-bold text-primary">
                    {statsLoading ? <Skeleton className="h-10 w-24" /> : stats?.averagePackage || "0"}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-secondary/20">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Highest Package</p>
                  <h3 className="text-4xl font-bold text-primary">
                    {statsLoading ? <Skeleton className="h-10 w-24" /> : stats?.highestPackage || "0"}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Charts & Graphs */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-accent" /> Placement Trends by Year
              </h2>
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  {statsLoading ? (
                    <Skeleton className="h-[400px] w-full" />
                  ) : stats?.byYear && stats.byYear.length > 0 ? (
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.byYear} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip 
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Students Placed" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground bg-muted/30 rounded-lg">
                      No trend data available.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-accent" /> Recent Successful Placements
              </h2>
              {placementsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
              ) : placements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {placements.map(placement => (
                    <Card key={placement.id} className="border-border shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-primary">{placement.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{placement.department} • {placement.year}</p>
                          </div>
                          <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                            {placement.package}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <span className="font-semibold text-secondary">{placement.company}</span>
                          <span className="text-sm text-muted-foreground">{placement.role}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-border border-dashed">
                  No recent placement records available.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Top Companies */}
          <div className="lg:col-span-4">
            <Card className="border-border shadow-md sticky top-28">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-secondary" /> Top Recruiters
                </h3>
                
                {statsLoading ? (
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : stats?.topCompanies && stats.topCompanies.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topCompanies.map((tc: TopRecruiter, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-white border border-border flex items-center justify-center font-bold text-xl text-primary/30">
                            {tc.company.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground">{tc.company}</span>
                        </div>
                        <span className="text-sm bg-secondary/10 text-secondary px-2 py-1 rounded font-medium">
                          {tc.count} hires
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No top recruiter data available.</p>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </AppLayout>
  );
}
