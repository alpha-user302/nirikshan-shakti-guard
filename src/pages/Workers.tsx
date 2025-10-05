import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { LeaveManager } from '@/components/LeaveManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Worker {
  id: string;
  name: string;
  employee_id: string;
  role: string;
  department: string | null;
  phone: string | null;
  email: string | null;
  total_holidays: number;
  remaining_holidays: number;
}

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  const fetchWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('name');

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (roleLoading || loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workers Management</h1>
        <p className="text-muted-foreground mt-1">
          View worker information, leave balance, and attendance records
        </p>
      </div>

      {!isAdmin && (
        <Alert>
          <AlertDescription>
            You have view-only access. Contact an administrator to manage worker information.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Leave Balance</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkers.map((worker) => (
              <TableRow key={worker.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{worker.employee_id}</TableCell>
                <TableCell className="font-medium">{worker.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{worker.role}</Badge>
                </TableCell>
                <TableCell>{worker.department || 'N/A'}</TableCell>
                <TableCell className="text-sm">
                  <div>{worker.email || 'N/A'}</div>
                  <div className="text-muted-foreground">{worker.phone || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {worker.remaining_holidays} / {worker.total_holidays} days
                    </div>
                    <div className="text-muted-foreground">
                      {((worker.remaining_holidays / worker.total_holidays) * 100).toFixed(0)}% remaining
                    </div>
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <LeaveManager worker={worker} onUpdate={fetchWorkers} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No workers found matching your search.
        </div>
      )}
    </div>
  );
}
