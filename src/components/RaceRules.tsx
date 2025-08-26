import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Underline, Type, Edit3, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RuleBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'paragraph';
  content: string;
  style: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
    fontSize: 'small' | 'medium' | 'large';
  };
}

export function RaceRules() {
  const [isEditing, setIsEditing] = useState(false);
  const [rules, setRules] = useState<RuleBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedRules = localStorage.getItem('race-rules');
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    } else {
      // Default rules
      setRules([
        {
          id: '1',
          type: 'h1',
          content: 'Pravidla závodu VrakFest',
          style: { bold: true, italic: false, underline: false, color: '#FFD700', fontSize: 'large' }
        },
        {
          id: '2',
          type: 'h2',
          content: 'Obecná pravidla',
          style: { bold: true, italic: false, underline: false, color: '#FFFFFF', fontSize: 'medium' }
        },
        {
          id: '3',
          type: 'paragraph',
          content: 'Všichni účastníci musí dodržovat stanovená pravidla během celého průběhu závodu.',
          style: { bold: false, italic: false, underline: false, color: '#FFFFFF', fontSize: 'medium' }
        }
      ]);
    }
  }, []);

  const saveRules = () => {
    localStorage.setItem('race-rules', JSON.stringify(rules));
    setIsEditing(false);
    toast({
      title: "Pravidla uložena",
      description: "Pravidla závodu byla úspěšně aktualizována.",
    });
  };

  const addNewBlock = () => {
    const newBlock: RuleBlock = {
      id: Date.now().toString(),
      type: 'paragraph',
      content: 'Nový text...',
      style: { bold: false, italic: false, underline: false, color: '#FFFFFF', fontSize: 'medium' }
    };
    setRules([...rules, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<RuleBlock>) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
  };

  const updateBlockStyle = (id: string, styleUpdates: Partial<RuleBlock['style']>) => {
    setRules(rules.map(rule => 
      rule.id === id 
        ? { ...rule, style: { ...rule.style, ...styleUpdates } }
        : rule
    ));
  };

  const deleteBlock = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const getBlockStyles = (block: RuleBlock) => {
    const baseStyles = "transition-all duration-200";
    const sizeStyles = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg"
    };
    
    return `${baseStyles} ${sizeStyles[block.style.fontSize]} ${
      block.style.bold ? 'font-bold' : 'font-normal'
    } ${
      block.style.italic ? 'italic' : ''
    } ${
      block.style.underline ? 'underline' : ''
    }`;
  };

  const getHeadingStyles = (type: string) => {
    switch (type) {
      case 'h1': return "text-2xl font-bold mb-4";
      case 'h2': return "text-xl font-semibold mb-3";
      case 'h3': return "text-lg font-medium mb-2";
      default: return "mb-2";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold racing-gradient-text">Pravidla závodu</h1>
        <Button
          onClick={isEditing ? saveRules : () => setIsEditing(true)}
          className={isEditing ? "racing-btn-primary" : "racing-btn-secondary"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Uložit
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Upravit
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <Card className="racing-card p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={addNewBlock}
              size="sm"
              className="racing-btn-secondary"
            >
              Přidat blok
            </Button>
            
            {selectedBlockId && (
              <>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBlockStyle(selectedBlockId, { 
                      bold: !rules.find(r => r.id === selectedBlockId)?.style.bold 
                    })}
                    className={rules.find(r => r.id === selectedBlockId)?.style.bold ? "bg-racing-yellow text-racing-black" : ""}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBlockStyle(selectedBlockId, { 
                      italic: !rules.find(r => r.id === selectedBlockId)?.style.italic 
                    })}
                    className={rules.find(r => r.id === selectedBlockId)?.style.italic ? "bg-racing-yellow text-racing-black" : ""}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBlockStyle(selectedBlockId, { 
                      underline: !rules.find(r => r.id === selectedBlockId)?.style.underline 
                    })}
                    className={rules.find(r => r.id === selectedBlockId)?.style.underline ? "bg-racing-yellow text-racing-black" : ""}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                </div>
                
                <Select
                  value={rules.find(r => r.id === selectedBlockId)?.style.fontSize}
                  onValueChange={(value: 'small' | 'medium' | 'large') => 
                    updateBlockStyle(selectedBlockId, { fontSize: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Malé</SelectItem>
                    <SelectItem value="medium">Střední</SelectItem>
                    <SelectItem value="large">Velké</SelectItem>
                  </SelectContent>
                </Select>

                <input
                  type="color"
                  value={rules.find(r => r.id === selectedBlockId)?.style.color}
                  onChange={(e) => updateBlockStyle(selectedBlockId, { color: e.target.value })}
                  className="w-12 h-9 rounded border border-input"
                />
              </>
            )}
          </div>
        </Card>
      )}

      <Card className="racing-card p-6">
        <div className="space-y-4">
          {rules.map((block) => (
            <div key={block.id} className="group relative">
              {isEditing ? (
                <div className="border border-racing-yellow/20 rounded-lg p-3">
                  <div className="flex gap-2 mb-2">
                    <Select
                      value={block.type}
                      onValueChange={(value: RuleBlock['type']) => 
                        updateBlock(block.id, { type: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h1">Nadpis 1</SelectItem>
                        <SelectItem value="h2">Nadpis 2</SelectItem>
                        <SelectItem value="h3">Nadpis 3</SelectItem>
                        <SelectItem value="paragraph">Odstavec</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteBlock(block.id)}
                    >
                      Smazat
                    </Button>
                  </div>
                  
                  <Textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    onClick={() => setSelectedBlockId(block.id)}
                    className="racing-input"
                    style={{ 
                      color: block.style.color,
                      fontWeight: block.style.bold ? 'bold' : 'normal',
                      fontStyle: block.style.italic ? 'italic' : 'normal',
                      textDecoration: block.style.underline ? 'underline' : 'none'
                    }}
                  />
                </div>
              ) : (
                <div 
                  className={`${getHeadingStyles(block.type)} ${getBlockStyles(block)}`}
                  style={{ color: block.style.color }}
                >
                  {block.type === 'h1' && <h1>{block.content}</h1>}
                  {block.type === 'h2' && <h2>{block.content}</h2>}
                  {block.type === 'h3' && <h3>{block.content}</h3>}
                  {block.type === 'paragraph' && <p>{block.content}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Žádná pravidla nejsou definována.</p>
            {isEditing && (
              <Button onClick={addNewBlock} className="mt-4 racing-btn-primary">
                Přidat první pravidlo
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}