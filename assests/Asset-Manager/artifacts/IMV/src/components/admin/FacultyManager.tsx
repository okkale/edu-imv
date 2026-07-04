import { useState, useEffect } from "react";
import { 
  useGetFaculty, 
  getGetFacultyQueryKey, 
  useCreateFacultyMember, 
  useUpdateFacultyMember,
  useDeleteFacultyMember 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const facultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional().or(z.literal('')),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().optional().or(z.literal('')),
  specialization: z.string().optional().or(z.literal('')),
  experience: z.string().optional().or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
  publications: z.string().optional().or(z.literal('')),
  memberships: z.string().optional().or(z.literal('')),
  researchGuide: z.string().optional().or(z.literal('')),
  adminRoles: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  photoUrl: z.string().optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  isHOD: z.boolean().default(false),
});

type FacultyFormValues = z.infer<typeof facultySchema>;

export function FacultyManager() {
  const { data: facultyData, isLoading } = useGetFaculty();
  const faculty = Array.isArray(facultyData) ? facultyData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const deleteFaculty = useDeleteFacultyMember();
  const createFaculty = useCreateFacultyMember();
  const updateFaculty = useUpdateFacultyMember();
  
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      title: "",
      department: "Computer Applications",
      designation: "Assistant Professor",
      qualification: "",
      specialization: "",
      experience: "",
      skills: "",
      publications: "",
      memberships: "",
      researchGuide: "",
      adminRoles: "",
      email: "",
      phone: "",
      photoUrl: "",
      bio: "",
      isHOD: false,
    }
  });

  useEffect(() => {
    if (open) {
      if (editingMember) {
        form.reset({
          name: editingMember.name || "",
          title: editingMember.title || "",
          department: editingMember.department || "",
          designation: editingMember.designation || "",
          qualification: editingMember.qualification || "",
          specialization: editingMember.specialization || "",
          experience: editingMember.experience || "",
          skills: editingMember.skills || "",
          publications: editingMember.publications || "",
          memberships: editingMember.memberships || "",
          researchGuide: editingMember.researchGuide || "",
          adminRoles: editingMember.adminRoles || "",
          email: editingMember.email || "",
          phone: editingMember.phone || "",
          photoUrl: editingMember.photoUrl || "",
          bio: editingMember.bio || "",
          isHOD: editingMember.isHOD || false,
        });
      } else {
        form.reset({
          name: "",
          title: "",
          department: "Computer Applications",
          designation: "Assistant Professor",
          qualification: "",
          specialization: "",
          experience: "",
          skills: "",
          publications: "",
          memberships: "",
          researchGuide: "",
          adminRoles: "",
          email: "",
          phone: "",
          photoUrl: "",
          bio: "",
          isHOD: false,
        });
      }
    }
  }, [editingMember, open, form]);

  const onSubmit = (data: FacultyFormValues) => {
    if (editingMember) {
      updateFaculty.mutate({ 
        id: editingMember.id, 
        data: data as any 
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFacultyQueryKey() });
          toast({ title: "Faculty member updated successfully" });
          setOpen(false);
          setEditingMember(null);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update faculty member" });
        }
      });
    } else {
      createFaculty.mutate({ data: data as any }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFacultyQueryKey() });
          toast({ title: "Faculty member added successfully" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to add faculty member" });
        }
      });
    }
  };

  const handleEditClick = (member: any) => {
    setEditingMember(member);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this faculty member?")) {
      deleteFaculty.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFacultyQueryKey() });
          toast({ title: "Faculty member removed" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to remove faculty member" });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Faculty</h3>
        <Button 
          className="bg-primary"
          onClick={() => {
            setEditingMember(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Faculty
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Faculty Member" : "Add Faculty Member"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (e.g. Dr., Prof., Mr., Ms.)</FormLabel>
                    <FormControl><Input placeholder="Prof. (Dr.)" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Amruta Surana" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="designation" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl><Input placeholder="Associate Professor / HOD" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department / Institution</FormLabel>
                    <FormControl><Input placeholder="Computer Applications" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="qualification" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Educational Qualification</FormLabel>
                    <FormControl><Input placeholder="Ph.D. (Computer Engineering)" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="specialization" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl><Input placeholder="Machine Learning / Web Dev" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Teaching/Industry Experience</FormLabel>
                    <FormControl><Input placeholder="15 Years (14 Teaching, 1 Industry)" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="researchGuide" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Guide Status (if applicable)</FormLabel>
                    <FormControl><Input placeholder="Ph.D. Guide in SPPU" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="faculty@indrayanicollege.com" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="photoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Photograph</FormLabel>
                  <div className="space-y-3">
                    {field.value && (
                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-border/80 w-fit">
                        <img 
                          src={field.value} 
                          alt="Faculty Preview" 
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          className="h-8 text-xs font-semibold"
                          onClick={() => field.onChange("")}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    )}
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert("File is too large! Please choose an image smaller than 2MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={form.control} name="adminRoles" render={({ field }) => (
                <FormItem>
                  <FormLabel>Administrative Roles (HOD, IQAC Coordinator, etc.)</FormLabel>
                  <FormControl><Input placeholder="IQAC Coordinator, Exam Committee Member" {...field} /></FormControl>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={form.control} name="skills" render={({ field }) => (
                <FormItem>
                  <FormLabel>Core Skills / Areas of Expertise</FormLabel>
                  <FormControl><Input placeholder="React, Python, Cloud Computing, Database Systems" {...field} /></FormControl>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={form.control} name="publications" render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Publications / Indexing Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="1. Author et al, 'Paper Title', Journal Name, 2025 (Scopus Indexed)&#10;2. ..." 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={form.control} name="memberships" render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Memberships (ISTE, IEEE, CSI, IETE, etc.)</FormLabel>
                  <FormControl><Input placeholder="IEEE Lifetime Member, CSI Coordinator" {...field} /></FormControl>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Biography</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief overview of teaching philosophies, academic journey..." 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={form.control} name="isHOD" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Head of Department (HOD)</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <Button type="submit" className="w-full bg-primary" disabled={createFaculty.isPending || updateFaculty.isPending}>
                {createFaculty.isPending || updateFaculty.isPending ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : faculty.length > 0 ? (
              faculty.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        {member.title ? `${member.title} ` : ""}{member.name}
                      </span>
                      {member.isHOD && <Badge variant="outline" className="bg-accent/10 text-accent text-[10px] py-0 border-accent/20">HOD</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.designation}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-primary"
                        onClick={() => handleEditClick(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No faculty members found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
