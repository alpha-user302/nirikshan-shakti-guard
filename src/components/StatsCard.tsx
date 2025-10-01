import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  variant = 'default' 
}: StatsCardProps) {
  const variantClasses = {
    default: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-success',
    warning: 'border-l-4 border-l-warning',
    destructive: 'border-l-4 border-l-destructive',
  };

  return (
    <Card className={`shadow-card hover:shadow-lg transition-all ${variantClasses[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
