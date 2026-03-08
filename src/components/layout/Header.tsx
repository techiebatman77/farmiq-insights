import { Search, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function Header() {
  const { searchQuery, setSearchQuery, setActiveTab } = useApp();
  const { user } = useAuth();
  const [showData, setShowData] = useState(true);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <header className="h-12 bg-background/80 backdrop-blur-md border-b border-border/30 flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Left: coordinates & time */}
      <div className="flex items-center gap-4">
        <span className="coord-text hidden sm:inline">9.93°N 76.26°E</span>
        <span className="coord-text hidden sm:inline">•</span>
        <span className="coord-text hidden sm:inline">{timeStr} IST</span>
        <span className="coord-text hidden sm:inline">•</span>
        <span className="coord-text hidden sm:inline">{dateStr}</span>
      </div>

      {/* Center: search */}
      <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search fields..." 
            className="pl-8 h-8 bg-muted/30 border-border/30 text-xs font-mono focus-visible:ring-1 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right: tactical controls */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setActiveTab('farm-doctor')}
          className="hidden sm:flex gap-1.5 h-7 text-xs font-mono uppercase tracking-wider border-primary/30 text-primary hover:bg-primary/10"
        >
          <Stethoscope className="w-3 h-3" />
          AI Doctor
        </Button>

        {/* Show Data toggle - like "Show Trails" */}
        <button
          onClick={() => setShowData(!showData)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-all",
            showData 
              ? "border-primary/50 bg-primary/10 text-primary" 
              : "border-border/50 text-muted-foreground hover:text-foreground"
          )}
        >
          {showData ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          Show Data
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/30">
          <div className="w-6 h-6 border border-sage/30 flex items-center justify-center">
            <span className="text-[10px] font-mono text-sage">{user?.name?.charAt(0) || 'A'}</span>
          </div>
          <span className="coord-text">{user?.name || 'Farmer'}</span>
        </div>
      </div>
    </header>
  );
}
