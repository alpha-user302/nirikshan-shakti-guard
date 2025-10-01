import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MapPin, Users, Shield, Maximize2, Map } from 'lucide-react';
import factoryLayout from '@/assets/factory-layout.jpg';
import { workers } from '@/data/workers';
import Factory3D from '@/components/Factory3D';

export default function FactoryOverview() {
  const activeWorkers = workers.filter((w) => w.attendance === 'Present').length;
  const violatingWorkers = workers.filter(
    (w) => w.ppeStatus === 'Not Wearing' && w.attendance === 'Present'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Factory Overview</h1>
        <p className="text-muted-foreground mt-1">
          Devbhoomi Uttarakhand University - Construction Site Monitoring
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facility</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Main Site</div>
            <p className="text-xs text-muted-foreground mt-1">
              Devbhoomi University
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Uttarakhand</div>
            <p className="text-xs text-muted-foreground mt-1">
              Construction Zone A-C
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{activeWorkers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently on site
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Status</CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{violatingWorkers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              PPE violations active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5 text-primary" />
            Site Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="3d" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="3d" className="gap-2">
                <Maximize2 className="h-4 w-4" />
                3D View
              </TabsTrigger>
              <TabsTrigger value="2d" className="gap-2">
                <Map className="h-4 w-4" />
                2D Layout
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="3d">
              <Factory3D />
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">3D Controls</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Left click + drag to rotate view</li>
                  <li>• Right click + drag to pan</li>
                  <li>• Scroll to zoom in/out</li>
                  <li>• Green workers: Wearing PPE ✓</li>
                  <li>• Red workers: Missing PPE ✗</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="2d">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={factoryLayout}
                  alt="Factory Layout - Devbhoomi Uttarakhand University"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">Zone Information</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm">Zone A - Safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-sm">Zone B - Caution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="text-sm">Zone C - Violation</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Workers Currently on Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {workers
              .filter((w) => w.attendance === 'Present')
              .map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{worker.name}</p>
                    <p className="text-xs text-muted-foreground">{worker.role}</p>
                  </div>
                  <Badge
                    variant={worker.ppeStatus === 'Wearing' ? 'default' : 'destructive'}
                    className={
                      worker.ppeStatus === 'Wearing'
                        ? 'bg-success text-success-foreground'
                        : ''
                    }
                  >
                    {worker.ppeStatus === 'Wearing' ? '✓ PPE' : '✗ PPE'}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
