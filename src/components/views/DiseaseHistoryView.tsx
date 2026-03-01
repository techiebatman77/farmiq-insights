import { Bug, TrendingUp, Shield, AlertTriangle, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { diseaseTrendData, DiseaseResult } from '@/lib/diseaseData';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const severityColors = {
  Low: 'bg-growth text-primary-foreground',
  Medium: 'bg-warning text-primary-foreground',
  High: 'bg-danger text-primary-foreground',
};

export function DiseaseHistoryView() {
  const { diseaseHistory } = useApp();

  const totalScans = diseaseHistory.length;
  const highSeverity = diseaseHistory.filter(d => d.severity === 'High').length;
  const avgConfidence = totalScans > 0
    ? (diseaseHistory.reduce((s, d) => s + d.confidence, 0) / totalScans).toFixed(1)
    : '0';

  // Count by crop
  const cropCounts: Record<string, number> = {};
  diseaseHistory.forEach(d => { cropCounts[d.crop] = (cropCounts[d.crop] || 0) + 1; });
  const cropData = Object.entries(cropCounts).map(([crop, count]) => ({ crop, count }));

  return (
    <>
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <h1 className="text-3xl font-semibold mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-growth flex items-center justify-center">
            <Bug className="w-5 h-5 text-primary-foreground" />
          </div>
          Disease Detection History
        </h1>
        <p className="text-muted-foreground">Your AI Farm Doctor's diagnosis records and trends.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Scans" value={totalScans.toString()} icon={Bug} iconColor="bg-growth" delay={100} />
        <StatCard title="High Severity" value={highSeverity.toString()} icon={AlertTriangle} iconColor="bg-danger" delay={150} />
        <StatCard title="Avg Confidence" value={`${avgConfidence}%`} icon={TrendingUp} iconColor="bg-sky" delay={200} />
        <StatCard title="Crops Scanned" value={Object.keys(cropCounts).length.toString()} icon={Leaf} iconColor="bg-forest" delay={250} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Disease Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Detection Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={diseaseTrendData}>
                <defs>
                  <linearGradient id="diseaseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0 72% 51%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0 72% 51%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(120 45% 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(120 45% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="healthy" stroke="hsl(120 45% 45%)" fill="url(#healthyGrad)" name="Healthy" />
                <Area type="monotone" dataKey="detections" stroke="hsl(0 72% 51%)" fill="url(#diseaseGrad)" name="Diseased" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disease by Crop */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detections by Crop</CardTitle>
          </CardHeader>
          <CardContent>
            {cropData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(152 45% 22%)" radius={[4, 4, 0, 0]} name="Detections" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
                <p>No scans yet. Use "Diagnose Crop" to start!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Recent Diagnoses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diseaseHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No diagnoses yet. Upload a crop photo to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {diseaseHistory.map((d) => (
                <div key={d.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bug className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-foreground">{d.diseaseName}</p>
                      <Badge className={cn('text-xs', severityColors[d.severity])}>{d.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.crop} · {d.confidence}% confidence</p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {new Date(d.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
