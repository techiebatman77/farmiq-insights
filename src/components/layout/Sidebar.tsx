import { useState } from 'react';
import { 
  Map, Sprout, BarChart3, Users, Settings, Stethoscope, LogOut,
  ChevronLeft, ChevronRight, Bell, Cloud, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { SettingsModal } from '@/components/modals/SettingsModal';

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: Map, label: 'Map', id: 'dashboard' },
  { icon: Sprout, label: 'Crops', id: 'health' },
  { icon: BarChart3, label: 'Analytics', id: 'market' },
  { icon: Cloud, label: 'Weather', id: 'weather' },
  { icon: Stethoscope, label: 'Doctor', id: 'farm-doctor' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: Users, label: 'Community', id: 'map' },
  { icon: Bell, label: 'Alerts', id: 'alerts', badge: 3 },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed: externalCollapsed, onCollapsedChange }: SidebarProps) {
  const { activeTab, setActiveTab } = useApp();
  const { logout } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const collapsed = externalCollapsed ?? internalCollapsed;
  
  const handleCollapse = () => {
    const newValue = !collapsed;
    if (onCollapsedChange) onCollapsedChange(newValue);
    else setInternalCollapsed(newValue);
  };

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r border-border/30 flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-56"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-primary/50 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="font-display text-sm text-foreground tracking-wider">AGRISMART</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative border-l-2",
                activeTab === item.id
                  ? "border-l-primary bg-primary/5 text-primary"
                  : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && (
                <>
                  <span className="text-xs font-mono uppercase tracking-widest animate-fade-in">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto w-4 h-4 bg-danger text-foreground text-[9px] font-mono flex items-center justify-center animate-fade-in">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-2 w-3 h-3 bg-danger rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/30 py-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground transition-all"
          >
            <Settings className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span className="text-xs font-mono uppercase tracking-widest">Settings</span>}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-danger transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span className="text-xs font-mono uppercase tracking-widest">Sign Out</span>}
          </button>
          <Button variant="ghost" size="sm" onClick={handleCollapse} className="w-full justify-center mt-1 h-8">
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </Button>
        </div>
      </aside>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

/* Mobile bottom nav */
export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const items = [
    { icon: Map, label: 'Map', id: 'dashboard' },
    { icon: Sprout, label: 'Crops', id: 'health' },
    { icon: Stethoscope, label: 'Doctor', id: 'farm-doctor' },
    { icon: BarChart3, label: 'Data', id: 'market' },
    { icon: Bell, label: 'Alerts', id: 'alerts' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-md border-t border-border/30 flex items-center justify-around z-50 md:hidden">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
            activeTab === item.id ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-[9px] font-mono uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
