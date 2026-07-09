import { useState, useEffect } from "react";
import { useGetPlacements, getGetPlacementsQueryKey, useDeletePlacement, useCreatePlacement, useUpdatePlacement } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/departments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const placementSchema = z.object({
  studentName: z.string().min(1, "Student Name is required"),
  company: z.string().min(1, "Company is required"),
  package: z.string().min(1, "Package is required"),
  department: z.string().min(1, "Department is required"),
  year: z.coerce.number().min(2000, "Valid year is required"),
});

export function PlacementsManager() {
  const { data: placementsData, isLoading } = useGetPlacements();
  const placements = Array.isArray(placementsData) ? placementsData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deletePlacement = useDeletePlacement();
  const createPlacement = useCreatePlacement();
  const updatePlacement = useUpdatePlacement();
  const [open, setOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<any>(null);

  const defaultValues = {
    studentName: "",
    company: "",
    package: "",
    department: DEPARTMENTS[0].label,
    year: new Date().getFullYear(),
  };

  const form = useForm<z.infer<typeof placementSchema>>({
    resolver: zodResolver(placementSchema),
    defaultValues
  });

  useEffect(() => {
    if (!open) {
      setEditingPlacement(null);
      form.reset(defaultValues);
    }
  }, [open, form]);

  const handleEdit = (item: any) => {
    setEditingPlacement(item);
    form.reset({
      studentName: item.studentName,
      company: item.company,
      package: item.package,
      department: item.department,
      year: item.year,
    });
    setOpen(true);
  };

  const onSubmit = (data: z.infer<typeof placementSchema>) => {
    if (editingPlacement) {
      updatePlacement.mutate({ id: editingPlacement.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPlacementsQueryKey() });
          toast({ title: "Placement record updated" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update placement record" });
        }
      });
    } else {
      createPlacement.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPlacementsQueryKey() });
          toast({ title: "Placement record added" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to add placement record" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this placement record?")) {
      deletePlacement.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPlacementsQueryKey() });
          toast({ title: "Placement record deleted" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to delete placement record" });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Placements</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Add Placement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPlacement ? "Edit Placement" : "Add Placement"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="studentName" render={({ field }) => (
                  <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="package" render={({ field }) => (
                    <FormItem><FormLabel>Package</FormLabel><FormControl><Input {...field} placeholder="e.g. 10 LPA" /></FormControl><FormMessage/></FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept.id} value={dept.label}>{dept.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createPlacement.isPending || updatePlacement.isPending}>
                  {createPlacement.isPending || updatePlacement.isPending ? "Saving..." : (editingPlacement ? "Update" : "Save")}
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
              <TableHead>Student Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : placements.length > 0 ? (
              placements.map((placement) => (
                <TableRow key={placement.id}>
                  <TableCell className="font-medium">{placement.studentName}</TableCell>
                  <TableCell>{placement.company}</TableCell>
                  <TableCell>{placement.package}</TableCell>
                  <TableCell>{placement.department}</TableCell>
                  <TableCell>{placement.year}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(placement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(placement.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No placement records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
