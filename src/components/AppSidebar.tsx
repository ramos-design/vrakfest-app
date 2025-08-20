import { Home, Users, Trophy, BarChart3, Settings, Calendar, Car } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { toast } = useToast();
  const [isEventSettingsOpen, setIsEventSettingsOpen] = useState(false);
  const [eventSettings, setEventSettings] = useState(() => {
    const saved = localStorage.getItem('vrakfest-event-settings');
    return saved ? JSON.parse(saved) : {
      eventName: 'VrakFest Racing Championship',
      eventDate: '2024-12-31',
      eventTime: '18:00',
      ctaText: 'Register Now',
      ctaLink: '#'
    };
  });

  const handleSaveEventSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('vrakfest-event-settings', JSON.stringify(eventSettings));
    setIsEventSettingsOpen(false);
    toast({
      title: "Nastavení uloženo",
      description: "Údaje o události byly úspěšně aktualizovány.",
    });
  };

  const menuItems = [
    { id: 'jezdci', label: 'Nástěnka', icon: Home },
    { id: 'turnaj', label: 'Turnaj', icon: Users },
    { id: 'kontrola', label: 'Kontrola', icon: Trophy },
    { id: 'bodove-poradei', label: 'Bodové pořadí', icon: BarChart3 },
    { id: 'statistiky', label: 'Přehled jezdců', icon: Car },
    { id: 'udalosti', label: 'Události', icon: Calendar },
    { id: 'settings', label: 'Nastavení', icon: Settings },
  ];

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
      <SidebarContent className="racing-card border-r border-racing-yellow/20">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 racing-gradient rounded-lg flex items-center justify-center shadow-racing">
              <span className="text-racing-black font-bold text-sm">V</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold racing-gradient-text">VrakFest</h1>
                <p className="text-xs text-muted-foreground">Racing System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel className="text-muted-foreground px-4">Menu</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.id === 'settings' ? (
                    <Dialog open={isEventSettingsOpen} onOpenChange={setIsEventSettingsOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuButton
                          className={`w-full justify-start gap-3 rounded-lg px-3 py-2 transition-racing ${
                            activeTab === item.id
                              ? 'racing-gradient shadow-racing text-racing-black font-medium'
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-racing-white'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.label}</span>}
                        </SidebarMenuButton>
                      </DialogTrigger>
                      <DialogContent className="racing-card">
                        <DialogHeader>
                          <DialogTitle className="racing-gradient-text">Nastavení události</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEventSettings} className="space-y-4">
                          <div>
                            <Label htmlFor="eventName" className="text-racing-white">Název události</Label>
                            <Input
                              id="eventName"
                              value={eventSettings.eventName}
                              onChange={(e) => setEventSettings(prev => ({ ...prev, eventName: e.target.value }))}
                              className="racing-input"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="eventDate" className="text-racing-white">Datum</Label>
                              <Input
                                id="eventDate"
                                type="date"
                                value={eventSettings.eventDate}
                                onChange={(e) => setEventSettings(prev => ({ ...prev, eventDate: e.target.value }))}
                                className="racing-input"
                              />
                            </div>
                            <div>
                              <Label htmlFor="eventTime" className="text-racing-white">Čas</Label>
                              <Input
                                id="eventTime"
                                type="time"
                                value={eventSettings.eventTime}
                                onChange={(e) => setEventSettings(prev => ({ ...prev, eventTime: e.target.value }))}
                                className="racing-input"
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full racing-btn-primary">
                            Uložit nastavení
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={`w-full justify-start gap-3 rounded-lg px-3 py-2 transition-racing ${
                        activeTab === item.id
                          ? 'racing-gradient shadow-racing text-racing-black font-medium'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-racing-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <div className="mt-auto p-4">
            <div className="bg-racing-black/50 border border-racing-yellow/20 rounded-lg p-3">
              <h3 className="font-medium text-sm racing-gradient-text mb-1">Scheduled Races</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-racing-yellow rounded-full shadow-glow"></div>
                  <span className="text-xs text-muted-foreground">VrakFest 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-racing-white rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Dynamics 22</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-racing-white/50 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Olympics</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}