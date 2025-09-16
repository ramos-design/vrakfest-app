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
    <header className="h-12 md:h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-3 md:px-6">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <SidebarTrigger className="p-1.5 md:p-2 flex-shrink-0" />
          
          {/* Informační panel s animovaným textem */}
          <div className="flex-1 max-w-xs md:max-w-lg h-8 md:h-10 bg-racing-yellow border border-racing-yellow/30 rounded-md overflow-hidden relative">
            <div className="h-full flex items-center">
              <div className="animate-[scroll-right_15s_linear_infinite] text-racing-black font-medium whitespace-nowrap text-xs md:text-sm px-2">
                {currentInfo}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <Select value={userRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-24 md:w-40 h-8 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin" className="text-xs md:text-sm">Admin</SelectItem>
              <SelectItem value="user" className="text-xs md:text-sm">User</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 md:gap-2">
            <Badge className="bg-green-600 text-white font-mono text-xs hidden sm:block">
              {activeRacerCount} jezdců v závodě
            </Badge>
            <Badge className="bg-green-600 text-white font-mono text-xs sm:hidden">
              {activeRacerCount}
            </Badge>
          </div>

          <Button variant="ghost" size="sm" className="relative p-1.5 md:p-2 hidden md:flex">
            <Bell className="h-3 w-3 md:h-4 md:w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>

          <Button variant="ghost" size="sm" title="Nastavení" className="p-1.5 md:p-2 hidden lg:flex">
            <Settings className="h-3 w-3 md:h-4 md:w-4" />
          </Button>

          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}