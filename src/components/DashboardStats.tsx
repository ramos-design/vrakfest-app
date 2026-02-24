import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Flag, Award } from 'lucide-react';
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
        <span className="text-3xl md:text-4xl font-bebas tracking-wide block">
          <span className="text-racing-yellow">{current}</span>
          <span className="text-white/30 text-2xl">/{max}</span>
        </span>
      );
    }
    return <span className="text-3xl md:text-4xl font-bebas tracking-wide text-white block">{value}</span>;
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 p-4 hover:border-racing-yellow/50 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white/50 font-tech text-xs uppercase tracking-widest mb-1">{title}</h3>
          {renderValue()}
          <p className="text-[10px] text-white/30 font-tech uppercase mt-2 border-t border-white/5 pt-2">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-none flex items-center justify-center ${color} shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
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
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ukončené VrakFesty" value={3} subtitle="MOJE ÚČAST CELKEM" icon={Trophy} color="bg-racing-yellow text-black" />
        <StatCard title="Body v sezóně" value={145} subtitle="AKTUÁLNÍ ROČNÍK 2025" icon={Award} color="bg-white text-black" />
        <StatCard title="Nejlepší výsledek" value="2. MÍSTO" subtitle="VRAKFEST OSTRAVA 2024" icon={Flag} color="bg-racing-yellow text-black" />
        <StatCard title="Průměrné umístění" value="4.8" subtitle="ZE VŠECH ODJETÝCH ZÁVODŮ" icon={Target} color="bg-white text-black" />
      </div>
    </div>
  );
}