import { CameraGrid } from '@/components/CameraGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, VideoOff, Activity } from 'lucide-react';

export default function Cameras() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Camera Monitoring</h1>
        <p className="text-muted-foreground mt-1">
          Live camera feeds for safety monitoring across the facility
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
            <Video className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Camera operational
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Cameras</CardTitle>
            <VideoOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require maintenance
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">17%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of total facility
            </p>
          </CardContent>
        </Card>
      </div>

      <CameraGrid />

      <Card className="shadow-card bg-muted/50">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm font-medium">Recording Status</span>
              <span className="text-sm text-success flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm font-medium">AI Detection</span>
              <span className="text-sm text-warning">Pending Configuration</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm font-medium">Storage Available</span>
              <span className="text-sm">2.3 TB / 5 TB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
