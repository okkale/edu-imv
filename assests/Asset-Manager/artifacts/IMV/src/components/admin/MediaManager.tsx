import { useState, useRef } from "react";
import { useGetMediaItems, getGetMediaItemsQueryKey, useDeleteMediaItem, useCreateMediaItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ImageIcon, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const mediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  thumbnailUrl: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

export function MediaManager() {
  const { data: mediaData, isLoading } = useGetMediaItems();
  const media = Array.isArray(mediaData) ? mediaData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteMedia = useDeleteMediaItem();
  const createMedia = useCreateMediaItem();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof mediaSchema>>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: "",
      type: "image",
      thumbnailUrl: "",
      category: "campus",
    }
  });

  const onSubmit = async (data: z.infer<typeof mediaSchema>) => {
    if (!selectedFile) {
      toast({ variant: "destructive", title: "Please select a file to upload" });
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File size exceeds 20MB limit" });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("File upload failed");
      }

      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.url;

      createMedia.mutate({ data: { ...data, url: fileUrl } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMediaItemsQueryKey() });
          toast({ title: "Media item added" });
          setOpen(false);
          form.reset();
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to add media item" });
        }
      });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to upload file" });
    } finally {
      setIsUploading(false);
    }
  };

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Upload Media</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Media Item</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="campus">Campus</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="students">Students</SelectItem>
                          <SelectItem value="facilities">Facilities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )} />
                </div>
                <div className="space-y-2">
                  <Label>Media File (Max 5MB)</Label>
                  <Input 
                    type="file" 
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>
                <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                  <FormItem><FormLabel>Thumbnail URL (Optional for Video)</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage/></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createMedia.isPending || isUploading}>
                  {createMedia.isPending || isUploading ? "Uploading..." : "Add Media"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-square rounded-lg bg-muted border border-border animate-pulse" />
          ))
        ) : media.length > 0 ? (
          media.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-slate-900 border border-border flex items-center justify-center p-1.5 min-h-[160px]">
              {item.type === 'video' && !item.thumbnailUrl ? (
                <div className="h-32 w-full flex items-center justify-center text-muted-foreground bg-secondary/10">
                  <PlayCircle className="h-10 w-10 opacity-50" />
                </div>
              ) : (
                <img 
                  src={item.thumbnailUrl || item.url} 
                  alt={item.title} 
                  className="w-full h-auto max-h-[180px] object-contain rounded-lg" 
                />
              )}
              
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 rounded-xl">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="text-[10px] uppercase bg-accent text-white border-none">{item.category}</Badge>
                  <Button variant="destructive" size="icon" className="h-7 w-7 rounded-full" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
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
