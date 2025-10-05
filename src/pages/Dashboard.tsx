import { useState, useEffect } from 'react';
import { Users, UserCheck, AlertTriangle, Video, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { workers, alerts } from '@/data/workers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generatePDFReport, generateSalaryExcel } from '@/utils/reportGenerator';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [presentWorkers, setPresentWorkers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total workers count
        const { count: workersCount, error: workersError } = await supabase
          .from('workers')
          .select('*', { count: 'exact', head: true });

        if (workersError) throw workersError;

        // Fetch today's attendance with status 'present'
        const today = new Date().toISOString().split('T')[0];
        const { count: presentCount, error: attendanceError } = await supabase
          .from('attendance')
          .select('*', { count: 'exact', head: true })
          .eq('date', today)
          .eq('status', 'present');

        if (attendanceError) throw attendanceError;

        setTotalWorkers(workersCount || 0);
        setPresentWorkers(presentCount || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up realtime subscription for attendance changes
    const channel = supabase
      .channel('dashboard-attendance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const ppeViolations = workers.filter((w) => w.ppeStatus === 'Not Wearing' && w.attendance === 'Present').length;
  const activeCameras = 1;

  const recentAlerts = alerts.slice(0, 3);

  // Chart Data
  const ppeComplianceData = [
    { name: 'Wearing PPE', value: presentWorkers - ppeViolations, fill: 'hsl(var(--success))' },
    { name: 'Not Wearing PPE', value: ppeViolations, fill: 'hsl(var(--destructive))' },
  ];

  const attendanceData = [
    { name: 'Present', value: presentWorkers, fill: 'hsl(var(--primary))' },
    { name: 'Absent', value: totalWorkers - presentWorkers, fill: 'hsl(var(--muted))' },
  ];

  const violationsByWorker = workers
    .map(w => ({
      name: w.name.split(' ')[0],
      violations: alerts.filter(a => a.workerId === w.id).length,
    }))
    .filter(w => w.violations > 0)
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 6);

  const handleDownloadPDF = () => {
    try {
      generatePDFReport(workers, alerts);
      toast({
        title: "Report Downloaded",
        description: "PDF report has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcel = () => {
    try {
      generateSalaryExcel(workers, alerts);
      toast({
        title: "Salary Report Downloaded",
        description: "Excel salary report has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate Excel report.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time worker safety monitoring at Devbhoomi Uttarakhand University
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Download Report (PDF)
          </Button>
          <Button onClick={handleDownloadExcel} variant="secondary" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Salary Report (Excel)
          </Button>
        </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>PPE Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ppeComplianceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ppeComplianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Top Violations by Worker</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationsByWorker}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar dataKey="violations" fill="hsl(var(--destructive))" name="Violations" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
