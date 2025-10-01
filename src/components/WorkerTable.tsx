import { useState } from 'react';
import { Worker } from '@/data/workers';
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
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface WorkerTableProps {
  workers: Worker[];
}

export function WorkerTable({ workers }: WorkerTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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
              <TableHead>Worker ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>PPE Status</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkers.map((worker) => (
              <TableRow key={worker.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{worker.id}</TableCell>
                <TableCell className="font-medium">{worker.name}</TableCell>
                <TableCell>{worker.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={worker.attendance === 'Present' ? 'default' : 'secondary'}
                    className={
                      worker.attendance === 'Present'
                        ? 'bg-success text-success-foreground'
                        : ''
                    }
                  >
                    {worker.attendance}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {worker.ppeStatus === 'Wearing' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-success">Wearing</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">Not Wearing</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {worker.lastSeen}
                </TableCell>
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
