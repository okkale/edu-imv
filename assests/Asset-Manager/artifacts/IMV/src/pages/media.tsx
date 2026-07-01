import { AppLayout } from "@/components/layout/AppLayout";
import { useGetMediaItems } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, ImageIcon } from "lucide-react";

const CATEGORIES = ["All", "campus", "events", "labs", "sports", "cultural"];

export default function Media() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const { data: mediaItemsData, isLoading } = useGetMediaItems(
    selectedCategory !== "All" ? { category: selectedCategory } : undefined
  );
  
  const mediaItems = Array.isArray(mediaItemsData) ? mediaItemsData : [];

  return (
    <AppLayout>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Experience life at Indrayani Mahavidyalaya through our collection of photos and videos.
          </p>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-border sticky top-[64px] md:top-[80px] z-40 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto pb-2 -mb-2">
          <div className="flex gap-2 min-w-max justify-center">
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

      <section className="py-12 bg-muted/20 min-h-[60vh]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : mediaItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border shadow-sm cursor-pointer">
                  {item.type === 'video' && !item.thumbnailUrl ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-primary/5">
                       <PlayCircle className="h-12 w-12 mb-2 opacity-50" />
                       <span className="text-sm font-medium px-4 text-center">{item.title}</span>
                    </div>
                  ) : (
                    <img 
                      src={item.thumbnailUrl || item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-accent mb-1">
                        {item.type === 'video' ? <PlayCircle className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                        <span className="text-xs font-semibold uppercase tracking-wider">{item.category}</span>
                      </div>
                      <h3 className="text-white font-semibold line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                  
                  {/* Play icon badge for videos */}
                  {item.type === 'video' && item.thumbnailUrl && (
                    <div className="absolute top-4 right-4 h-8 w-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <h3 className="text-xl font-semibold text-primary mb-2">No media found</h3>
              <p className="text-muted-foreground">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
