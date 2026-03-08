import { useState } from 'react';
import { Bug, ShieldCheck, Phone, MessageCircle, IndianRupee, FlaskConical, AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { TacticalCorners, CoordinateMarker } from '@/components/ui/TopographicOverlay';
import coconutImg from '@/assets/coconut-leaf-wilt.jpg';
import rubberImg from '@/assets/rubber-leaf-spot.jpg';
import paddyImg from '@/assets/paddy-blast.jpg';
import cardamomImg from '@/assets/cardamom-thrips.jpg';

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

export function FarmDoctorView() {
  const [selectedCrop, setSelectedCrop] = useState<CropDisease | null>(null);
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
  };

  if (selectedCrop) {
    const sev = severityConfig[selectedCrop.severity];
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => setSelectedCrop(null)} className="gap-2 font-mono text-xs uppercase tracking-wider">
          <ArrowLeft className="w-3 h-3" />
          Back to Samples
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <TacticalCorners>
              <img src={selectedCrop.image} alt={selectedCrop.disease} className="w-full h-64 object-cover border border-border" />
            </TacticalCorners>
          </div>
          <div className="md:w-2/3 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedCrop.cropIcon}</span>
              <div>
                <h2 className="font-display text-2xl text-foreground">{selectedCrop.disease}</h2>
                <p className="coord-text mt-1">{selectedCrop.crop}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn('text-[10px] font-mono uppercase px-2 py-0.5', sev.color)}>
                <sev.icon className="w-3 h-3 mr-1" />
                {selectedCrop.severity}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-border/50">
                Confidence: {selectedCrop.confidence}%
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-muted-foreground uppercase tracking-wider">Detection Confidence</span>
                <span className="text-primary">{selectedCrop.confidence}%</span>
              </div>
              <Progress value={selectedCrop.confidence} className="h-1.5" />
            </div>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">{selectedCrop.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-primary" strokeWidth={1.5} />
                Treatment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono text-foreground">{selectedCrop.treatment}</p>
            </CardContent>
          </Card>

          <Card className="border-canyon/20 bg-canyon/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-canyon" strokeWidth={1.5} />
                Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display text-foreground">{selectedCrop.cost}</p>
              <p className="coord-text mt-1">per application / acre</p>
            </CardContent>
          </Card>

          <Card className="border-sky/20 bg-sky/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky" strokeWidth={1.5} />
                Dealer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs font-mono text-foreground">{selectedCrop.dealer}</p>
              <p className="coord-text">+91-9847123456</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild className="h-7 text-[10px] font-mono uppercase">
                  <a href={`tel:${selectedCrop.dealerPhone}`}>
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </a>
                </Button>
                <Button size="sm" asChild className="h-7 text-[10px] font-mono uppercase bg-primary text-primary-foreground">
                  <a href={`https://wa.me/${selectedCrop.dealerPhone.replace('+', '')}?text=Hi, I need ${selectedCrop.treatment.split('—')[0].trim()} for ${selectedCrop.disease} treatment.`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3 h-3 mr-1" /> WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage/20 bg-sage/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sage" strokeWidth={1.5} />
                Prevention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">{selectedCrop.prevention}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider" onClick={() => handleSaveToAlerts(selectedCrop)}>
            Save to Alerts
          </Button>
          <Button variant="outline" className="font-mono text-xs uppercase tracking-wider" onClick={() => setSelectedCrop(null)}>
            Scan Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-primary/50 flex items-center justify-center">
          <Bug className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground">AI FARM DOCTOR</h1>
          <p className="coord-text mt-1">Click a sample for instant AI diagnosis — Kerala crops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cropDiseases.map((crop) => {
          const sev = severityConfig[crop.severity];
          return (
            <div
              key={crop.crop}
              className="stat-card p-0 overflow-hidden cursor-pointer group hover:border-primary/30 transition-all"
              onClick={() => setSelectedCrop(crop)}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={crop.image} alt={`${crop.crop} disease`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-2 right-2">
                  <Badge className={cn('text-[9px] font-mono uppercase', sev.color)}>
                    <sev.icon className="w-2.5 h-2.5 mr-0.5" />
                    {crop.severity}
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

      <div className="stat-card border-primary/20 flex items-center gap-3 py-3 px-4">
        <Bug className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
        <p className="text-[10px] font-mono text-muted-foreground">
          <span className="text-foreground">Tip:</span> Upload your own crop photos using "AI Doctor" in the header for real-time analysis.
        </p>
      </div>
    </div>
  );
}
