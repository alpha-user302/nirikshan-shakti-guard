import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Calendar as CalendarIcon } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  employee_id: string;
  total_holidays: number;
  remaining_holidays: number;
}

interface LeaveManagerProps {
  worker: Worker;
  onUpdate: () => void;
}

export function LeaveManager({ worker, onUpdate }: LeaveManagerProps) {
  const [open, setOpen] = useState(false);
  const [totalHolidays, setTotalHolidays] = useState(worker.total_holidays);
  const [remainingHolidays, setRemainingHolidays] = useState(worker.remaining_holidays);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('workers')
        .update({
          total_holidays: totalHolidays,
          remaining_holidays: remainingHolidays,
        })
        .eq('id', worker.id);

      if (error) throw error;

      toast.success('Leave balance updated successfully');
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating leave balance:', error);
      toast.error('Failed to update leave balance');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Manage Leaves
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Leave Balance - {worker.name}</DialogTitle>
          <DialogDescription>
            Update total and remaining holidays for {worker.employee_id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="total">Total Annual Holidays</Label>
            <Input
              id="total"
              type="number"
              value={totalHolidays}
              onChange={(e) => setTotalHolidays(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remaining">Remaining Holidays</Label>
            <Input
              id="remaining"
              type="number"
              value={remainingHolidays}
              onChange={(e) => setRemainingHolidays(Number(e.target.value))}
              min={0}
              max={totalHolidays}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
