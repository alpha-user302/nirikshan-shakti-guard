import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { workers } from '@/data/workers';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, TrendingUp } from 'lucide-react';

export default function Attendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const presentWorkers = workers.filter((w) => w.attendance === 'Present');
  const absentWorkers = workers.filter((w) => w.attendance === 'Absent');
  const attendanceRate = ((presentWorkers.length / workers.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Track daily attendance and historical records
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentWorkers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {workers.length} total workers
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{absentWorkers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((absentWorkers.length / workers.length) * 100).toFixed(1)}% absence rate
            </p>
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
              Above target of 85%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Attendance Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Today's Attendance List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-success">Present</span>
                  <Badge className="bg-success">{presentWorkers.length}</Badge>
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {presentWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="flex items-center justify-between p-2 rounded border bg-card hover:bg-accent/5"
                    >
                      <div>
                        <p className="font-medium text-sm">{worker.name}</p>
                        <p className="text-xs text-muted-foreground">{worker.role}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{worker.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {absentWorkers.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2 mt-4">
                    <span className="text-destructive">Absent</span>
                    <Badge variant="destructive">{absentWorkers.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {absentWorkers.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex items-center justify-between p-2 rounded border bg-card hover:bg-accent/5"
                      >
                        <div>
                          <p className="font-medium text-sm">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.role}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{worker.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
