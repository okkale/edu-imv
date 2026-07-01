import { useGetPlacements, getGetPlacementsQueryKey, useDeletePlacement } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function PlacementsManager() {
  const { data: placementsData, isLoading } = useGetPlacements();
  const placements = Array.isArray(placementsData) ? placementsData : [];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deletePlacement = useDeletePlacement();

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
        <Button className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Add Placement</Button>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(placement.id)}><Trash2 className="h-4 w-4" /></Button>
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
