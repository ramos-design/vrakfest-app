import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Award } from 'lucide-react';
import { EventCountdown } from './EventCountdown';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
}
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle
}: StatCardProps) {
  const renderValue = () => {
    if (typeof value === 'string' && value.includes('/')) {
      const [current, max] = value.split('/');
      return (
        <span className="text-2xl font-bold">
          <span className="text-yellow-400">{current}</span>
          <span className="text-muted-foreground">/{max}</span>
        </span>
      );
    }
    return <span className="text-2xl font-bold text-racing-white">{value}</span>;
  };

  return <div className="flex items-center justify-between">
      <div>
        {renderValue()}
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-racing-black" />
      </div>
    </div>;
}
interface DashboardStatsProps {
  racerCount: number;
  activeRacerCount: number;
  tournamentProgress?: number;
}
export function DashboardStats({
  racerCount,
  activeRacerCount,
  tournamentProgress = 0
}: DashboardStatsProps) {
  return <div className="space-y-6">
      <Card className="racing-card shadow-card">
        <CardHeader>
          <CardTitle className="font-semibold racing-gradient-text text-2xl">VrakFest závody 2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatCard title="Completed VrakFests" value={3} subtitle="VrakFestů se již jelo" icon={Trophy} color="racing-accent" />
          <StatCard title="Remaining Events" value={1} subtitle="VrakFest událostí zbývá" icon={Target} color="racing-accent" />
          <StatCard title="Current Racers" value="52/80" subtitle="aktuálně přihlášených jezdců" icon={Award} color="racing-accent" />
          <StatCard title="Total Racers" value={racerCount} subtitle="celkový počet jezdců v roce" icon={Award} color="racing-accent" />
        </CardContent>
      </Card>

      <EventCountdown />
    </div>;
}