import { AlertsList } from '@/components/AlertsList';
import { alerts } from '@/data/workers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';

export default function Alerts() {
  const highSeverityAlerts = alerts.filter((a) => a.severity === 'high').length;
  const mediumSeverityAlerts = alerts.filter((a) => a.severity === 'medium').length;
  const totalAlerts = alerts.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Safety Alerts</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and respond to PPE violations and safety breaches
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{highSeverityAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <Bell className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{mediumSeverityAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Review required
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active notifications
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card bg-warning/10 border-warning">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Twilio WhatsApp Integration</p>
              <p className="text-sm text-muted-foreground mt-1">
                WhatsApp alerts are ready to be configured with your Twilio API credentials.
                Add your Twilio Account SID and Auth Token to enable automated safety notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertsList alerts={alerts} />
    </div>
  );
}
