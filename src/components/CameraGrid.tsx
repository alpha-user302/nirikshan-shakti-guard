import { Video, VideoOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const cameras = [
  { id: 1, name: 'Entry Gate', active: true, location: 'Zone A' },
  { id: 2, name: 'Assembly Area', active: false, location: 'Zone B' },
  { id: 3, name: 'Storage Zone', active: false, location: 'Zone C' },
  { id: 4, name: 'Equipment Bay', active: false, location: 'Zone D' },
  { id: 5, name: 'Exit Point', active: false, location: 'Zone E' },
  { id: 6, name: 'Rest Area', active: false, location: 'Zone F' },
];

export function CameraGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <Card key={camera.id} className="shadow-card hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Camera {camera.id}
            </CardTitle>
            <Badge variant={camera.active ? 'default' : 'secondary'}>
              {camera.active ? 'Active' : 'Inactive'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
              {camera.active ? (
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  src=""
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='20' fill='%23fff'%3ELive Feed%3C/text%3E%3C/svg%3E"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <VideoOff className="h-12 w-12 mb-2" />
                  <span className="text-sm">Camera Offline</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{camera.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{camera.location}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
