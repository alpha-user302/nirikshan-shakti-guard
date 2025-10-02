import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings as SettingsIcon, Save, DollarSign, Calendar } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [n8nUrl, setN8nUrl] = useState('');
  const [n8nEnabled, setN8nEnabled] = useState(false);
  const [penalties, setPenalties] = useState({
    helmet: 500,
    vest: 300,
    gloves: 200,
    boots: 300,
    chest_guard: 400,
  });
  const [holidayRate, setHolidayRate] = useState(0.5);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.key === 'n8n_webhook_url') {
          const webhookData = setting.value as any;
          setN8nUrl(webhookData?.url || '');
          setN8nEnabled(webhookData?.enabled || false);
        } else if (setting.key === 'violation_penalties') {
          setPenalties(setting.value as any);
        } else if (setting.key === 'holiday_deduction_rate') {
          const holidayData = setting.value as any;
          setHolidayRate(holidayData?.per_violation || 0.5);
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const updates = [
        {
          key: 'n8n_webhook_url',
          value: { url: n8nUrl, enabled: n8nEnabled },
        },
        {
          key: 'violation_penalties',
          value: penalties,
        },
        {
          key: 'holiday_deduction_rate',
          value: { per_violation: holidayRate },
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert(update, { onConflict: 'key' });
        
        if (error) throw error;
      }

      toast({
        title: 'Settings saved',
        description: 'Your system settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          System Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure system-wide settings and integrations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>N8N Webhook Integration</CardTitle>
            <CardDescription>
              Configure webhook alerts for PPE violations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n8n-url">Webhook URL</Label>
              <Input
                id="n8n-url"
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="n8n-enabled">Enable Webhook Alerts</Label>
              <Switch
                id="n8n-enabled"
                checked={n8nEnabled}
                onCheckedChange={setN8nEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Violation Penalties
            </CardTitle>
            <CardDescription>
              Set salary deduction amounts for each PPE violation type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="helmet-penalty">Helmet (₹)</Label>
              <Input
                id="helmet-penalty"
                type="number"
                value={penalties.helmet}
                onChange={(e) =>
                  setPenalties({ ...penalties, helmet: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vest-penalty">Safety Vest (₹)</Label>
              <Input
                id="vest-penalty"
                type="number"
                value={penalties.vest}
                onChange={(e) =>
                  setPenalties({ ...penalties, vest: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gloves-penalty">Gloves (₹)</Label>
              <Input
                id="gloves-penalty"
                type="number"
                value={penalties.gloves}
                onChange={(e) =>
                  setPenalties({ ...penalties, gloves: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boots-penalty">Safety Boots (₹)</Label>
              <Input
                id="boots-penalty"
                type="number"
                value={penalties.boots}
                onChange={(e) =>
                  setPenalties({ ...penalties, boots: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chest-penalty">Chest Guard (₹)</Label>
              <Input
                id="chest-penalty"
                type="number"
                value={penalties.chest_guard}
                onChange={(e) =>
                  setPenalties({ ...penalties, chest_guard: Number(e.target.value) })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Holiday Deductions
            </CardTitle>
            <CardDescription>
              Configure holiday deductions per violation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="holiday-rate">Days Deducted per Violation</Label>
              <Input
                id="holiday-rate"
                type="number"
                step="0.1"
                value={holidayRate}
                onChange={(e) => setHolidayRate(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Number of holiday days deducted for each PPE violation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
