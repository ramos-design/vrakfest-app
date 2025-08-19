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
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">VrakFest Racing Tournament ™</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatCard
            title="Championships"
            value={tournamentProgress}
            subtitle="Championships"
            icon={Trophy}
            color="bg-red-500"
          />
          <StatCard
            title="Active Racers"
            value={activeRacerCount}
            subtitle="Active Racers"
            icon={Target}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Racers"
            value={racerCount}
            subtitle="Total Registered"
            icon={Award}
            color="bg-gray-500"
          />
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-center">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">VrakFest Racing™</h2>
          <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center mb-4">
            <div className="text-6xl">🏎️</div>
          </div>
          <p className="text-sm opacity-90">Ready for the next race</p>
        </div>
      </div>
    </div>
  );
}