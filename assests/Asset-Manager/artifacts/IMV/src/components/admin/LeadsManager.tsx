import { useGetAdmissionLeads, getGetAdmissionLeadsQueryKey, useUpdateAdmissionLead } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function LeadsManager() {
  const { data: leads, isLoading } = useGetAdmissionLeads();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateLead = useUpdateAdmissionLead();

  const handleStatusChange = (id: number, status: string) => {
    updateLead.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdmissionLeadsQueryKey() });
        toast({ title: "Status updated successfully" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to update status" });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-amber-100 text-amber-800';
      case 'enrolled': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Admission Leads</h3>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Course Interest</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[120px]" /></TableCell>
                </TableRow>
              ))
            ) : leads && leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-sm">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-sm">
                    {lead.email}<br/>
                    <span className="text-muted-foreground">{lead.phone}</span>
                  </TableCell>
                  <TableCell>{lead.courseInterest}</TableCell>
                  <TableCell>
                    <Select defaultValue={lead.status} onValueChange={(val) => handleStatusChange(lead.id, val)}>
                      <SelectTrigger className={`h-8 w-[130px] border-none ${getStatusColor(lead.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No leads found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
