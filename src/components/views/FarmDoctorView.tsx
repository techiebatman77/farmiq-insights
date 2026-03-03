import { useState } from 'react';
import { Bug, Leaf, ShieldCheck, Phone, MessageCircle, IndianRupee, FlaskConical, AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
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
    crop: 'Coconut',
    cropIcon: '🥥',
    image: coconutImg,
    disease: 'Coconut Leaf Wilt',
    confidence: 94,
    severity: 'High',
    treatment: 'Copper Oxychloride 3g/liter — spray on affected fronds early morning',
    cost: '₹350',
    dealer: 'Kerala Agro Chemicals, Thrissur',
    dealerPhone: '+919847123456',
    description: 'Phytoplasma infection causing flaccidity and yellowing of leaves. Spread by lace bugs (Stephanitis typica).',
    prevention: 'Remove severely affected palms. Control lace bug vectors. Apply neem cake at the base.',
  },
  {
    crop: 'Rubber',
    cropIcon: '🌿',
    image: rubberImg,
    disease: 'Rubber Leaf Spot',
    confidence: 92,
    severity: 'Medium',
    treatment: 'Mancozeb 75WP @ 2g/liter — spray at 15-day intervals during monsoon',
    cost: '₹450',
    dealer: 'Rubber Board Supply, Kottayam',
    dealerPhone: '+919847123456',
    description: 'Cercospora leaf disease causing irregular brown spots with concentric rings on mature rubber leaves.',
    prevention: 'Prune affected branches. Use tolerant clones (RRII 105). Maintain canopy ventilation.',
  },
  {
    crop: 'Paddy',
    cropIcon: '🌾',
    image: paddyImg,
    disease: 'Paddy Blast',
    confidence: 96,
    severity: 'High',
    treatment: 'Tricyclazole 75WP @ 0.6g/liter — spray early morning on affected patches',
    cost: '₹280',
    dealer: 'Krishi Bhavan, Alappuzha',
    dealerPhone: '+919847123456',
    description: 'Fungal disease caused by Magnaporthe oryzae. Diamond-shaped lesions with grey centers on leaves.',
    prevention: 'Use resistant varieties (Jyothi, Kanchana). Avoid excess nitrogen. Maintain proper spacing.',
  },
  {
    crop: 'Cardamom',
    cropIcon: '🫛',
    image: cardamomImg,
    disease: 'Cardamom Thrips',
    confidence: 89,
    severity: 'Medium',
    treatment: 'Imidacloprid 17.8SL @ 0.3ml/liter — spray on new shoots and panicles',
    cost: '₹520',
    dealer: 'Spices Board Depot, Idukki',
    dealerPhone: '+919847123456',
    description: 'Sciothrips cardamomi causing silvery streaks on leaves and curling of tender shoots.',
    prevention: 'Maintain shade. Conserve natural predators. Avoid excess fertilization during monsoon.',
  },
];

const severityConfig = {
  Low: { color: 'bg-growth text-primary-foreground', icon: CheckCircle },
  Medium: { color: 'bg-warning text-primary-foreground', icon: AlertTriangle },
  High: { color: 'bg-danger text-primary-foreground', icon: ShieldAlert },
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
        <Button variant="ghost" onClick={() => setSelectedCrop(null)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Samples
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img src={selectedCrop.image} alt={selectedCrop.disease} className="w-full h-64 object-cover rounded-xl border border-border" />
          </div>
          <div className="md:w-2/3 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedCrop.cropIcon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedCrop.disease}</h2>
                <p className="text-muted-foreground">{selectedCrop.crop}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn('text-sm px-3 py-1', sev.color)}>
                <sev.icon className="w-4 h-4 mr-1" />
                {selectedCrop.severity} Severity
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                AI Confidence: {selectedCrop.confidence}%
              </Badge>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Detection Confidence</span>
                <span className="font-bold text-primary">{selectedCrop.confidence}%</span>
              </div>
              <Progress value={selectedCrop.confidence} className="h-3" />
            </div>
            <p className="text-muted-foreground">{selectedCrop.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-growth/30 bg-growth/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-growth" />
                🩹 Recommended Treatment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-foreground">{selectedCrop.treatment}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-warning" />
                💰 Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{selectedCrop.cost}</p>
              <p className="text-sm text-muted-foreground mt-1">per application / acre</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="w-5 h-5 text-sky" />
                📞 Nearest Dealer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium text-foreground">{selectedCrop.dealer}</p>
              <p className="text-sm text-muted-foreground">+91-9847123456</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${selectedCrop.dealerPhone}`}>
                    <Phone className="w-4 h-4 mr-1" /> Call
                  </a>
                </Button>
                <Button size="sm" variant="forest" asChild>
                  <a href={`https://wa.me/${selectedCrop.dealerPhone.replace('+', '')}?text=Hi, I need ${selectedCrop.treatment.split('—')[0].trim()} for ${selectedCrop.disease} treatment.`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                🛡️ Prevention Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{selectedCrop.prevention}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button variant="forest" onClick={() => handleSaveToAlerts(selectedCrop)}>
            Save to Alerts
          </Button>
          <Button variant="outline" onClick={() => setSelectedCrop(null)}>
            Scan Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
          <Bug className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">🚨 AI Farm Doctor</h1>
          <p className="text-muted-foreground">Click a sample image to get instant AI-powered diagnosis for Kerala crops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cropDiseases.map((crop) => {
          const sev = severityConfig[crop.severity];
          return (
            <Card key={crop.crop} className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 group" onClick={() => setSelectedCrop(crop)}>
              <div className="relative h-48 overflow-hidden">
                <img src={crop.image} alt={`${crop.crop} disease sample`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className={cn('text-xs', sev.color)}>
                    <sev.icon className="w-3 h-3 mr-1" />
                    {crop.severity}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{crop.cropIcon}</span>
                    <div>
                      <p className="font-semibold text-foreground text-lg">{crop.disease}</p>
                      <p className="text-sm text-muted-foreground">{crop.crop} • {crop.confidence}% confidence</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FlaskConical className="w-4 h-4" />
                    <span className="truncate">{crop.treatment.split('—')[0].trim()}</span>
                  </div>
                  <span className="font-bold text-foreground">{crop.cost}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 py-4">
          <Leaf className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> You can also upload your own crop photos using the <strong>"Diagnose Crop"</strong> button in the top navbar for real-time AI analysis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
