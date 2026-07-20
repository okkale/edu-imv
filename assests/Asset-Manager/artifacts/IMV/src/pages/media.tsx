import { AppLayout } from "@/components/layout/AppLayout";
import { useGetMediaItems } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, ImageIcon, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const CATEGORIES = ["All", "campus", "events", "labs", "sports", "cultural"];

export default function Media() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMedia, setActiveMedia] = useState<any>(null);

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

      <section className="py-8 bg-background border-b border-border sticky top-[64px] md:top-[0px] z-40 shadow-sm">
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
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : mediaItems.length > 0 ? (
            /* Auto Masonry Grid - Preserves Portrait & Landscape Aspect Ratios */
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveMedia(item)}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {item.type === 'video' && !item.thumbnailUrl ? (
                    <div className="h-64 w-full flex flex-col items-center justify-center text-muted-foreground bg-primary/5 p-6">
                      <PlayCircle className="h-16 w-16 mb-3 opacity-60 text-primary" />
                      <span className="text-sm font-semibold text-center text-foreground">{item.title}</span>
                    </div>
                  ) : (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 rounded-xl">
                    <div className="flex justify-end">
                      <span className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider mb-1">
                        {item.type === 'video' ? <PlayCircle className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                        <span>{item.category}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug">{item.title}</h3>
                    </div>
                  </div>

                  {/* Video Badge */}
                  {item.type === 'video' && item.thumbnailUrl && (
                    <div className="absolute top-3 right-3 h-8 w-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
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

      {/* Full-Screen Lightbox Preview Dialog for Full Portrait & Landscape View */}
      <Dialog open={!!activeMedia} onOpenChange={(open) => !open && setActiveMedia(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-slate-950 text-white border border-slate-800 rounded-2xl shadow-2xl">
          <DialogTitle className="sr-only">{activeMedia?.title || "Media Preview"}</DialogTitle>
          <div className="relative flex flex-col items-center justify-center min-h-[50vh] max-h-[85vh] bg-black p-4">
            {activeMedia?.type === 'video' && !activeMedia?.thumbnailUrl ? (
              <div className="p-8 text-center space-y-4">
                <PlayCircle className="h-20 w-20 mx-auto text-accent opacity-80" />
                <h3 className="text-xl font-bold">{activeMedia?.title}</h3>
                <a
                  href={activeMedia?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-accent hover:bg-accent/90 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  Watch Video
                </a>
              </div>
            ) : (
              <img
                src={activeMedia?.url || activeMedia?.thumbnailUrl}
                alt={activeMedia?.title || "Full Preview"}
                className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-xl"
              />
            )}

            <div className="w-full bg-slate-900/90 border-t border-slate-800 p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">{activeMedia?.category}</span>
                <h3 className="text-base font-semibold text-white mt-0.5">{activeMedia?.title}</h3>
              </div>
              <Button
                onClick={() => setActiveMedia(null)}
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 font-medium shrink-0"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
