import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Worker {
  id: string;
  name: string;
  employee_id: string;
  role: string;
}

interface AttendanceMarkerProps {
  workers: Worker[];
  date: Date;
  onUpdate: () => void;
}

export function AttendanceMarker({ workers, date, onUpdate }: AttendanceMarkerProps) {
  const [markedWorkers, setMarkedWorkers] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const markAttendance = async (workerId: string, status: 'present' | 'absent' | 'leave') => {
    try {
      const { error } = await supabase.from('attendance').upsert(
        {
          worker_id: workerId,
          date: date.toISOString().split('T')[0],
          status,
          notes: notes[workerId] || null,
          check_in_time: status === 'present' ? new Date().toISOString() : null,
        },
        {
          onConflict: 'worker_id,date',
        }
      );

      if (error) throw error;

      setMarkedWorkers((prev) => new Set(prev).add(workerId));
      toast.success(`Marked as ${status}`);
      onUpdate();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Mark Attendance for {date.toLocaleDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="flex flex-col gap-2 p-3 rounded border bg-card hover:bg-accent/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{worker.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {worker.employee_id} • {worker.role}
                  </p>
                </div>
                {markedWorkers.has(worker.id) && (
                  <Badge variant="outline" className="bg-success/10">
                    Marked
                  </Badge>
                )}
              </div>

              <Textarea
                placeholder="Add notes (optional)"
                value={notes[worker.id] || ''}
                onChange={(e) => setNotes({ ...notes, [worker.id]: e.target.value })}
                className="text-sm"
                rows={2}
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => markAttendance(worker.id, 'present')}
                >
                  <CheckCircle className="h-4 w-4 mr-1 text-success" />
                  Present
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => markAttendance(worker.id, 'absent')}
                >
                  <XCircle className="h-4 w-4 mr-1 text-destructive" />
                  Absent
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => markAttendance(worker.id, 'leave')}
                >
                  <Clock className="h-4 w-4 mr-1 text-warning" />
                  Leave
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
