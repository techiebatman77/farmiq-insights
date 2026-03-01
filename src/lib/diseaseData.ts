export interface DiseaseResult {
  id: string;
  diseaseName: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  crop: string;
  description: string;
  treatment: string;
  prevention: string;
  timestamp: Date;
}

const diseases = [
  {
    diseaseName: 'Rice Blast',
    crop: 'Rice',
    description: 'Fungal disease caused by Magnaporthe oryzae. Diamond-shaped lesions on leaves with grey centers.',
    treatment: 'Spray Tricyclazole 75WP @ 0.6g/liter or Isoprothiolane 40EC @ 1.5ml/liter early morning.',
    prevention: 'Use resistant varieties (Jyothi, Kanchana). Avoid excess nitrogen. Maintain proper spacing.',
  },
  {
    diseaseName: 'Coconut Bud Rot',
    crop: 'Coconut',
    description: 'Caused by Phytophthora palmivora. Yellowing of innermost leaves, rotting of bud, foul smell.',
    treatment: 'Remove affected tissue. Apply Bordeaux paste on cut surface. Pour Copper Oxychloride 2g/liter into crown.',
    prevention: 'Ensure proper drainage. Apply Bordeaux mixture prophylactically during monsoon.',
  },
  {
    diseaseName: 'Rubber Leaf Spot',
    crop: 'Rubber',
    description: 'Corynespora leaf fall disease. Irregular brown spots with concentric rings on mature leaves.',
    treatment: 'Spray Mancozeb 75WP @ 3g/liter or Carbendazim 50WP @ 1g/liter at 15-day intervals.',
    prevention: 'Prune affected branches. Maintain canopy ventilation. Use tolerant clones (RRII 105).',
  },
  {
    diseaseName: 'Cardamom Mosaic Virus',
    crop: 'Cardamom',
    description: 'Viral disease spread by aphid vectors. Mosaic mottling and chlorotic streaks on leaves.',
    treatment: 'No direct cure. Remove infected plants immediately. Spray Dimethoate 30EC @ 2ml/liter to control aphid vectors.',
    prevention: 'Use virus-free planting material. Maintain field sanitation. Control aphid populations.',
  },
  {
    diseaseName: 'Pepper Quick Wilt',
    crop: 'Black Pepper',
    description: 'Caused by Phytophthora capsici. Sudden wilting, leaf drop, and root rot within days.',
    treatment: 'Drench soil with Potassium Phosphonate 2ml/liter. Apply Trichoderma enriched compost at base.',
    prevention: 'Improve drainage. Apply lime to maintain soil pH 6.0-6.5. Use Panniyur-1 rootstock.',
  },
  {
    diseaseName: 'Banana Sigatoka Leaf Spot',
    crop: 'Banana',
    description: 'Yellow Sigatoka caused by Mycosphaerella musicola. Yellow streaks turning brown with grey centers.',
    treatment: 'Spray Propiconazole 25EC @ 1ml/liter. Remove and destroy affected leaves immediately.',
    prevention: 'Proper spacing between plants. Adequate drainage. De-leaf regularly during rainy season.',
  },
  {
    diseaseName: 'Tea Blister Blight',
    crop: 'Tea',
    description: 'Caused by Exobasidium vexans. Circular blister-like lesions on young leaves with white spore mass below.',
    treatment: 'Spray Copper Oxychloride 50WP @ 2g/liter or Hexaconazole 5EC @ 2ml/liter every 7 days.',
    prevention: 'Avoid shade during wet season. Pluck affected shoots. Maintain field hygiene.',
  },
  {
    diseaseName: 'Arecanut Koleroga',
    crop: 'Arecanut',
    description: 'Fruit rot caused by Phytophthora meadii. Water-soaked lesions on nuts, premature fruit drop.',
    treatment: 'Spray Bordeaux mixture 1% before monsoon onset. Apply Copper Oxychloride 3g/liter on bunches.',
    prevention: 'Remove fallen nuts promptly. Improve air circulation. Prophylactic spraying before June.',
  },
];

export function mockDiseaseAnalysis(): DiseaseResult {
  const disease = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = 85 + Math.random() * 14; // 85-99%
  const severities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  return {
    id: `disease-${Date.now()}`,
    ...disease,
    confidence: Math.round(confidence * 10) / 10,
    severity,
    timestamp: new Date(),
  };
}

// Historical data for disease trend chart
export const diseaseTrendData = [
  { month: 'Sep', detections: 3, healthy: 12 },
  { month: 'Oct', detections: 5, healthy: 10 },
  { month: 'Nov', detections: 8, healthy: 7 },
  { month: 'Dec', detections: 4, healthy: 11 },
  { month: 'Jan', detections: 2, healthy: 13 },
  { month: 'Feb', detections: 6, healthy: 9 },
  { month: 'Mar', detections: 3, healthy: 12 },
];
