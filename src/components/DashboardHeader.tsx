import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  racerCount: number;
  activeRacerCount: number;
  onReset: () => void;
}

export function DashboardHeader({ racerCount, activeRacerCount, onReset }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2" />
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for a race, car or racer" 
              className="pl-10 w-80 bg-muted/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="vrakfest">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Choose a car" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vrakfest">VrakFest Car</SelectItem>
              <SelectItem value="other">Other Car</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {racerCount}/100
            </Badge>
            <Badge className="bg-green-600 text-white font-mono">
              {activeRacerCount} active
            </Badge>
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
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