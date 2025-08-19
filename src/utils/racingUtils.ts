import { Racer, RacerCategory, RaceGroup } from '@/types/racing';

export const categories: RacerCategory[] = ['do 1.6L', 'nad 1.6L', 'Ženy'];

export const getCategoryColor = (category: RacerCategory): string => {
  switch (category) {
    case 'do 1.6L':
      return 'category-small';
    case 'nad 1.6L':
      return 'category-large';
    case 'Ženy':
      return 'category-women';
    default:
      return 'category-small';
  }
};

export const getCategoryBadgeColor = (category: RacerCategory): string => {
  switch (category) {
    case 'do 1.6L':
      return 'bg-green-600';
    case 'nad 1.6L':
      return 'bg-blue-600';
    case 'Ženy':
      return 'bg-purple-600';
    default:
      return 'bg-green-600';
  }
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const createGroups = (racers: Racer[], category: RacerCategory, round: number): RaceGroup[] => {
  const categoryRacers = racers.filter(r => r.category === category && r.isActive);
  const shuffledRacers = shuffleArray(categoryRacers);
  const groups: RaceGroup[] = [];
  
  for (let i = 0; i < shuffledRacers.length; i += 6) {
    const groupRacers = shuffledRacers.slice(i, i + 6);
    groups.push({
      id: `${category}-round${round}-group${Math.floor(i / 6) + 1}`,
      racers: groupRacers,
      category,
      round,
      isCompleted: false,
      hasStarted: false
    });
  }
  
  return groups;
};

export const shouldAdvanceRacer = (racer: Racer, round: number): boolean => {
  // In first 3 rounds, everyone advances regardless of points
  if (round <= 3) {
    return true;
  }
  
  // From round 4+, only racers with 2+ points advance
  return racer.points >= 2;
};

export const generateSampleRacers = (): Racer[] => {
  const sampleNames = [
    'Martin Sedláček', 'Petr Sedláček', 'Michal Novotný', 'Martin Pospíšil', 'Michal Veselý', 'Lukáš Krejčí',
    'Jiří Fiala', 'Pavel Svoboda', 'Jakub Růžička', 'Martin Hrubý', 'Michal Zeman', 'Jakub Zeman',
    'Tomáš Dvořák', 'Jan Procházka', 'Petr Novák', 'Jiří Svoboda', 'Pavel Černý', 'Martin Krejčí',
    'Václav Horák', 'David Poláček', 'Michal Kratochvíl', 'Tomáš Malý', 'Jan Štěpánek', 'Petr Urban',
    'Filip Doležal', 'Ondřej Čermák', 'Radek Beneš', 'Jakub Moravec', 'Martin Šimek', 'Petr Kadlec',
    'Jan Kolek', 'Tomáš Říha', 'Pavel Marek', 'Jiří Havel', 'David Kučera', 'Michal Tůma'
  ];

  const vehicles = [
    'Škoda Octavia', 'BMW E30', 'Audi A4', 'Volkswagen Golf', 'Ford Focus', 'Peugeot 206',
    'Renault Clio', 'Honda Civic', 'Toyota Corolla', 'Nissan Primera', 'Mazda 323', 'Fiat Punto'
  ];

  const racers: Racer[] = [];
  let startNumber = 1;

  // Generate 12 racers for each category
  categories.forEach(category => {
    for (let i = 0; i < 12; i++) {
      const [firstName, lastName] = sampleNames[Math.floor(Math.random() * sampleNames.length)].split(' ');
      racers.push({
        id: `racer-${startNumber}`,
        firstName,
        lastName,
        startNumber,
        vehicleType: vehicles[Math.floor(Math.random() * vehicles.length)],
        category,
        points: 0,
        isActive: true
      });
      startNumber++;
    }
  });

  return racers;
};