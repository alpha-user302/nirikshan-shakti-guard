import { Alert } from '@/data/workers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  const handleWhatsAppAlert = (alert: Alert) => {
    // Placeholder for Twilio WhatsApp integration
    toast({
      title: "WhatsApp Alert Sent",
      description: `Notification sent to ${alert.workerName}`,
    });
    
    // In production, this would call your Twilio API
    console.log('Sending WhatsApp alert via Twilio:', {
      workerId: alert.workerId,
      workerName: alert.workerName,
      message: alert.message,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-secondary text-secondary-foreground';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="shadow-card hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-base">{alert.type}</CardTitle>
                  <Badge className={`mt-1 ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground">{alert.message}</p>
            
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{alert.workerName} ({alert.workerId})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{alert.timestamp}</span>
              </div>
            </div>

            <Button
              onClick={() => handleWhatsAppAlert(alert)}
              className="w-full bg-success hover:bg-success/90"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send WhatsApp Alert
            </Button>
          </CardContent>
        </Card>
      ))}

      {alerts.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No active alerts</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
