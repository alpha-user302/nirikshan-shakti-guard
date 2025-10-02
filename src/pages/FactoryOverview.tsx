import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, MapPin, Users, Shield, Maximize2, Map, 
  AlertCircle, Flame, Activity, Wrench, FlaskConical,
  Wind, FileText, Clock, CheckCircle, XCircle, Bell,
  Zap, Eye, ThermometerSun, Radio, Droplets
} from 'lucide-react';
import factoryLayout from '@/assets/factory-layout.jpg';
import { workers } from '@/data/workers';
import { alerts } from '@/data/workers';
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

      {/* Emergency & Safety Status */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-destructive" />
            Emergency & Safety Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Emergency Exits</span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold">6/6</p>
              <p className="text-xs text-muted-foreground mt-1">All exits operational</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fire Extinguishers</span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold">12/12</p>
              <p className="text-xs text-muted-foreground mt-1">Last checked: 15 Jan 2025</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">First Aid Kits</span>
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <p className="text-2xl font-bold">4/5</p>
              <p className="text-xs text-muted-foreground mt-1">1 kit needs refill</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Emergency Drills</span>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">28 days</p>
              <p className="text-xs text-muted-foreground mt-1">Next drill: 10 Feb 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machinery & Equipment Monitoring */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Machinery & Equipment Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'CNC Machine #1', status: 'Running', maintenance: '5 days ago', temp: 'Normal', alert: false },
              { name: 'Welding Station #3', status: 'Running', maintenance: '12 days ago', temp: 'Normal', alert: false },
              { name: 'Assembly Line #2', status: 'Idle', maintenance: '2 days ago', temp: 'Normal', alert: false },
              { name: 'Industrial Press #1', status: 'Maintenance', maintenance: 'In progress', temp: 'N/A', alert: true },
              { name: 'Conveyor Belt #4', status: 'Running', maintenance: '8 days ago', temp: 'High', alert: true },
            ].map((machine, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{machine.name}</p>
                    <p className="text-xs text-muted-foreground">Last maintenance: {machine.maintenance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    machine.status === 'Running' ? 'default' : 
                    machine.status === 'Idle' ? 'secondary' : 'destructive'
                  } className={
                    machine.status === 'Running' ? 'bg-success text-success-foreground' : ''
                  }>
                    {machine.status}
                  </Badge>
                  {machine.alert && (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Emergency Stop Log</p>
            <p className="text-xs text-muted-foreground">2 emergency stops in last 30 days</p>
          </div>
        </CardContent>
      </Card>

      {/* Hazardous Materials & Environment */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-warning" />
            Hazardous Materials & Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Chemical Inventory
              </h4>
              {[
                { name: 'Industrial Solvent', qty: '45L', msds: true, storage: 'Normal' },
                { name: 'Paint Thinner', qty: '28L', msds: true, storage: 'Normal' },
                { name: 'Welding Gas', qty: '12 Tanks', msds: true, storage: 'Low Temp' },
              ].map((chem, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{chem.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {chem.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {chem.msds ? 'MSDS ✓' : 'MSDS ✗'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Storage: {chem.storage}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Environment Monitoring
              </h4>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Air Quality Index</span>
                  <ThermometerSun className="h-4 w-4 text-success" />
                </div>
                <p className="text-2xl font-bold">Good</p>
                <p className="text-xs text-muted-foreground">PM2.5: 12 μg/m³</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Noise Level</span>
                  <Radio className="h-4 w-4 text-warning" />
                </div>
                <p className="text-2xl font-bold">78 dB</p>
                <p className="text-xs text-muted-foreground">Within safe limits</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Temperature</span>
                  <ThermometerSun className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">24°C</p>
                <p className="text-xs text-muted-foreground">Optimal range</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worker Safety & Training */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Worker Safety & Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Workers On Site</span>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{activeWorkers}</p>
              <p className="text-xs text-muted-foreground mt-1">Real-time count</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">PPE Compliance</span>
                {violatingWorkers.length === 0 ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-2xl font-bold">
                {activeWorkers - violatingWorkers.length}/{activeWorkers}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {violatingWorkers.length} violations
              </p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Training Completed</span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <p className="text-2xl font-bold">89%</p>
              <p className="text-xs text-muted-foreground mt-1">23/26 workers</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Incident Reports</span>
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </div>
          </div>

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

      {/* Building & Infrastructure */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Building & Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Structural Safety</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">Last inspection: 1 week ago</p>
                <p className="text-xs text-muted-foreground mt-1">Next: 15 Feb 2025</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Electrical System</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">Status: All circuits normal</p>
                <p className="text-xs text-muted-foreground mt-1">Load: 78% capacity</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Ventilation System</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">All units operational</p>
                <p className="text-xs text-muted-foreground mt-1">Air flow: Optimal</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Lighting System</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">142/145 lights working</p>
                <p className="text-xs text-muted-foreground mt-1">3 scheduled for replacement</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">CCTV Surveillance</span>
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">24/24 cameras online</p>
                <p className="text-xs text-muted-foreground mt-1">Recording: Active</p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Power Backup</span>
                  <Zap className="h-4 w-4 text-warning" />
                </div>
                <p className="text-sm text-muted-foreground">Generator: Standby</p>
                <p className="text-xs text-muted-foreground mt-1">UPS: 4 hours backup</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Reports */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-destructive" />
            Live Alerts & Incident Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'high'
                    ? 'border-l-destructive bg-destructive/5'
                    : alert.severity === 'medium'
                    ? 'border-l-warning bg-warning/5'
                    : 'border-l-primary bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`h-4 w-4 ${
                        alert.severity === 'high' ? 'text-destructive' :
                        alert.severity === 'medium' ? 'text-warning' : 'text-primary'
                      }`} />
                      <span className="font-medium text-sm">{alert.workerName}</span>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Daily Reports</span>
              </div>
              <p className="text-xs text-muted-foreground">Auto-generated at 11:59 PM</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Weekly Summary</span>
              </div>
              <p className="text-xs text-muted-foreground">Next report: Monday</p>
            </div>
            
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Compliance Report</span>
              </div>
              <p className="text-xs text-muted-foreground">Monthly - Due in 10 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
