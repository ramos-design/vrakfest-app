import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActionLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  email: string;
  action: string;
  category: 'racer' | 'tournament' | 'settings' | 'communication' | 'rules' | 'marketplace';
  details?: string;
}

export function ActionLog() {
  const [logs, setLogs] = useState<ActionLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActionLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const savedLogs = localStorage.getItem('action-logs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setLogs(parsedLogs);
      setFilteredLogs(parsedLogs);
    }
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, categoryFilter]);

  const clearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
    localStorage.removeItem('action-logs');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'racer': return 'bg-blue-600';
      case 'tournament': return 'bg-green-600';
      case 'settings': return 'bg-yellow-600';
      case 'communication': return 'bg-purple-600';
      case 'rules': return 'bg-orange-600';
      case 'marketplace': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'racer': return 'Jezdci';
      case 'tournament': return 'Turnaj';
      case 'settings': return 'Nastavení';
      case 'communication': return 'Komunikace';
      case 'rules': return 'Pravidla';
      case 'marketplace': return 'Bazar';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold racing-gradient-text">Log akcí</h1>
        <Button
          onClick={clearLogs}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Vymazat log
        </Button>
      </div>

      <Card className="racing-card p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Hledat podle uživatele, emailu nebo akce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 racing-input"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrovat podle kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny kategorie</SelectItem>
              <SelectItem value="racer">Jezdci</SelectItem>
              <SelectItem value="tournament">Turnaj</SelectItem>
              <SelectItem value="settings">Nastavení</SelectItem>
              <SelectItem value="communication">Komunikace</SelectItem>
              <SelectItem value="rules">Pravidla</SelectItem>
              <SelectItem value="marketplace">Bazar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="racing-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum a čas</TableHead>
              <TableHead>Uživatel</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Akce</TableHead>
              <TableHead>Detaily</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {logs.length === 0 ? (
                    <>
                      <div className="flex flex-col items-center">
                        <Search className="w-12 h-12 mb-4 opacity-50" />
                        <p>Žádné akce nejsou zaznamenány.</p>
                        <p className="text-sm mt-2">Akce se budou automaticky zaznamenávat při provádění změn v aplikaci.</p>
                      </div>
                    </>
                  ) : (
                    <p>Žádné akce nevyhovují současným filtrům.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {log.timestamp.toLocaleString('cs-CZ')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.user}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(log.category)} text-white`}>
                        {getCategoryLabel(log.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.details || '-'}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>

      {logs.length > 0 && (
        <Card className="racing-card p-4">
          <div className="text-sm text-muted-foreground">
            <p>Celkem záznamů: <span className="font-medium">{logs.length}</span></p>
            <p>Zobrazených záznamů: <span className="font-medium">{filteredLogs.length}</span></p>
          </div>
        </Card>
      )}
    </div>
  );
}

// Utility function to add log entry
export const addActionLog = (
  user: string,
  email: string,
  action: string,
  category: ActionLogEntry['category'],
  details?: string
) => {
  const logs = JSON.parse(localStorage.getItem('action-logs') || '[]');
  const newLog: ActionLogEntry = {
    id: Date.now().toString(),
    timestamp: new Date(),
    user,
    email,
    action,
    category,
    details
  };
  
  logs.push(newLog);
  localStorage.setItem('action-logs', JSON.stringify(logs));
};