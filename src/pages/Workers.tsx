import { WorkerTable } from '@/components/WorkerTable';
import { workers } from '@/data/workers';

export default function Workers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workers Management</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage worker information, attendance, and PPE compliance
        </p>
      </div>

      <WorkerTable workers={workers} />
    </div>
  );
}
