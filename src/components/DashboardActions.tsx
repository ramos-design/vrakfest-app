import { Play, Gauge, BarChart3, Bell, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActionCardProps {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  onClick?: () => void;
}

function ActionCard({ icon: Icon, label, color, onClick }: ActionCardProps) {
  return (
    <Card 
      className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-0 ${color}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-white font-medium text-sm">{label}</span>
      </div>
    </Card>
  );
}

interface DashboardActionsProps {
  onStartTournament?: () => void;
  onViewControl?: () => void;
}

export function DashboardActions({ onStartTournament, onViewControl }: DashboardActionsProps) {
  const actions = [
    { icon: Play, label: 'Zahájit závod', color: 'racing-gradient shadow-glow', onClick: onStartTournament },
    { icon: Gauge, label: 'Kontrola', color: 'dark-gradient border border-racing-yellow/30', onClick: onViewControl },
    { icon: BarChart3, label: 'Statistiky', color: 'dark-gradient border border-white/20' },
    { icon: Bell, label: 'Oznámení', color: 'dark-gradient border border-white/20' },
    { icon: BookOpen, label: 'Pravidla', color: 'dark-gradient border border-white/20' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {actions.map((action, index) => (
        <ActionCard
          key={index}
          icon={action.icon}
          label={action.label}
          color={action.color}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
}