import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportModal({ open, onOpenChange }: GenerateReportModalProps) {
  const { fields, observations } = useApp();
  const [reportType, setReportType] = useState('summary');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);

    // Simulate brief processing
    await new Promise(r => setTimeout(r, 1200));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let reportContent = `AGRISMART — FARM REPORT\n`;
    reportContent += `Generated: ${dateStr} at ${timeStr}\n`;
    reportContent += `Report Type: ${reportType.toUpperCase()}\n`;
    reportContent += `${'='.repeat(50)}\n\n`;

    if (reportType === 'summary' || reportType === 'full') {
      reportContent += `FIELD SUMMARY\n${'-'.repeat(30)}\n`;
      reportContent += `Total Fields: ${fields.length}\n`;
      const avgHealth = fields.length > 0
        ? (fields.reduce((s, f) => s + f.health, 0) / fields.length * 100).toFixed(1)
        : '0';
      reportContent += `Average NDVI Health: ${avgHealth}%\n`;
      fields.forEach(f => {
        reportContent += `\n• ${f.name}\n  Crop: ${f.crop} | Health: ${(f.health * 100).toFixed(0)}% | Location: ${f.location || 'N/A'} | Area: ${f.area || 'N/A'}\n`;
      });
      reportContent += '\n';
    }

    if (reportType === 'observations' || reportType === 'full') {
      reportContent += `RECENT OBSERVATIONS\n${'-'.repeat(30)}\n`;
      if (observations.length === 0) {
        reportContent += 'No observations logged yet.\n';
      } else {
        observations.slice(0, 20).forEach(o => {
          reportContent += `\n• [${o.type.toUpperCase()}] ${o.fieldName}\n  ${o.note}\n  ${o.timestamp.toLocaleDateString('en-IN')}\n`;
        });
      }
      reportContent += '\n';
    }

    if (reportType === 'health' || reportType === 'full') {
      reportContent += `CROP HEALTH ANALYSIS\n${'-'.repeat(30)}\n`;
      const healthy = fields.filter(f => f.health >= 0.8).length;
      const fair = fields.filter(f => f.health >= 0.6 && f.health < 0.8).length;
      const poor = fields.filter(f => f.health < 0.6).length;
      reportContent += `Healthy (NDVI ≥ 0.8): ${healthy} fields\n`;
      reportContent += `Fair (NDVI 0.6-0.8): ${fair} fields\n`;
      reportContent += `Poor (NDVI < 0.6): ${poor} fields\n`;
      reportContent += '\n';
    }

    reportContent += `${'='.repeat(50)}\n`;
    reportContent += `End of Report — AgriSmart\n`;

    // Download as text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrismart-report-${reportType}-${now.toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setGenerating(false);
    toast.success('Report generated and downloaded!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Generate Farm Report
          </DialogTitle>
          <DialogDescription>
            Generate a downloadable report of your farm data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Field Summary</SelectItem>
                <SelectItem value="health">Crop Health Analysis</SelectItem>
                <SelectItem value="observations">Observations Log</SelectItem>
                <SelectItem value="full">Full Report (All Data)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="stat-card border-primary/20 p-3">
            <p className="text-[10px] font-mono text-muted-foreground">
              <span className="text-foreground">Includes:</span>{' '}
              {reportType === 'summary' && `${fields.length} fields with NDVI health data`}
              {reportType === 'health' && 'Crop health breakdown and NDVI analysis'}
              {reportType === 'observations' && `${observations.length} logged observations`}
              {reportType === 'full' && 'All fields, observations, and health analysis'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={generating} className="bg-primary text-primary-foreground">
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Download Report</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
