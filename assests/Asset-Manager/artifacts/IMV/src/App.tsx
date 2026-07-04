import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import Faculty from "@/pages/faculty";
import Admissions from "@/pages/admissions";
import Placements from "@/pages/placements";
import Support from "@/pages/support";
import Naac from "@/pages/naac";
import News from "@/pages/news";
import Media from "@/pages/media";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LegacyRedirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [setLocation, to]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/index.php" component={() => <LegacyRedirect to="/" />} />
      <Route path="/about" component={About} />
      <Route path="/aboutus.php" component={() => <LegacyRedirect to="/about" />} />
      <Route path="/Presidentmessage.php" component={() => <LegacyRedirect to="/about" />} />
      <Route path="/Secretary.php" component={() => <LegacyRedirect to="/about" />} />
      <Route path="/VISIONMISSION.php" component={() => <LegacyRedirect to="/about" />} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/academics" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/ACADEMICPROGRAM.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/indryaniMarathiDepartment.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/indryanibbabca.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/indryaniEnglishdepartment.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/indryanihindidepartment.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/indryaniEconomydepartment.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/indryaniCommercedepartment.php" component={() => <LegacyRedirect to="/courses" />} />
      <Route path="/faculty" component={Faculty} />
      <Route path="/admissions" component={Admissions} />
      <Route path="/placements" component={Placements} />
      <Route path="/support" component={Support} />
      <Route path="/Library.php" component={() => <LegacyRedirect to="/support" />} />
      <Route path="/Library1.php" component={() => <LegacyRedirect to="/support" />} />
      <Route path="/DigitalLibrary.php" component={() => <LegacyRedirect to="/support" />} />
      <Route path="/Grievanceredresselcell.php" component={() => <LegacyRedirect to="/support" />} />
      <Route path="/GrievancesRedressalCommittee.php" component={() => <LegacyRedirect to="/support" />} />
      <Route path="/ict.php" component={() => <LegacyRedirect to="/support" />} />
      <Route path="/naac" component={Naac} />
      <Route path="/IndrayaniNAAC.php" component={() => <LegacyRedirect to="/naac" />} />
      <Route path="/indryaniaqar.php" component={() => <LegacyRedirect to="/naac" />} />
      <Route path="/Criterion.php" component={() => <LegacyRedirect to="/naac" />} />
      <Route path="/news" component={News} />
      <Route path="/media" component={Media} />
      <Route path="/Gallery1.php" component={() => <LegacyRedirect to="/media" />} />
      <Route path="/contact" component={Contact} />
      <Route path="/contactus.php" component={() => <LegacyRedirect to="/contact" />} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
