import { Users, UserCheck, AlertTriangle, Video } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { workers, alerts } from '@/data/workers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const totalWorkers = workers.length;
  const presentWorkers = workers.filter((w) => w.attendance === 'Present').length;
  const ppeViolations = workers.filter((w) => w.ppeStatus === 'Not Wearing' && w.attendance === 'Present').length;
  const activeCameras = 1;

  const recentAlerts = alerts.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time worker safety monitoring at Devbhoomi Uttarakhand University
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Workers"
          value={totalWorkers}
          icon={Users}
          description="Registered at facility"
          variant="default"
        />
        <StatsCard
          title="Present Today"
          value={presentWorkers}
          icon={UserCheck}
          description={`${((presentWorkers / totalWorkers) * 100).toFixed(0)}% attendance`}
          variant="success"
        />
        <StatsCard
          title="PPE Violations"
          value={ppeViolations}
          icon={AlertTriangle}
          description="Immediate attention required"
          variant="destructive"
        />
        <StatsCard
          title="Active Cameras"
          value={`${activeCameras}/6`}
          icon={Video}
          description="5 cameras offline"
          variant="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{alert.workerName}</p>
                    <Badge
                      variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Safety Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">PPE Compliance Rate</span>
                  <span className="text-sm font-bold text-success">
                    {(((presentWorkers - ppeViolations) / presentWorkers) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full transition-all"
                    style={{
                      width: `${((presentWorkers - ppeViolations) / presentWorkers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm font-bold text-secondary">
                    {((presentWorkers / totalWorkers) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all"
                    style={{
                      width: `${(presentWorkers / totalWorkers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Camera Coverage</span>
                  <span className="text-sm font-bold text-warning">
                    {((activeCameras / 6) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all"
                    style={{
                      width: `${(activeCameras / 6) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
