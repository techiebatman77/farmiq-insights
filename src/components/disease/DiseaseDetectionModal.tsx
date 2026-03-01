import { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Camera, X, Loader2, Bug, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DiseaseResult, mockDiseaseAnalysis } from '@/lib/diseaseData';
import { DiseaseResultsCard } from './DiseaseResultsCard';

interface DiseaseDetectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResultSaved?: (result: DiseaseResult) => void;
}

export function DiseaseDetectionModal({ open, onOpenChange, onResultSaved }: DiseaseDetectionModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 2500));
    const diseaseResult = mockDiseaseAnalysis();
    setResult(diseaseResult);
    setAnalyzing(false);
  };

  const handleSaveResult = () => {
    if (result && onResultSaved) {
      onResultSaved(result);
    }
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setImage(null);
    setFileName('');
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-growth flex items-center justify-center">
              <Bug className="w-4 h-4 text-primary-foreground" />
            </div>
            AI Crop Disease Detection
          </DialogTitle>
          <DialogDescription>
            Upload a photo of your crop leaf — your AI Farm Doctor will diagnose it instantly.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            {/* Upload Zone */}
            {!image ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-foreground">Drag & drop a crop photo here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    <Upload className="w-4 h-4 mr-1" /> Upload Photo
                  </Button>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}>
                    <Camera className="w-4 h-4 mr-1" /> Take Photo
                  </Button>
                </div>
              </div>
            ) : (
              /* Preview */
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={image} alt="Crop preview" className="w-full max-h-64 object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={handleReset}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                </div>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {/* Analyze Button */}
            {image && (
              <Button
                className="w-full"
                variant="forest"
                size="lg"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    AI analyzing your crop...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5 mr-2" />
                    Analyze Crop Health
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          /* Results */
          <div className="space-y-4">
            <DiseaseResultsCard result={result} imageUrl={image} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Scan Another
              </Button>
              <Button variant="forest" className="flex-1" onClick={handleSaveResult}>
                Save to Alerts
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
