import { useState, useRef, useCallback } from 'react';
import { Bug, ShieldCheck, Phone, MessageCircle, IndianRupee, FlaskConical, AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft, Upload, Camera, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { TacticalCorners } from '@/components/ui/TopographicOverlay';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import coconutImg from '@/assets/coconut-leaf-wilt.jpg';
import rubberImg from '@/assets/rubber-leaf-spot.jpg';
import paddyImg from '@/assets/paddy-blast.jpg';
import cardamomImg from '@/assets/cardamom-thrips.jpg';

// --- Types ---
interface CropDisease {
  crop: string;
  cropIcon: string;
  image: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  treatment: string;
  cost: string;
  dealer: string;
  dealerPhone: string;
  description: string;
  prevention: string;
}

interface AIDiagnosis {
  is_plant: boolean;
  disease_detected: boolean;
  confidence: number;
  disease_name: string;
  crop: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string;
  prevention: string;
  estimated_cost: string;
}

// --- Static data ---
const cropDiseases: CropDisease[] = [
  {
    crop: 'Coconut', cropIcon: '🥥', image: coconutImg,
    disease: 'Coconut Leaf Wilt', confidence: 94, severity: 'High',
    treatment: 'Copper Oxychloride 3g/liter — spray on affected fronds early morning',
    cost: '₹350', dealer: 'Kerala Agro Chemicals, Thrissur', dealerPhone: '+919847123456',
    description: 'Phytoplasma infection causing flaccidity and yellowing of leaves. Spread by lace bugs.',
    prevention: 'Remove severely affected palms. Control lace bug vectors. Apply neem cake at the base.',
  },
  {
    crop: 'Rubber', cropIcon: '🌿', image: rubberImg,
    disease: 'Rubber Leaf Spot', confidence: 92, severity: 'Medium',
    treatment: 'Mancozeb 75WP @ 2g/liter — spray at 15-day intervals during monsoon',
    cost: '₹450', dealer: 'Rubber Board Supply, Kottayam', dealerPhone: '+919847123456',
    description: 'Cercospora leaf disease causing irregular brown spots with concentric rings.',
    prevention: 'Prune affected branches. Use tolerant clones. Maintain canopy ventilation.',
  },
  {
    crop: 'Paddy', cropIcon: '🌾', image: paddyImg,
    disease: 'Paddy Blast', confidence: 96, severity: 'High',
    treatment: 'Tricyclazole 75WP @ 0.6g/liter — spray early morning on affected patches',
    cost: '₹280', dealer: 'Krishi Bhavan, Alappuzha', dealerPhone: '+919847123456',
    description: 'Fungal disease by Magnaporthe oryzae. Diamond-shaped lesions with grey centers.',
    prevention: 'Use resistant varieties. Avoid excess nitrogen. Maintain proper spacing.',
  },
  {
    crop: 'Cardamom', cropIcon: '🫛', image: cardamomImg,
    disease: 'Cardamom Thrips', confidence: 89, severity: 'Medium',
    treatment: 'Imidacloprid 17.8SL @ 0.3ml/liter — spray on new shoots and panicles',
    cost: '₹520', dealer: 'Spices Board Depot, Idukki', dealerPhone: '+919847123456',
    description: 'Sciothrips cardamomi causing silvery streaks on leaves and curling of shoots.',
    prevention: 'Maintain shade. Conserve natural predators. Avoid excess fertilization during monsoon.',
  },
];

const severityConfig = {
  Low: { color: 'bg-primary/20 text-primary', icon: CheckCircle },
  Medium: { color: 'bg-warning/20 text-warning', icon: AlertTriangle },
  High: { color: 'bg-danger/20 text-danger', icon: ShieldAlert },
};

// --- Sub-components ---
function DiseaseDetailView({ crop, onBack, onSave }: { crop: CropDisease; onBack: () => void; onSave: (c: CropDisease) => void }) {
  const sev = severityConfig[crop.severity];
  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={onBack} className="gap-2 font-mono text-xs uppercase tracking-wider">
        <ArrowLeft className="w-3 h-3" /> Back to Samples
      </Button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <TacticalCorners>
            <img src={crop.image} alt={crop.disease} className="w-full h-64 object-cover border border-border" />
          </TacticalCorners>
        </div>
        <div className="md:w-2/3 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{crop.cropIcon}</span>
            <div>
              <h2 className="font-display text-2xl text-foreground">{crop.disease}</h2>
              <p className="coord-text mt-1">{crop.crop}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('text-[10px] font-mono uppercase px-2 py-0.5', sev.color)}>
              <sev.icon className="w-3 h-3 mr-1" />{crop.severity}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-border/50">
              Confidence: {crop.confidence}%
            </Badge>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-muted-foreground uppercase tracking-wider">Detection Confidence</span>
              <span className="text-primary">{crop.confidence}%</span>
            </div>
            <Progress value={crop.confidence} className="h-1.5" />
          </div>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">{crop.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" strokeWidth={1.5} /> Treatment
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs font-mono text-foreground">{crop.treatment}</p></CardContent>
        </Card>
        <Card className="border-canyon/20 bg-canyon/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-canyon" strokeWidth={1.5} /> Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-display text-foreground">{crop.cost}</p>
            <p className="coord-text mt-1">per application / acre</p>
          </CardContent>
        </Card>
        <Card className="border-sky/20 bg-sky/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky" strokeWidth={1.5} /> Dealer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-mono text-foreground">{crop.dealer}</p>
            <p className="text-xs font-mono text-foreground">+91-9847123456</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild className="h-7 text-[10px] font-mono uppercase">
                <a href={`tel:${crop.dealerPhone}`}><Phone className="w-3 h-3 mr-1" /> Call</a>
              </Button>
              <Button size="sm" asChild className="h-7 text-[10px] font-mono uppercase bg-primary text-primary-foreground">
                <a href={`https://wa.me/${crop.dealerPhone.replace('+', '')}?text=Hi, I need ${crop.treatment.split('—')[0].trim()} for ${crop.disease} treatment.`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sage/20 bg-sage/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage" strokeWidth={1.5} /> Prevention
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs font-mono text-muted-foreground leading-relaxed">{crop.prevention}</p></CardContent>
        </Card>
      </div>
      <div className="flex gap-2">
        <Button className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider" onClick={() => onSave(crop)}>Save to Alerts</Button>
        <Button variant="outline" className="font-mono text-xs uppercase tracking-wider" onClick={onBack}>Scan Another</Button>
      </div>
    </div>
  );
}

function AIResultView({ diagnosis, imageUrl, onBack, onSave }: { diagnosis: AIDiagnosis; imageUrl: string; onBack: () => void; onSave: () => void }) {
  const sev = severityConfig[diagnosis.severity] || severityConfig['Low'];
  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={onBack} className="gap-2 font-mono text-xs uppercase tracking-wider">
        <ArrowLeft className="w-3 h-3" /> Back
      </Button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <TacticalCorners>
            <img src={imageUrl} alt="Uploaded crop" className="w-full h-64 object-cover border border-border" />
          </TacticalCorners>
        </div>
        <div className="md:w-2/3 space-y-4">
          <div>
            <h2 className="font-display text-2xl text-foreground">{diagnosis.disease_name}</h2>
            <p className="coord-text mt-1">{diagnosis.crop}</p>
          </div>
          {!diagnosis.is_plant && (
            <div className="stat-card border-warning/30 bg-warning/10 p-3">
              <p className="text-xs font-mono text-foreground">⚠️ This image may not contain a recognizable plant. Results may be unreliable.</p>
            </div>
          )}
          {!diagnosis.disease_detected && diagnosis.is_plant && (
            <div className="stat-card border-primary/30 bg-primary/10 p-3">
              <p className="text-xs font-mono text-foreground">✅ No disease detected — your crop appears healthy!</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge className={cn('text-[10px] font-mono uppercase px-2 py-0.5', sev.color)}>
              <sev.icon className="w-3 h-3 mr-1" />{diagnosis.severity}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-border/50">
              Confidence: {Math.round(diagnosis.confidence)}%
            </Badge>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-muted-foreground uppercase tracking-wider">Detection Confidence</span>
              <span className="text-primary">{Math.round(diagnosis.confidence)}%</span>
            </div>
            <Progress value={diagnosis.confidence} className="h-1.5" />
          </div>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">{diagnosis.description}</p>
        </div>
      </div>
      {diagnosis.disease_detected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-primary" strokeWidth={1.5} /> Treatment
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs font-mono text-foreground">{diagnosis.treatment}</p></CardContent>
          </Card>
          <Card className="border-canyon/20 bg-canyon/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-canyon" strokeWidth={1.5} /> Est. Cost
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-xl font-display text-foreground">{diagnosis.estimated_cost}</p></CardContent>
          </Card>
          <Card className="border-sage/20 bg-sage/5 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sage" strokeWidth={1.5} /> Prevention
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-xs font-mono text-muted-foreground leading-relaxed">{diagnosis.prevention}</p></CardContent>
          </Card>
        </div>
      )}
      <div className="flex gap-2">
        {diagnosis.disease_detected && (
          <Button className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider" onClick={onSave}>Save to Alerts</Button>
        )}
        <Button variant="outline" className="font-mono text-xs uppercase tracking-wider" onClick={onBack}>Scan Another</Button>
      </div>
    </div>
  );
}

// --- Main component ---
export function FarmDoctorView() {
  const [selectedCrop, setSelectedCrop] = useState<CropDisease | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMime, setUploadedMime] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIDiagnosis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { addDiseaseResult } = useApp();

  const handleSaveToAlerts = (crop: CropDisease) => {
    addDiseaseResult({
      id: `demo-${Date.now()}`,
      diseaseName: crop.disease,
      confidence: crop.confidence,
      severity: crop.severity,
      crop: crop.crop,
      description: crop.description,
      treatment: crop.treatment,
      prevention: crop.prevention,
      timestamp: new Date(),
    });
    toast.success('Saved to alerts!');
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }
    setUploadedMime(file.type);
    setAiResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    setAnalyzing(true);
    try {
      // Extract base64 data without prefix
      const base64Data = uploadedImage.includes(',') ? uploadedImage.split(',')[1] : uploadedImage;

      const { data, error } = await supabase.functions.invoke('diagnose-crop', {
        body: { imageBase64: base64Data, mimeType: uploadedMime },
      });

      if (error) {
        console.error('Diagnosis error:', error);
        toast.error('Analysis failed. Please try again.');
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setAiResult(data.diagnosis);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveAIResult = () => {
    if (!aiResult) return;
    addDiseaseResult({
      id: `ai-${Date.now()}`,
      diseaseName: aiResult.disease_name,
      confidence: aiResult.confidence,
      severity: aiResult.severity,
      crop: aiResult.crop,
      description: aiResult.description,
      treatment: aiResult.treatment,
      prevention: aiResult.prevention,
      timestamp: new Date(),
    });
    toast.success('Saved to alerts!');
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setUploadedMime('');
    setAiResult(null);
  };

  // AI result view
  if (aiResult && uploadedImage) {
    return <AIResultView diagnosis={aiResult} imageUrl={uploadedImage} onBack={resetUpload} onSave={handleSaveAIResult} />;
  }

  // Static sample detail view
  if (selectedCrop) {
    return <DiseaseDetailView crop={selectedCrop} onBack={() => setSelectedCrop(null)} onSave={handleSaveToAlerts} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-primary/50 flex items-center justify-center">
          <Bug className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground">AI FARM DOCTOR</h1>
          <p className="coord-text mt-1">Upload a photo or click a sample for AI diagnosis</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="stat-card border-primary/20 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" strokeWidth={1.5} />
          Upload Crop Photo for AI Analysis
        </h3>

        {!uploadedImage ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded p-8 text-center transition-all cursor-pointer',
              dragOver ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30 hover:bg-primary/5'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-mono text-foreground">Drag & drop a crop photo here</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">or click to browse • JPG, PNG under 10MB</p>
            <div className="flex gap-2 justify-center mt-4">
              <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                <Upload className="w-3 h-3 mr-1" /> Browse
              </Button>
              <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase" onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}>
                <Camera className="w-3 h-3 mr-1" /> Camera
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded overflow-hidden border border-border/50">
              <img src={uploadedImage} alt="Uploaded crop" className="w-full max-h-64 object-cover" />
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm h-7 w-7" onClick={resetUpload}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing with AI...</>
              ) : (
                <><Bug className="w-4 h-4 mr-2" /> Analyze Crop Health</>
              )}
            </Button>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/50" />
        <span className="coord-text">or try a sample</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Sample cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cropDiseases.map((crop) => {
          const sev = severityConfig[crop.severity];
          return (
            <div key={crop.crop} className="stat-card p-0 overflow-hidden cursor-pointer group hover:border-primary/30 transition-all" onClick={() => setSelectedCrop(crop)}>
              <div className="relative h-44 overflow-hidden">
                <img src={crop.image} alt={`${crop.crop} disease`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-2 right-2">
                  <Badge className={cn('text-[9px] font-mono uppercase', sev.color)}>
                    <sev.icon className="w-2.5 h-2.5 mr-0.5" />{crop.severity}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-3 right-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{crop.cropIcon}</span>
                    <div>
                      <p className="text-sm font-display text-foreground">{crop.disease}</p>
                      <p className="coord-text">{crop.crop} • {crop.confidence}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground truncate">{crop.treatment.split('—')[0].trim()}</span>
                <span className="text-xs font-display text-foreground">{crop.cost}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
