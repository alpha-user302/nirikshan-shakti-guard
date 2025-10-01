import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Webhook, Send } from 'lucide-react';
import { toast } from 'sonner';

export function N8NWebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem('n8n_webhook_url') || ''
  );

  const saveWebhook = () => {
    localStorage.setItem('n8n_webhook_url', webhookUrl);
    toast.success('N8N webhook URL saved successfully');
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          type: 'test',
          worker: 'Test Worker',
          missing_ppe: 'Helmet',
          timestamp: new Date().toISOString(),
        }),
      });

      toast.success('Test webhook sent! Check your N8N workflow and WhatsApp.');
    } catch (error) {
      console.error('Webhook test error:', error);
      toast.error('Failed to send test webhook');
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-primary" />
          N8N Webhook Integration
        </CardTitle>
        <CardDescription>
          Configure your N8N webhook URL to receive WhatsApp alerts for PPE violations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">N8N Webhook URL</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://your-n8n-instance.com/webhook/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Create a webhook trigger in N8N and paste the URL here
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={saveWebhook} className="flex-1">
            Save Webhook URL
          </Button>
          <Button onClick={testWebhook} variant="outline" className="gap-2">
            <Send className="h-4 w-4" />
            Test
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">N8N Workflow Setup Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>Create a new workflow in N8N</li>
            <li>Add a "Webhook" trigger node and copy its URL</li>
            <li>Add a "WhatsApp" node (or Twilio for WhatsApp)</li>
            <li>Configure the WhatsApp message with worker name and PPE details</li>
            <li>Connect the nodes and activate the workflow</li>
          </ol>
          <div className="mt-3 p-2 bg-background rounded text-xs font-mono">
            Payload format: {'{'}
            <br />
            &nbsp;&nbsp;"worker": "Worker Name",
            <br />
            &nbsp;&nbsp;"missing_ppe": "Helmet",
            <br />
            &nbsp;&nbsp;"timestamp": "ISO date"
            <br />
            {'}'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
