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

export const createGroups = (racers: Racer[], category: RacerCategory, round: number, racersPerGroup: number = 6): RaceGroup[] => {
  const categoryRacers = racers.filter(r => r.category === category && r.isActive);
  const shuffledRacers = shuffleArray(categoryRacers);
  const groups: RaceGroup[] = [];
  
  for (let i = 0; i < shuffledRacers.length; i += racersPerGroup) {
    const groupRacers = shuffledRacers.slice(i, i + racersPerGroup);
    groups.push({
      id: `${category}-round${round}-group${Math.floor(i / racersPerGroup) + 1}`,
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

export const generateRealRacers = (): Racer[] => {
  const realRacersData = [
    // DO 1,6 L kategorie
    { startNumber: 74, firstName: 'PATRIK', lastName: 'KLEPÁČ', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 21 },
    { startNumber: 131, firstName: 'MARTIN', lastName: 'ČERVENKA', vehicleType: 'PEUGEOT 206', category: 'do 1.6L' as RacerCategory, points: 20 },
    { startNumber: 337, firstName: 'PETR', lastName: 'BÍJA', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 19 },
    { startNumber: 90, firstName: 'DANIEL', lastName: 'BEZDĚK', vehicleType: 'RENAULT CLIO', category: 'do 1.6L' as RacerCategory, points: 17 },
    { startNumber: 27, firstName: 'JIŘÍ', lastName: 'FEIX', vehicleType: 'FABIE', category: 'do 1.6L' as RacerCategory, points: 17 },
    { startNumber: 773, firstName: 'MATYÁŠ', lastName: 'WYSOGLAD', vehicleType: 'NISSAN ALMERA TWINCUM', category: 'do 1.6L' as RacerCategory, points: 17 },
    { startNumber: 262, firstName: 'MARTIN', lastName: 'BANČÍK', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 15 },
    { startNumber: 747, firstName: 'PETR', lastName: 'KLEPÁČ', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 15 },
    { startNumber: 12, firstName: 'MAREK', lastName: 'CHRASTINA', vehicleType: 'VW POLO', category: 'do 1.6L' as RacerCategory, points: 13 },
    { startNumber: 153, firstName: 'MIROSLAV', lastName: 'TANEČEK', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 13 },
    { startNumber: 16, firstName: 'ADAM', lastName: 'PANÁČEK', vehicleType: 'HONDA CIVIC', category: 'do 1.6L' as RacerCategory, points: 12 },
    { startNumber: 123, firstName: 'ŠTĚPÁN', lastName: 'URBANCZYK', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 12 },
    { startNumber: 0, firstName: 'PAVEL', lastName: 'JANKŮJ', vehicleType: 'FAVORIT', category: 'do 1.6L' as RacerCategory, points: 11 },
    { startNumber: 25, firstName: 'MARTIN', lastName: 'VENOL', vehicleType: 'VW GOLF 4 16V', category: 'do 1.6L' as RacerCategory, points: 11 },
    { startNumber: 202, firstName: 'LUKÁŠ', lastName: 'BRIM', vehicleType: 'FAVORIT', category: 'do 1.6L' as RacerCategory, points: 10 },
    { startNumber: 88, firstName: 'ROSTISLAV', lastName: 'MALOVANÝ', vehicleType: 'FELICIE PICKUP', category: 'do 1.6L' as RacerCategory, points: 9 },
    { startNumber: 146, firstName: 'MICHAEL', lastName: 'BĚLÍK', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 9 },
    { startNumber: 233, firstName: 'DAVID', lastName: 'MLČOCH', vehicleType: 'MITSUBISHI COLT', category: 'do 1.6L' as RacerCategory, points: 8 },
    { startNumber: 888, firstName: 'JIŘÍ', lastName: 'VICHA', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 8 },
    { startNumber: 8, firstName: 'JAN', lastName: 'KOCOUREK', vehicleType: 'PEUGEOT 206', category: 'do 1.6L' as RacerCategory, points: 8 },
    { startNumber: 6, firstName: 'PAVEL', lastName: 'PAJDLA', vehicleType: 'VW GOLF 4', category: 'do 1.6L' as RacerCategory, points: 7 },
    { startNumber: 4, firstName: 'ZDENĚK', lastName: 'PŘÍHODA', vehicleType: 'VW POLO', category: 'do 1.6L' as RacerCategory, points: 7 },
    { startNumber: 599, firstName: 'JAN', lastName: 'KRYL', vehicleType: 'VW GOLF', category: 'do 1.6L' as RacerCategory, points: 7 },
    { startNumber: 126, firstName: 'TOMÁŠ', lastName: 'KŘUPALA', vehicleType: 'RENAULT MEGANE II COMBI', category: 'do 1.6L' as RacerCategory, points: 6 },
    { startNumber: 57, firstName: 'PETR', lastName: 'MICHLÍK', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 6 },
    { startNumber: 31, firstName: 'PAVEL', lastName: 'DREISEITL', vehicleType: 'FIAT DUBLO', category: 'do 1.6L' as RacerCategory, points: 5 },
    { startNumber: 10, firstName: 'ADAM', lastName: 'BARILIČ', vehicleType: 'FORD', category: 'do 1.6L' as RacerCategory, points: 5 },
    { startNumber: 950, firstName: 'TOMÁŠ', lastName: 'VENCL', vehicleType: 'HYUNDAI GETZ', category: 'do 1.6L' as RacerCategory, points: 5 },
    { startNumber: 272, firstName: 'TOMÁŠ', lastName: 'TORČÍK', vehicleType: 'FABIE', category: 'do 1.6L' as RacerCategory, points: 4 },
    { startNumber: 919, firstName: 'HONZA', lastName: 'TRYBULA', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 4 },
    { startNumber: 323, firstName: 'FILIP', lastName: 'BOHÁČ', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 4 },
    { startNumber: 116, firstName: 'MARTIN', lastName: 'ŽITNÍK', vehicleType: 'OPEL CORSA', category: 'do 1.6L' as RacerCategory, points: 4 },
    { startNumber: 166, firstName: 'JAN', lastName: 'KRAJČÍR', vehicleType: 'FIAT PUNTO', category: 'do 1.6L' as RacerCategory, points: 4 },
    { startNumber: 9, firstName: 'TADEÁŠ', lastName: 'VÝTISK', vehicleType: 'VW GOLF', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 1995, firstName: 'MARIO', lastName: 'SCHON', vehicleType: 'FIAT PUNTO', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 333, firstName: 'MILOŠ', lastName: 'KRHOVJÁK', vehicleType: 'PEUGEOT 206', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 110, firstName: 'TOMÁŠ', lastName: 'KRUL', vehicleType: 'VW POLO', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 34, firstName: 'JAKUB', lastName: 'KONEČNÝ', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 570, firstName: 'PAVEL', lastName: 'MARTINEK', vehicleType: 'CITROEN C1', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 205, firstName: 'KAREL', lastName: 'SOLANSKÝ', vehicleType: 'PEUGEOT 205', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 14, firstName: 'MICHAL', lastName: 'KOPECKÝ', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 3 },
    { startNumber: 26, firstName: 'ROMAN', lastName: 'PROFOTA', vehicleType: 'PEUGEOT 206', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 1, firstName: 'DANIEL', lastName: 'HURNÍK', vehicleType: 'RENAULT', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 2, firstName: 'PATRIK', lastName: 'GABRHEL', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 5, firstName: 'LUKÁŠ', lastName: 'VODIČKA', vehicleType: 'FABIE 1.4 16V', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 80, firstName: 'TOMÁŠ', lastName: 'JAKUBÍK', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 40, firstName: 'MICHAL', lastName: 'DVOŘÁK', vehicleType: 'FABIE I', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 95, firstName: 'TOMÁŠ', lastName: 'VALA', vehicleType: 'FIAT', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 111, firstName: 'JOSEF', lastName: 'MAŠLÁN', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 901, firstName: 'DAVID', lastName: 'SCHON', vehicleType: 'FABIE', category: 'do 1.6L' as RacerCategory, points: 2 },
    { startNumber: 17, firstName: 'JAKUB', lastName: 'MALÍŘ', vehicleType: 'FELICIE', category: 'do 1.6L' as RacerCategory, points: 1 },
    { startNumber: 340, firstName: 'TOMÁŠ', lastName: 'VARKOČEK', vehicleType: 'SEAT LEON', category: 'do 1.6L' as RacerCategory, points: 1 },
    { startNumber: 119, firstName: 'FILIP', lastName: 'DIVILA', vehicleType: 'PEUGEOT 206', category: 'do 1.6L' as RacerCategory, points: 1 },
    { startNumber: 161, firstName: 'MICHAL', lastName: 'KAČÍREK', vehicleType: 'FABIE', category: 'do 1.6L' as RacerCategory, points: 1 },
    { startNumber: 19, firstName: 'MARTIN', lastName: 'MOJEK', vehicleType: 'MAZDA 323F', category: 'do 1.6L' as RacerCategory, points: 1 },
    { startNumber: 11, firstName: 'TOMÁŠ', lastName: 'TROJÁK', vehicleType: 'SUZUKI SWIFT', category: 'do 1.6L' as RacerCategory, points: 1 },

    // NAD 1,6 L kategorie
    { startNumber: 23, firstName: 'MATĚJ', lastName: 'ŽUŽOV', vehicleType: 'FELICIE', category: 'nad 1.6L' as RacerCategory, points: 25 },
    { startNumber: 92, firstName: 'VÁCLAV', lastName: 'ADAMČÍK', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 23 },
    { startNumber: 713, firstName: 'VÁCLAV', lastName: 'KAŇOK', vehicleType: 'BMW', category: 'nad 1.6L' as RacerCategory, points: 15 },
    { startNumber: 696, firstName: 'PETR', lastName: 'MAZÁNEK', vehicleType: 'VW GOLF', category: 'nad 1.6L' as RacerCategory, points: 14 },
    { startNumber: 101, firstName: 'KAMIL', lastName: 'BEZDĚK', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 12 },
    { startNumber: 89, firstName: 'MARTIN', lastName: 'ADAMČÍK', vehicleType: 'VW GOLF', category: 'nad 1.6L' as RacerCategory, points: 12 },
    { startNumber: 66, firstName: 'STAŇA', lastName: 'JAROŠ', vehicleType: 'TOYOTA', category: 'nad 1.6L' as RacerCategory, points: 11 },
    { startNumber: 106, firstName: 'PAVEL', lastName: 'ŠINDLER', vehicleType: 'BMW', category: 'nad 1.6L' as RacerCategory, points: 10 },
    { startNumber: 108, firstName: 'LUKÁŠ', lastName: 'DIVILA', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 10 },
    { startNumber: 46, firstName: 'ONDREJ', lastName: 'SPÁČIL', vehicleType: 'FELICIE', category: 'nad 1.6L' as RacerCategory, points: 10 },
    { startNumber: 21, firstName: 'RADEK', lastName: 'HEOZKO', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 9 },
    { startNumber: 222, firstName: 'TOMÁŠ', lastName: 'ROVENSKÝ', vehicleType: 'AUDI', category: 'nad 1.6L' as RacerCategory, points: 9 },
    { startNumber: 271, firstName: 'LUKÁŠ', lastName: 'RYBÁŘ', vehicleType: 'FORD FOCUS', category: 'nad 1.6L' as RacerCategory, points: 9 },
    { startNumber: 3, firstName: 'LUKÁŠ', lastName: 'BAČA', vehicleType: 'FORD COUGAR', category: 'nad 1.6L' as RacerCategory, points: 8 },
    { startNumber: 311, firstName: 'ROMAN', lastName: 'BREŽÁK', vehicleType: 'FORD MONDEO', category: 'nad 1.6L' as RacerCategory, points: 7 },
    { startNumber: 444, firstName: 'VLASTA', lastName: 'BÁRTEK', vehicleType: 'FIAT BRAVA', category: 'nad 1.6L' as RacerCategory, points: 7 },
    { startNumber: 112, firstName: 'JAN', lastName: 'PREKOP', vehicleType: 'FORD', category: 'nad 1.6L' as RacerCategory, points: 7 },
    { startNumber: 589, firstName: 'ROSTISLAV', lastName: 'SKOTÁK', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 5 },
    { startNumber: 69, firstName: 'MAREK', lastName: 'LEPIL', vehicleType: 'FELICIE', category: 'nad 1.6L' as RacerCategory, points: 5 },
    { startNumber: 611, firstName: 'JINDŘICH', lastName: 'FIALA', vehicleType: 'VW GOLF', category: 'nad 1.6L' as RacerCategory, points: 5 },
    { startNumber: 2006, firstName: 'KUBA', lastName: 'MIČÁK', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 5 },
    { startNumber: 22, firstName: 'OLDŘICH', lastName: 'ŽÉDEK', vehicleType: 'FORD PUMA', category: 'nad 1.6L' as RacerCategory, points: 4 },
    { startNumber: 525, firstName: 'MICHAL', lastName: 'KRYBUS', vehicleType: 'OPEL CORSA', category: 'nad 1.6L' as RacerCategory, points: 4 },
    { startNumber: 33, firstName: 'JAN', lastName: 'MORÁŘ', vehicleType: 'VW PASSAT', category: 'nad 1.6L' as RacerCategory, points: 4 },
    { startNumber: 6, firstName: 'MARTIN', lastName: 'KLICH', vehicleType: 'MAZDA', category: 'nad 1.6L' as RacerCategory, points: 3 },
    { startNumber: 666, firstName: 'RADEK', lastName: 'PLESNÍK', vehicleType: 'VW VENTO', category: 'nad 1.6L' as RacerCategory, points: 3 },
    { startNumber: 13, firstName: 'AJS', lastName: '', vehicleType: 'RAV 4', category: 'nad 1.6L' as RacerCategory, points: 3 },
    { startNumber: 47, firstName: 'DAVID', lastName: 'PEOHÁČEK', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 3 },
    { startNumber: 7, firstName: 'TOBIAS', lastName: 'BOGDALÍK', vehicleType: 'OPEL ASTRA', category: 'nad 1.6L' as RacerCategory, points: 3 },
    { startNumber: 171, firstName: 'MAREK', lastName: 'MICHÁLEK', vehicleType: 'BMW E36 COMPACT 316I', category: 'nad 1.6L' as RacerCategory, points: 2 },
    { startNumber: 686, firstName: 'TOMÁŠ', lastName: 'NEVŘIVA', vehicleType: 'BMW E46 320D', category: 'nad 1.6L' as RacerCategory, points: 2 },
    { startNumber: 344, firstName: 'ERIK', lastName: 'LESÁK', vehicleType: 'FORD MONDEO MK1', category: 'nad 1.6L' as RacerCategory, points: 2 },
    { startNumber: 228, firstName: 'LAHVÁČ', lastName: '', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 2 },
    { startNumber: 1977, firstName: 'JINDŘICH', lastName: 'FIALA', vehicleType: 'RENAULT MEGANE', category: 'nad 1.6L' as RacerCategory, points: 1 },
    { startNumber: 2001, firstName: 'JIŘÍ', lastName: 'KOKOŘ', vehicleType: 'MAZDA 6', category: 'nad 1.6L' as RacerCategory, points: 1 },
    { startNumber: 133, firstName: 'JAKUB', lastName: 'UHŘÍK', vehicleType: 'FELICIE', category: 'nad 1.6L' as RacerCategory, points: 1 },
    { startNumber: 690, firstName: 'DAVID', lastName: 'MÍČA', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 1 },
    { startNumber: 113, firstName: 'RADEK', lastName: 'MYSLIVEC', vehicleType: 'OCTAVIE', category: 'nad 1.6L' as RacerCategory, points: 1 },

    // ŽENY kategorie
    { startNumber: 47, firstName: 'KATEŘINA', lastName: 'PIKOVÁ', vehicleType: 'FELICIE', category: 'Ženy' as RacerCategory, points: 15 },
    { startNumber: 122, firstName: 'IVETA', lastName: 'FALUŠI', vehicleType: 'TOYOTA YARIS', category: 'Ženy' as RacerCategory, points: 12 },
    { startNumber: 613, firstName: 'NIKOLA', lastName: 'BERNÁTKOVÁ', vehicleType: 'FELICIE', category: 'Ženy' as RacerCategory, points: 12 },
    { startNumber: 52, firstName: 'MARTINA', lastName: 'PEŠKOVÁ', vehicleType: 'FABIE', category: 'Ženy' as RacerCategory, points: 10 },
    { startNumber: 94, firstName: 'MONIKA', lastName: 'ZÁTOPKOVÁ', vehicleType: 'OCTAVIE', category: 'Ženy' as RacerCategory, points: 7 },
    { startNumber: 156, firstName: 'JAROSLAVA', lastName: 'SOLANSKÁ', vehicleType: 'FORD FOCUS', category: 'Ženy' as RacerCategory, points: 6 },
    { startNumber: 6002, firstName: 'KAROLÍNA', lastName: 'POSPÍŠILOVÁ', vehicleType: 'KIA CEED', category: 'Ženy' as RacerCategory, points: 6 },
    { startNumber: 777, firstName: 'SHARLOTA', lastName: 'BOGDALÍKOVÁ', vehicleType: 'RENAULT TWINGO', category: 'Ženy' as RacerCategory, points: 4 },
    { startNumber: 100, firstName: 'PAVLÍNA', lastName: 'JANEČKOVÁ', vehicleType: 'HYUNDAI GETZ', category: 'Ženy' as RacerCategory, points: 2 },
    { startNumber: 55, firstName: 'ELIŠKA', lastName: 'HRŮZOVÁ', vehicleType: 'FABIA', category: 'Ženy' as RacerCategory, points: 2 },
    { startNumber: 1109, firstName: 'VERONIKA', lastName: 'LANDTOVÁ', vehicleType: 'FELICIE', category: 'Ženy' as RacerCategory, points: 1 }
  ];

  return realRacersData.map((data, index) => ({
    id: `racer-${Date.now()}-${index}`,
    firstName: data.firstName,
    lastName: data.lastName,
    startNumber: data.startNumber,
    vehicleType: data.vehicleType,
    category: data.category,
    points: data.points,
    isActive: true
  }));
};