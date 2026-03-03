import { useState } from 'react';
import { 
  LayoutDashboard, Map, Cloud, TrendingUp, Calendar, Bell, Settings, Leaf,
  ChevronLeft, ChevronRight, MapPin, Bug, Stethoscope, LogOut
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
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Map, label: 'Fields', id: 'map' },
  { icon: TrendingUp, label: 'Markets', id: 'market' },
  { icon: Cloud, label: 'Weather', id: 'weather' },
  { icon: Stethoscope, label: 'AI Doctor', id: 'farm-doctor' },
  { icon: Leaf, label: 'Crop Health', id: 'health' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: Bell, label: 'Alerts', id: 'alerts', badge: 3 },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed: externalCollapsed, onCollapsedChange }: SidebarProps) {
  const { activeTab, setActiveTab, fields, searchQuery } = useApp();
  const { logout } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const collapsed = externalCollapsed ?? internalCollapsed;
  
  const handleCollapse = () => {
    const newValue = !collapsed;
    if (onCollapsedChange) onCollapsedChange(newValue);
    else setInternalCollapsed(newValue);
  };

  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border/50 flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-semibold text-foreground">FarmIQ</h1>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="font-medium animate-fade-in">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-danger text-primary-foreground text-xs px-2 py-0.5 rounded-full animate-fade-in">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {!collapsed && searchQuery && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2 px-4">Fields ({filteredFields.length})</p>
              {filteredFields.map(field => (
                <button
                  key={field.id}
                  onClick={() => setActiveTab('field-detail')}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{field.name}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </button>
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-danger hover:bg-danger/10"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
          <Button variant="ghost" size="sm" onClick={handleCollapse} className="w-full justify-center">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
          </Button>
        </div>
      </aside>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
