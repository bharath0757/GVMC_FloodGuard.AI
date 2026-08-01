import * as React from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, Input, Select, useToast } from '@floodguard/ui';
import { useCreateReport } from '@/hooks/use-api-queries';
import { MOCK_WARDS } from '@/data/mockData';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({ isOpen, onClose }) => {
  const createReportMutation = useCreateReport();
  const { toast } = useToast();

  const [title, setTitle] = React.useState('');
  const [wardName, setWardName] = React.useState(MOCK_WARDS[0].name);
  const [description, setDescription] = React.useState('');
  const [waterDepthCm, setWaterDepthCm] = React.useState<number>(45);
  const [severity, setSeverity] = React.useState('High');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReportMutation.mutateAsync({
        ward_name: wardName,
        title,
        description,
        severity,
        water_depth_cm: Number(waterDepthCm),
        lat: 17.6868,
        lng: 83.2185,
      });

      toast({
        title: 'Report Submitted to Database',
        message: 'Your crowdsourced flood report has been registered in PostgreSQL DB.',
        type: 'success',
      });
      onClose();
    } catch (err: any) {
      toast({
        title: 'Submission Failed',
        message: err.response?.data?.detail || 'Failed to submit report.',
        type: 'error',
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Submit Crowdsourced Flood Incident Report</DialogTitle>
        <DialogDescription>
          Report active waterlogging or hazards to the GVMC Flood Command Center database.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
        <div>
          <label className="block font-semibold mb-1">Report Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Submerged Underpass near Gajuwaka Junction"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Municipal Ward</label>
            <Select value={wardName} onChange={(e) => setWardName(e.target.value)}>
              {MOCK_WARDS.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name} (Ward #{w.number})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Severity Level</label>
            <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="Low">Low (Water on curbs)</option>
              <option value="Medium">Medium (Roads covered)</option>
              <option value="High">High (Knee-deep water)</option>
              <option value="Critical">Critical (Submerged vehicles)</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Estimated Water Depth (cm)</label>
          <Input
            type="number"
            value={waterDepthCm}
            onChange={(e) => setWaterDepthCm(Number(e.target.value))}
            placeholder="45"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Provide landmark details, trapped vehicles, or power line hazards..."
            required
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="danger" isLoading={createReportMutation.isPending}>
            Submit Report to DB
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
