import { toast } from 'sonner';

export async function sendN8NAlert(workerName: string, missingPPE: string) {
  const webhookUrl = localStorage.getItem('n8n_webhook_url');
  
  if (!webhookUrl) {
    console.log('N8N webhook not configured');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        type: 'ppe_violation',
        worker: workerName,
        missing_ppe: missingPPE,
        location: 'Devbhoomi University Construction Site',
        timestamp: new Date().toISOString(),
        severity: 'high',
      }),
    });

    toast.info(`Alert sent to admin via WhatsApp for ${workerName}`);
  } catch (error) {
    console.error('Failed to send N8N alert:', error);
  }
}
