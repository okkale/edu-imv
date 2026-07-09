import { useState, useEffect } from "react";
import { useGetNews, getGetNewsQueryKey, useDeleteNewsItem, useCreateNewsItem, useUpdateNewsItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Pin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  isPinned: z.boolean().default(false),
  imageUrl: z.string().optional(),
  status: z.string().default("moderate"),
});

export function NewsManager() {
  const { data: newsData, isLoading } = useGetNews();
  const news = Array.isArray(newsData) ? newsData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteNews = useDeleteNewsItem();
  const createNews = useCreateNewsItem();
  const updateNews = useUpdateNewsItem();
  const [open, setOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

  const defaultValues = {
    title: "",
    category: "announcement",
    content: "",
    isPinned: false,
    imageUrl: "",
    status: "moderate",
  };

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues
  });

  useEffect(() => {
    if (!open) {
      setEditingNews(null);
      form.reset(defaultValues);
    }
  }, [open, form]);

  const handleEdit = (item: any) => {
    setEditingNews(item);
    form.reset({
      title: item.title,
      category: item.category,
      content: item.content,
      isPinned: item.isPinned || false,
      imageUrl: item.imageUrl || "",
      status: item.status || "moderate",
    });
    setOpen(true);
  };

  const onSubmit = (data: z.infer<typeof newsSchema>) => {
    if (editingNews) {
      updateNews.mutate({ id: editingNews.id, data: { ...data, publishedAt: editingNews.publishedAt } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNewsQueryKey() });
          toast({ title: "News item updated" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update news item" });
        }
      });
    } else {
      createNews.mutate({ data: { ...data, publishedAt: new Date().toISOString() } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNewsQueryKey() });
          toast({ title: "News item added" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to add news item" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      deleteNews.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetNewsQueryKey() });
          toast({ title: "News item deleted" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to delete news item" });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage News & Announcements</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Add News</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingNews ? "Edit News" : "Add News"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="isPinned" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5"><FormLabel>Pin to top</FormLabel></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createNews.isPending || updateNews.isPending}>
                  {createNews.isPending || updateNews.isPending ? "Saving..." : (editingNews ? "Update" : "Save")}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : news.length > 0 ? (
              news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.isPinned && <Pin className="h-3 w-3 text-accent fill-accent" />}
                      <span className="line-clamp-1">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize">{item.category}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={(item as any).status === 'high' ? 'destructive' : (item as any).status === 'low' ? 'outline' : 'secondary'} className="capitalize">
                      {(item as any).status || 'moderate'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No news items found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
