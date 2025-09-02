import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  racerCount: number;
  activeRacerCount: number;
  onReset: () => void;
  currentInfo?: string; // Pro zobrazení aktuálních informací
  userRole?: 'admin' | 'user';
  onRoleChange?: (role: 'admin' | 'user') => void;
}

export function DashboardHeader({ 
  racerCount, 
  activeRacerCount, 
  onReset, 
  currentInfo = "Vítejte v závodní aplikaci",
  userRole = 'admin',
  onRoleChange 
}: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="p-2" />
          
          {/* Informační panel s animovaným textem */}
          <div className="flex-1 max-w-lg h-10 bg-racing-yellow border border-racing-yellow/30 rounded-md overflow-hidden relative">
            <div className="h-full flex items-center">
              <div className="animate-[scroll-right_15s_linear_infinite] text-racing-black font-medium whitespace-nowrap">
                {currentInfo}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={userRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Vyberte roli" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrátor</SelectItem>
              <SelectItem value="user">Běžný uživatel</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {racerCount}/100
            </Badge>
            <Badge className="bg-green-600 text-white font-mono">
              {activeRacerCount} jezdců v závodě
            </Badge>
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>

          <Button variant="ghost" size="sm" title="Nastavení">
            <Settings className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}