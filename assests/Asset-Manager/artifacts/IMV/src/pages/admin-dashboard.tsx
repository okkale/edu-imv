import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAdminMe, useGetDashboardStats } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Megaphone, Briefcase, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { CoursesManager } from "@/components/admin/CoursesManager";
import { FacultyManager } from "@/components/admin/FacultyManager";
import { NewsManager } from "@/components/admin/NewsManager";
import { PlacementsManager } from "@/components/admin/PlacementsManager";
import { LeadsManager } from "@/components/admin/LeadsManager";
import { MediaManager } from "@/components/admin/MediaManager";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading: adminLoading, isError } = useGetAdminMe();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  
  const [activeTab, setActiveTab] = useState(() => {
    return new URLSearchParams(window.location.search).get("tab") || "overview";
  });

  useEffect(() => {
    if (isError || (!adminLoading && !admin)) {
      setLocation("/admin");
    }
  }, [isError, admin, adminLoading, setLocation]);

  useEffect(() => {
    const syncTabFromUrl = () => {
      const tab = new URLSearchParams(window.location.search).get("tab") || "overview";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", syncTabFromUrl);
    syncTabFromUrl();

    return () => {
      window.removeEventListener("popstate", syncTabFromUrl);
    };
  }, []);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const newUrl = val === "overview" ? "/admin/dashboard" : `/admin/dashboard?tab=${val}`;
    window.history.pushState({}, "", newUrl);
  };

  if (adminLoading) {
    return <div className="flex h-screen items-center justify-center bg-muted/30">Loading...</div>;
  }

  if (!admin) return null;

  return (
    <AdminLayout>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
        <div className="hidden">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="m-0 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-primary">{stats?.totalCourses}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-primary">{stats?.totalFaculty}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leads</CardTitle>
                <FileText className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-destructive">{stats?.pendingLeads}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
                <Briefcase className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-accent">{stats?.totalPlacements}</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back, Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Select a section from the sidebar to manage content.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="m-0 bg-white p-6 rounded-lg border border-border shadow-sm">
          <CoursesManager />
        </TabsContent>
        <TabsContent value="faculty" className="m-0 bg-white p-6 rounded-lg border border-border shadow-sm">
          <FacultyManager />
        </TabsContent>
        <TabsContent value="news" className="m-0 bg-white p-6 rounded-lg border border-border shadow-sm">
          <NewsManager />
        </TabsContent>
        <TabsContent value="placements" className="m-0 bg-white p-6 rounded-lg border border-border shadow-sm">
          <PlacementsManager />
        </TabsContent>
        <TabsContent value="leads" className="m-0 bg-white p-6 rounded-lg border border-border shadow-sm">
          <LeadsManager />
        </TabsContent>
        <TabsContent value="media" className="m-0 bg-white p-6 rounded-lg border border-border shadow-sm">
          <MediaManager />
        </TabsContent>

      </Tabs>
    </AdminLayout>
  );
}
