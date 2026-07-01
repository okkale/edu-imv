import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden">
      {/* Sticky Navbar */}
      <div className="flex-none z-50">
        <Navbar />
      </div>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
