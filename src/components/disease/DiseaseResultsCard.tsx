import { AlertTriangle, CheckCircle, Shield, Beaker, ShieldAlert, ThermometerSun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiseaseResult } from '@/lib/diseaseData';
import { cn } from '@/lib/utils';

interface DiseaseResultsCardProps {
  result: DiseaseResult;
  imageUrl?: string | null;
}

const severityConfig = {
  Low: { color: 'bg-growth text-primary-foreground', icon: CheckCircle, label: 'Low Severity' },
  Medium: { color: 'bg-warning text-primary-foreground', icon: AlertTriangle, label: 'Medium Severity' },
  High: { color: 'bg-danger text-primary-foreground', icon: ShieldAlert, label: 'High Severity' },
};

export function DiseaseResultsCard({ result, imageUrl }: DiseaseResultsCardProps) {
  const sev = severityConfig[result.severity];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header with image */}
      <div className="flex gap-4">
        {imageUrl && (
          <img src={imageUrl} alt="Scanned crop" className="w-20 h-20 rounded-lg object-cover border border-border" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground">{result.diseaseName}</h3>
          <p className="text-sm text-muted-foreground">{result.crop}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={cn('text-xs', sev.color)}>
              <sev.icon className="w-3 h-3 mr-1" />
              {sev.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">AI Confidence</span>
            <span className="text-sm font-bold text-primary">{result.confidence}%</span>
          </div>
          <Progress value={result.confidence} className="h-2" />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <ThermometerSun className="w-4 h-4 text-warning" />
            Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">{result.description}</p>
        </CardContent>
      </Card>

      {/* Treatment */}
      <Card className="border-growth/30 bg-growth/5">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Beaker className="w-4 h-4 text-growth" />
            Recommended Treatment
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-foreground font-medium">{result.treatment}</p>
        </CardContent>
      </Card>

      {/* Prevention */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky" />
            Prevention Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">{result.prevention}</p>
        </CardContent>
      </Card>
    </div>
  );
}
