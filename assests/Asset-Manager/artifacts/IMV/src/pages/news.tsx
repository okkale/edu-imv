import { AppLayout } from "@/components/layout/AppLayout";
import { useGetNews } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pin, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "announcement", "event", "achievement", "news"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const { data: newsItemsData, isLoading } = useGetNews(
    selectedCategory !== "All" ? { category: selectedCategory } : undefined
  );
  
  const newsItems = Array.isArray(newsItemsData) ? newsItemsData : [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "announcement": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "event": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "achievement": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <AppLayout>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Events</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Stay updated with the latest happenings, achievements, and upcoming events at Indrayani Mahavidyalaya.
          </p>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-border sticky top-[64px] md:top-[80px] z-40 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto pb-2 -mb-2">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`capitalize ${selectedCategory === cat ? "bg-accent hover:bg-accent/90 text-white" : ""}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/20 min-h-[50vh]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <Skeleton className="h-48 sm:h-auto sm:w-1/3" />
                    <CardContent className="p-6 sm:w-2/3">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-6 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-6" />
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {newsItems.map((item) => (
                <Card key={item.id} className={`overflow-hidden border-border hover:shadow-md transition-shadow ${item.isPinned ? 'ring-1 ring-accent' : ''}`}>
                  <div className="flex flex-col sm:flex-row">
                    {item.imageUrl && (
                      <div className="sm:w-1/3 h-48 sm:h-auto shrink-0 bg-muted">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className={`p-6 ${item.imageUrl ? 'sm:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getCategoryColor(item.category)} hover:${getCategoryColor(item.category)} capitalize border-none`}>
                          {item.category}
                        </Badge>
                        {item.isPinned && (
                          <div className="flex items-center text-accent text-sm font-medium">
                            <Pin className="h-4 w-4 mr-1 fill-accent" /> Pinned
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-primary mb-3 hover:text-accent transition-colors cursor-pointer">
                        {item.title}
                      </h2>
                      
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-border pt-4">
                        <div className="flex items-center text-sm font-medium text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(item.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-2">No news items found</h3>
              <p className="text-muted-foreground">Check back later for updates or try a different category.</p>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
