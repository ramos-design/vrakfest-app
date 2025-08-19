import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, BarChart3, RotateCcw } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  racerCount: number;
  activeRacerCount: number;
  onReset: () => void;
}

export const Navigation = ({ activeTab, onTabChange, racerCount, activeRacerCount, onReset }: NavigationProps) => {
  const tabs = [
    { id: 'jezdci', label: 'Jezdci', icon: Users },
    { id: 'turnaj', label: 'Turnaj', icon: Trophy },
    { id: 'kontrola', label: 'Kontrola', icon: BarChart3 },
    { id: 'statistiky', label: 'Statistiky', icon: BarChart3 },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold racing-gradient bg-clip-text text-transparent">
                  VrakFest Závody
                </h1>
                <p className="text-sm text-muted-foreground">Systém pro správu závodů</p>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 ${
                    activeTab === tab.id ? 'racing-gradient shadow-racing' : 'hover:bg-muted'
                  } transition-racing`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {racerCount}/100 jezdců
              </Badge>
              <Badge className="bg-green-600 text-white font-mono">
                {activeRacerCount} aktivních
              </Badge>
            </div>
            
            <Button
              variant="outline"
              onClick={onReset}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-racing"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};