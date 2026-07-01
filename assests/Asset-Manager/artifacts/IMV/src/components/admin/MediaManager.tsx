import { useGetMediaItems, getGetMediaItemsQueryKey, useDeleteMediaItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ImageIcon, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function MediaManager() {
  const { data: mediaData, isLoading } = useGetMediaItems();
  const media = Array.isArray(mediaData) ? mediaData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteMedia = useDeleteMediaItem();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this media item?")) {
      deleteMedia.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMediaItemsQueryKey() });
          toast({ title: "Media item deleted" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to delete media item" });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Media Gallery</h3>
        <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Upload Media</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-square rounded-lg bg-muted border border-border animate-pulse" />
          ))
        ) : media.length > 0 ? (
          media.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
              {item.type === 'video' && !item.thumbnailUrl ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/10">
                  <PlayCircle className="h-10 w-10 opacity-50" />
                </div>
              ) : (
                <img 
                  src={item.thumbnailUrl || item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="text-[10px] uppercase">{item.category}</Badge>
                  <Button variant="destructive" size="icon" className="h-7 w-7 rounded-full" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-1 text-[10px] text-white/70 mb-1 uppercase tracking-wider font-semibold">
                    {item.type === 'video' ? <PlayCircle className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {item.type}
                  </div>
                  <h4 className="text-sm font-medium line-clamp-2 leading-tight">{item.title}</h4>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            No media items found in the gallery.
          </div>
        )}
      </div>
    </div>
  );
}
