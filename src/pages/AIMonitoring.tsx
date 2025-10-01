import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingDown, Calendar, AlertTriangle } from 'lucide-react';
import { workers } from '@/data/workers';

interface WorkerSalary {
  id: string;
  name: string;
  baseSalary: number;
  violations: number;
  deductions: number;
  finalSalary: number;
  holidays: number;
  holidayDeductions: number;
  remainingHolidays: number;
  lastViolation: string;
}

export default function AIMonitoring() {
  const [scanning, setScanning] = useState(true);
  const [workerSalaries, setWorkerSalaries] = useState<WorkerSalary[]>([]);

  useEffect(() => {
    // Simulate AI scanning
    const timer = setTimeout(() => setScanning(false), 2000);
    
    // Calculate salaries based on worker data
    const salaryData: WorkerSalary[] = workers.map((worker) => {
      // Calculate violations based on PPE status
      const violations = worker.ppeStatus === 'Not Wearing' ? 
        Math.floor(Math.random() * 3) + 1 : 
        Math.floor(Math.random() * 2);
      
      // Base salary ranges by role
      const baseSalaryMap: Record<string, number> = {
        'Site Supervisor': 45000,
        'Safety Inspector': 40000,
        'Safety Officer': 42000,
        'Construction Worker': 25000,
        'Equipment Operator': 32000,
        'Electrician': 30000,
        'Welder': 28000,
        'Quality Control': 35000,
        'Crane Operator': 38000,
        'Plumber': 27000,
      };

      const baseSalary = baseSalaryMap[worker.role] || 25000;
      const deductions = violations * 2; // ₹2 per violation
      const finalSalary = baseSalary - deductions;
      
      const initialHolidays = 4;
      const holidayDeductions = violations * 0.5; // 0.5 day per violation
      const remainingHolidays = Math.max(0, initialHolidays - holidayDeductions);

      return {
        id: worker.id,
        name: worker.name,
        baseSalary,
        violations,
        deductions,
        finalSalary,
        holidays: initialHolidays,
        holidayDeductions,
        remainingHolidays,
        lastViolation: worker.ppeStatus === 'Not Wearing' ? worker.lastSeen : 'No recent violations',
      };
    });

    setWorkerSalaries(salaryData);
    return () => clearTimeout(timer);
  }, []);

  const totalViolations = workerSalaries.reduce((sum, w) => sum + w.violations, 0);
  const totalDeductions = workerSalaries.reduce((sum, w) => sum + w.deductions, 0);
  const avgHolidaysRemaining = workerSalaries.length > 0
    ? (workerSalaries.reduce((sum, w) => sum + w.remainingHolidays, 0) / workerSalaries.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">AI Monitoring System</h1>
        </div>
        <p className="text-muted-foreground">
          Real-time violation detection with automated salary and holiday calculations
        </p>
        {scanning && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-full" />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{totalViolations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Detected by AI system
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">₹{totalDeductions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹2 per violation
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Holidays Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{avgHolidaysRemaining}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of 4 days initial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Processing Indicator */}
      {scanning && (
        <Card className="shadow-lg animate-pulse">
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-4">
              <Zap className="h-8 w-8 text-primary animate-bounce" />
              <div>
                <p className="text-lg font-semibold">AI Analysis in Progress...</p>
                <p className="text-sm text-muted-foreground">Scanning worker violations and calculating penalties</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Worker Salary Table */}
      {!scanning && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>AI-Calculated Worker Compensation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Worker ID</th>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-right p-3 font-semibold">Base Salary</th>
                    <th className="text-center p-3 font-semibold">Violations</th>
                    <th className="text-right p-3 font-semibold">Deductions</th>
                    <th className="text-right p-3 font-semibold">Final Salary</th>
                    <th className="text-center p-3 font-semibold">Holidays</th>
                    <th className="text-left p-3 font-semibold">Last Violation</th>
                  </tr>
                </thead>
                <tbody>
                  {workerSalaries.map((worker) => (
                    <tr key={worker.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-mono text-sm">{worker.id}</td>
                      <td className="p-3 font-medium">{worker.name}</td>
                      <td className="p-3 text-right text-muted-foreground">
                        ₹{worker.baseSalary.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={worker.violations > 0 ? 'destructive' : 'secondary'}>
                          {worker.violations}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-destructive font-semibold">
                        {worker.deductions > 0 ? `- ₹${worker.deductions}` : '₹0'}
                      </td>
                      <td className="p-3 text-right font-bold text-success">
                        ₹{worker.finalSalary.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="space-y-1">
                          <Badge variant="secondary" className="block">
                            {worker.remainingHolidays.toFixed(1)} / {worker.holidays}
                          </Badge>
                          {worker.holidayDeductions > 0 && (
                            <span className="text-xs text-destructive">
                              -{worker.holidayDeductions} days
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {worker.lastViolation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI System Info */}
      <Card className="shadow-card bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Violation Penalty:</span>
            <span className="font-semibold">₹2 per violation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Holiday Deduction:</span>
            <span className="font-semibold">0.5 days per violation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Initial Holiday Balance:</span>
            <span className="font-semibold">4 days per worker</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Detection Method:</span>
            <span className="font-semibold">Real-time AI Camera Analysis</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
