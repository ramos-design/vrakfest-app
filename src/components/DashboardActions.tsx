import { Flag, Gauge, BarChart3, Car, ShoppingCart, Search, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActionCardProps {
  icon: React.ComponentType<any>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isStartButton?: boolean;
}

function ActionCard({ icon: Icon, label, isActive = false, onClick, isStartButton = false }: ActionCardProps) {
  const getCardStyles = () => {
    if (isStartButton) {
      return isActive 
        ? 'bg-green-600 text-white shadow-glow hover:bg-green-700' 
        : 'bg-red-600 text-white shadow-glow hover:bg-red-700';
    }
    return isActive 
      ? 'bg-racing-yellow text-racing-black shadow-glow' 
      : 'dark-gradient border border-white/20 text-white hover:bg-racing-yellow hover:text-racing-black hover:shadow-glow';
  };

  return (
    <Card 
      className={`p-6 cursor-pointer border-0 transition-all duration-300 ease-out transform hover:scale-105 ${getCardStyles()}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isStartButton 
            ? 'bg-white/20' 
            : isActive 
              ? 'bg-racing-black' 
              : 'bg-white/20 group-hover:bg-racing-black/10'
        }`}>
          <Icon className={`h-6 w-6 transition-colors duration-300 text-white`} />
        </div>
        <span className={`font-medium text-sm transition-colors duration-300 ${
          isStartButton ? 'text-white' : isActive ? 'text-racing-black' : 'text-white'
        }`}>{label}</span>
      </div>
    </Card>
  );
}

interface DashboardActionsProps {
  onStartTournament?: () => void;
  onViewControl?: () => void;
  onViewTournament?: () => void;
  onViewCommunication?: () => void;
  onViewStatistics?: () => void;
  onViewMarketplace?: () => void;
  isTournamentActive?: boolean;
}

export function DashboardActions({ onStartTournament, onViewControl, onViewTournament, onViewCommunication, onViewStatistics, onViewMarketplace, isTournamentActive = false }: DashboardActionsProps) {
  const actions = [
    { icon: isTournamentActive ? Search : Flag, label: isTournamentActive ? 'Průběh závodu' : 'Zahájit závod', isActive: isTournamentActive, onClick: isTournamentActive ? onViewTournament : onStartTournament, isStartButton: true },
    { icon: Gauge, label: 'Kontrola', isActive: false, onClick: onViewControl },
    { icon: BarChart3, label: 'Statistiky', isActive: false, onClick: onViewStatistics },
    { icon: Car, label: 'Demolition derby', isActive: false },
    { icon: MessageSquare, label: 'Komunikace', isActive: false, onClick: onViewCommunication },
    { icon: ShoppingCart, label: 'Obchod', isActive: false, onClick: onViewMarketplace },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {actions.map((action, index) => (
        <ActionCard
          key={index}
          icon={action.icon}
          label={action.label}
          isActive={action.isActive}
          onClick={action.onClick}
          isStartButton={action.isStartButton}
        />
      ))}
    </div>
  );
}