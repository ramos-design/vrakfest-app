import { Play, Gauge, BarChart3, Bell, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActionCardProps {
  icon: React.ComponentType<any>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function ActionCard({ icon: Icon, label, isActive = false, onClick }: ActionCardProps) {
  return (
    <Card 
      className={`p-6 cursor-pointer border-0 transition-all duration-300 ease-out transform hover:scale-105 ${
        isActive 
          ? 'bg-racing-yellow text-racing-black shadow-glow' 
          : 'dark-gradient border border-white/20 text-white hover:bg-racing-yellow hover:text-racing-black hover:shadow-glow'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? 'bg-racing-black/10' 
            : 'bg-white/20 group-hover:bg-racing-black/10'
        }`}>
          <Icon className={`h-6 w-6 transition-colors duration-300 ${
            isActive ? 'text-racing-black' : 'text-white'
          }`} />
        </div>
        <span className={`font-medium text-sm transition-colors duration-300 ${
          isActive ? 'text-racing-black' : 'text-white'
        }`}>{label}</span>
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
    { icon: Play, label: 'Zahájit závod', isActive: true, onClick: onStartTournament },
    { icon: Gauge, label: 'Kontrola', isActive: false, onClick: onViewControl },
    { icon: BarChart3, label: 'Statistiky', isActive: false },
    { icon: Bell, label: 'Oznámení', isActive: false },
    { icon: BookOpen, label: 'Pravidla', isActive: false },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {actions.map((action, index) => (
        <ActionCard
          key={index}
          icon={action.icon}
          label={action.label}
          isActive={action.isActive}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
}