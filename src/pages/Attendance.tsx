import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, TrendingUp, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceMarker } from '@/components/AttendanceMarker';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Worker {
  id: string;
  name: string;
  employee_id: string;
  role: string;
}

interface AttendanceRecord {
  id: string;
  worker_id: string;
  status: string;
  date: string;
  workers: Worker;
}

export default function Attendance() {
  const [date, setDate] = useState<Date>(new Date());
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  const fetchData = async () => {
    try {
      const [workersRes, attendanceRes] = await Promise.all([
        supabase.from('workers').select('id, name, employee_id, role'),
        supabase
          .from('attendance')
          .select('*, workers(id, name, employee_id, role)')
          .eq('date', date.toISOString().split('T')[0]),
      ]);

      if (workersRes.error) throw workersRes.error;
      if (attendanceRes.error) throw attendanceRes.error;

      setWorkers(workersRes.data || []);
      setAttendance(attendanceRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const leaveCount = attendance.filter((a) => a.status === 'leave').length;
  const attendanceRate = workers.length > 0 ? ((presentCount / workers.length) * 100).toFixed(1) : '0';

  const presentWorkers = attendance.filter((a) => a.status === 'present');
  const absentWorkers = attendance.filter((a) => a.status === 'absent');
  const leaveWorkers = attendance.filter((a) => a.status === 'leave');

  if (roleLoading || loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? 'Mark attendance and track worker presence' : 'View daily attendance records'}
        </p>
      </div>

      {!isAdmin && (
        <Alert>
          <AlertDescription>
            You need admin privileges to mark attendance. Contact an administrator for access.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Workers present today</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <CalendarDays className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{absentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Workers absent today</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <CalendarDays className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leaveCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Workers on leave</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Number(attendanceRate) >= 85 ? 'Above target' : 'Below target'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} className="rounded-md border pointer-events-auto" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {presentWorkers.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-success">Present</span>
                    <Badge className="bg-success">{presentWorkers.length}</Badge>
                  </h3>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {presentWorkers.map((record) => (
                      <div key={record.id} className="text-sm p-2 rounded border">
                        {record.workers.name} - {record.workers.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {absentWorkers.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-destructive">Absent</span>
                    <Badge variant="destructive">{absentWorkers.length}</Badge>
                  </h3>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {absentWorkers.map((record) => (
                      <div key={record.id} className="text-sm p-2 rounded border">
                        {record.workers.name} - {record.workers.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {leaveWorkers.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-warning">On Leave</span>
                    <Badge variant="outline">{leaveWorkers.length}</Badge>
                  </h3>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {leaveWorkers.map((record) => (
                      <div key={record.id} className="text-sm p-2 rounded border">
                        {record.workers.name} - {record.workers.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdmin && <AttendanceMarker workers={workers} date={date} onUpdate={fetchData} />}
    </div>
  );
}
