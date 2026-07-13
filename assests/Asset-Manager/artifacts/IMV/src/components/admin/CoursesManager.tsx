import { useState, useEffect } from "react";
import { useGetCourses, getGetCoursesQueryKey, useCreateCourse, useDeleteCourse, useUpdateCourse } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DEPARTMENTS } from "@/lib/departments";

const courseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  type: z.string().min(1, "Type is required"),
  duration: z.string().min(1, "Duration is required"),
  seats: z.coerce.number().min(1, "Seats are required"),
  description: z.string().optional(),
  eligibility: z.string().optional(),
  fees: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export function CoursesManager() {
  const { data: coursesData, isLoading } = useGetCourses();
  const courses = Array.isArray(coursesData) ? coursesData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteCourse = useDeleteCourse();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const defaultValues = {
    name: "",
    department: DEPARTMENTS[0].label,
    type: "UG",
    duration: "3 Years",
    seats: 60,
    isActive: true,
  };

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues
  });

  useEffect(() => {
    if (!open) {
      setEditingCourse(null);
      form.reset(defaultValues);
    }
  }, [open, form]);

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    form.reset({
      name: course.name,
      department: course.department,
      type: course.type,
      duration: course.duration,
      seats: course.seats,
      isActive: course.isActive,
    });
    setOpen(true);
  };

  const onSubmit = (data: z.infer<typeof courseSchema>) => {
    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCoursesQueryKey() });
          toast({ title: "Course updated successfully" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update course" });
        }
      });
    } else {
      createCourse.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCoursesQueryKey() });
          toast({ title: "Course added successfully" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to add course" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCoursesQueryKey() });
          toast({ title: "Course deleted successfully" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to delete course" });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Courses</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.id} value={dept.label}>{dept.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="UG">UG</SelectItem>
                          <SelectItem value="PG">PG</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="duration" render={({ field }) => (
                    <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                  )} />
                  <FormField control={form.control} name="seats" render={({ field }) => (
                    <FormItem><FormLabel>Seats</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full" disabled={createCourse.isPending || updateCourse.isPending}>
                  {createCourse.isPending || updateCourse.isPending ? "Saving..." : (editingCourse ? "Update Course" : "Save Course")}
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
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.type}</TableCell>
                  <TableCell>{course.seats}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No courses found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
