import { Play, Gauge, Wrench, Battery, CircleDot, Lock } from 'lucide-react';
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
    { icon: Play, label: 'Start', color: 'bg-gradient-to-br from-orange-400 to-orange-600', onClick: onStartTournament },
    { icon: Gauge, label: 'Drive', color: 'bg-gradient-to-br from-blue-400 to-blue-600', onClick: onViewControl },
    { icon: Wrench, label: 'Maintenance', color: 'bg-gradient-to-br from-indigo-400 to-indigo-600' },
    { icon: Battery, label: 'Battery', color: 'bg-gradient-to-br from-red-400 to-red-600' },
    { icon: CircleDot, label: 'Tires', color: 'bg-gradient-to-br from-pink-400 to-pink-600' },
    { icon: Lock, label: 'Lock', color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
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