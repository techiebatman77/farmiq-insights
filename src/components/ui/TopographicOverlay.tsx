import { cn } from '@/lib/utils';

interface TopographicOverlayProps {
  className?: string;
  opacity?: number;
}

export function TopographicOverlay({ className, opacity = 0.08 }: TopographicOverlayProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <svg
        className="w-full h-full animate-topo-drift"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="0.8" opacity={opacity}>
          {/* Contour lines */}
          <path d="M-50 200 Q150 100 350 180 T650 150 T950 200 T1250 170" />
          <path d="M-50 250 Q200 150 400 230 T700 200 T1000 250 T1250 220" />
          <path d="M-50 320 Q180 220 380 300 T680 270 T980 320 T1250 290" />
          <path d="M-50 400 Q160 300 360 380 T660 350 T960 400 T1250 370" />
          <path d="M-50 470 Q200 380 420 450 T720 420 T1020 470 T1250 440" />
          <path d="M-50 540 Q170 450 370 520 T670 490 T970 540 T1250 510" />
          <path d="M-50 610 Q190 520 390 590 T690 560 T990 610 T1250 580" />
          <path d="M-50 680 Q210 600 430 660 T730 630 T1030 680 T1250 650" />
          
          {/* Elevation markers */}
          <circle cx="350" cy="180" r="3" fill="currentColor" opacity="0.3" />
          <circle cx="650" cy="150" r="3" fill="currentColor" opacity="0.3" />
          <circle cx="950" cy="200" r="3" fill="currentColor" opacity="0.3" />
          <circle cx="400" cy="450" r="3" fill="currentColor" opacity="0.3" />
          <circle cx="700" cy="420" r="3" fill="currentColor" opacity="0.3" />
          
          {/* Dashed secondary contours */}
          <path d="M-50 160 Q130 80 330 140 T630 110 T930 160 T1250 130" strokeDasharray="8 12" strokeWidth="0.4" />
          <path d="M-50 360 Q140 270 340 340 T640 310 T940 360 T1250 330" strokeDasharray="8 12" strokeWidth="0.4" />
          <path d="M-50 570 Q180 490 380 550 T680 520 T980 570 T1250 540" strokeDasharray="8 12" strokeWidth="0.4" />
          <path d="M-50 750 Q220 670 440 730 T740 700 T1040 750 T1250 720" strokeDasharray="8 12" strokeWidth="0.4" />
        </g>
      </svg>
    </div>
  );
}

export function CoordinateMarker({ lat, lon, className }: { lat: string; lon: string; className?: string }) {
  return (
    <span className={cn("coord-text opacity-50", className)}>
      {lat}°N {lon}°E
    </span>
  );
}

export function TacticalCorners({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("tactical-corners", className)}>
      {children}
    </div>
  );
}
