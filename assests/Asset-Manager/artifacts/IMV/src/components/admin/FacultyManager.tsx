import { useState, useEffect } from "react";
import { useGetFaculty, getGetFacultyQueryKey, useCreateFacultyMember, useDeleteFacultyMember, useUpdateFacultyMember } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DEPARTMENTS } from "@/lib/departments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageCropper } from "../ImageCropper";

const facultySchema = z.object({
  title: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
  researchGuideStatus: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  adminRoles: z.string().optional(),
  coreSkills: z.string().optional(),
  publications: z.string().optional(),
  professionalMemberships: z.string().optional(),
  bio: z.string().optional(),
  isHOD: z.boolean().default(false),
});

export function FacultyManager() {
  const { data: facultyData, isLoading } = useGetFaculty();
  const faculty = Array.isArray(facultyData) ? facultyData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteFaculty = useDeleteFacultyMember();
  const createFaculty = useCreateFacultyMember();
  const updateFaculty = useUpdateFacultyMember();
  const [open, setOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);

  // Image Cropping States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const defaultValues = {
    title: "",
    name: "",
    department: DEPARTMENTS[0].label,
    designation: "Assistant Professor",
    qualification: "",
    specialization: "",
    experience: "",
    researchGuideStatus: "",
    email: "",
    phone: "",
    photoUrl: "",
    adminRoles: "",
    coreSkills: "",
    publications: "",
    professionalMemberships: "",
    bio: "",
    isHOD: false,
  };

  const form = useForm<z.infer<typeof facultySchema>>({
    resolver: zodResolver(facultySchema),
    defaultValues
  });

  useEffect(() => {
    if (!open) {
      setEditingFaculty(null);
      form.reset(defaultValues);
    }
  }, [open, form]);

  const handleEdit = (faculty: any) => {
    setEditingFaculty(faculty);
    form.reset({
      title: faculty.title || "",
      name: faculty.name || "",
      department: faculty.department || "",
      designation: faculty.designation || "",
      qualification: faculty.qualification || "",
      specialization: faculty.specialization || "",
      experience: faculty.experience || "",
      researchGuideStatus: faculty.researchGuideStatus || "",
      email: faculty.email || "",
      phone: faculty.phone || "",
      photoUrl: faculty.photoUrl || "",
      adminRoles: faculty.adminRoles || "",
      coreSkills: faculty.coreSkills || "",
      publications: faculty.publications || "",
      professionalMemberships: faculty.professionalMemberships || "",
      bio: faculty.bio || "",
      isHOD: !!faculty.isHOD,
    });
    setOpen(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImageSrc(reader.result?.toString() || "");
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropModalOpen(false);
    setIsUploadingPhoto(true);

    const formData = new FormData();
    formData.append("file", croppedBlob, "photo.jpg");

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("File upload failed");
      }

      const uploadData = await uploadRes.json();
      form.setValue("photoUrl", uploadData.url);
      toast({ title: "Photo uploaded successfully" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to upload photo" });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = (data: z.infer<typeof facultySchema>) => {
    if (editingFaculty) {
      updateFaculty.mutate({ id: editingFaculty.id, data: data as any }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFacultyQueryKey() });
          toast({ title: "Faculty member updated" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to update faculty member" });
        }
      });
    } else {
      createFaculty.mutate({ data: data as any }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFacultyQueryKey() });
          toast({ title: "Faculty member added" });
          setOpen(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to add faculty member" });
        }
      });
    }
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Add Faculty</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0" aria-describedby={undefined}>
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>{editingFaculty ? "Edit Faculty Member" : "Add Faculty Member"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Title (e.g. Dr., Prof., Mr., Ms.)</FormLabel><FormControl><Input placeholder="Prof. (Dr.)" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="designation" render={({ field }) => (
                      <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="Assistant Professor" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department / Institution</FormLabel>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="qualification" render={({ field }) => (
                      <FormItem><FormLabel>Highest Educational Qualification</FormLabel><FormControl><Input placeholder="Ph.D. (Computer Engineering)" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="specialization" render={({ field }) => (
                      <FormItem><FormLabel>Specialization</FormLabel><FormControl><Input placeholder="Machine Learning / Web Dev" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="experience" render={({ field }) => (
                      <FormItem><FormLabel>Total Teaching/Industry Experience</FormLabel><FormControl><Input placeholder="15 Years (14 Teaching, 1 Industry)" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="researchGuideStatus" render={({ field }) => (
                      <FormItem><FormLabel>Research Guide Status (if applicable)</FormLabel><FormControl><Input placeholder="Ph.D. Guide in SPPU" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Official Email Address</FormLabel><FormControl><Input type="email" placeholder="faculty@indrayanicollege.com" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="photoUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Photograph</FormLabel>
                      {field.value && (
                        <div className="flex items-center gap-4 mb-2">
                          <img src={field.value} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
                          <Button variant="destructive" size="sm" onClick={() => form.setValue("photoUrl", "")} type="button">Remove Photo</Button>
                        </div>
                      )}
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={onFileChange} disabled={isUploadingPhoto} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="adminRoles" render={({ field }) => (
                    <FormItem><FormLabel>Administrative Roles (HOD, IQAC Coordinator, etc.)</FormLabel><FormControl><Input placeholder="IQAC Coordinator, Exam Committee Member" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />

                  <FormField control={form.control} name="coreSkills" render={({ field }) => (
                    <FormItem><FormLabel>Core Skills / Areas of Expertise</FormLabel><FormControl><Input placeholder="React, Python, Cloud Computing, Database Systems" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />

                  <FormField control={form.control} name="publications" render={({ field }) => (
                    <FormItem><FormLabel>Research Publications / Indexing Information</FormLabel><FormControl><Textarea className="resize-none" rows={3} placeholder="1. Author et al, 'Paper Title', Journal Name, 2025 (Scopus Indexed)" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />

                  <FormField control={form.control} name="professionalMemberships" render={({ field }) => (
                    <FormItem><FormLabel>Professional Memberships (ISTE, IEEE, CSI, IETE, etc.)</FormLabel><FormControl><Input placeholder="IEEE Lifetime Member, CSI Coordinator" {...field} /></FormControl><FormMessage/></FormItem>
                  )} />

                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem><FormLabel>Short Biography</FormLabel><FormControl><Textarea className="resize-none" rows={3} placeholder="Brief overview of teaching philosophies, academic journey..." {...field} /></FormControl><FormMessage/></FormItem>
                  )} />

                  <FormField control={form.control} name="isHOD" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Head of Department (HOD)</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1f2937]" disabled={createFaculty.isPending || updateFaculty.isPending || isUploadingPhoto}>
                    {createFaculty.isPending || updateFaculty.isPending || isUploadingPhoto ? "Saving..." : "Save"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Sr. No</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : faculty.length > 0 ? (
              faculty.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {member.name}
                      {member.isHOD && <Badge variant="outline" className="bg-accent/10 text-accent text-[10px] py-0">HOD</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.designation}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No faculty members found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {cropModalOpen && (
        <ImageCropper
          open={cropModalOpen}
          onOpenChange={setCropModalOpen}
          imageSrc={selectedImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
