import { Home, Users, Trophy, BarChart3, Settings, Calculator } from 'lucide-react';
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

  const menuItems = [
    { id: 'jezdci', label: 'Home', icon: Home },
    { id: 'turnaj', label: 'Garage', icon: Users },
    { id: 'kontrola', label: 'Service Menu', icon: Trophy },
    { id: 'statistiky', label: 'Racers', icon: BarChart3 },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'settings', label: 'Settings', icon: Settings },
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