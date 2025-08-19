import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Award } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-racing-white">{value}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-racing-black" />
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  racerCount: number;
  activeRacerCount: number;
  tournamentProgress?: number;
}

export function DashboardStats({ racerCount, activeRacerCount, tournamentProgress = 0 }: DashboardStatsProps) {
  return (
    <div className="space-y-6">
      <Card className="racing-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold racing-gradient-text">VrakFest Racing Tournament ™</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatCard
            title="Championships"
            value={tournamentProgress}
            subtitle="Championships"
            icon={Trophy}
            color="racing-accent"
          />
          <StatCard
            title="Active Racers"
            value={activeRacerCount}
            subtitle="Active Racers"
            icon={Target}
            color="racing-accent"
          />
          <StatCard
            title="Total Racers"
            value={racerCount}
            subtitle="Total Registered"
            icon={Award}
            color="racing-accent"
          />
        </CardContent>
      </Card>

      <div className="racing-gradient rounded-lg p-8 text-center shadow-glow">
        <div className="text-racing-black">
          <h2 className="text-2xl font-bold mb-4">VrakFest Racing™</h2>
          <div className="w-full h-32 bg-racing-black/10 rounded-lg flex items-center justify-center mb-4">
            <div className="text-6xl">🏎️</div>
          </div>
          <p className="text-sm font-semibold">Ready for the next race</p>
        </div>
      </div>
    </div>
  );
}