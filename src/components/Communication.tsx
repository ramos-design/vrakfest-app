import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Send, MessageCircle, Edit3, Trash2, Settings } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
  originalTimestamp?: Date;
}

interface ChatSettings {
  name: string;
  writePermission: 'everyone' | 'organizers';
}

export function Communication() {
  const [chatSettings, setChatSettings] = useState<ChatSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<ChatSettings>({
    name: 'Komunikační kanál závodu',
    writePermission: 'organizers'
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleStartChat = () => {
    setChatSettings(tempSettings);
    setMessages([{
      id: '1',
      text: `Vítejte v kanálu "${tempSettings.name}"!`,
      timestamp: new Date(),
      sender: 'Organizátor'
    }]);
    setShowSettings(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        sender: 'Organizátor'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessage(messageId);
      setEditText(message.text);
    }
  };

  const handleSaveEdit = () => {
    if (editingMessage && editText.trim()) {
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage 
          ? { ...msg, text: editText.trim() }
          : msg
      ));
      setEditingMessage(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditText('');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Komunikace</h1>
          <p className="text-muted-foreground">Chatovací okno pro komunikaci během závodu</p>
        </div>
      </div>

      {!chatSettings ? (
        <Card className="h-[600px] flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">Nastavte komunikační kanál</h2>
            <p className="text-muted-foreground">Před zahájením komunikace nastavte název a oprávnění kanálu</p>
            <Button onClick={handleOpenSettings} className="mt-4">
              <Settings className="h-4 w-4 mr-2" />
              Nastavit kanál
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-card flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{chatSettings.name}</h3>
              <p className="text-sm text-muted-foreground">
                {chatSettings.writePermission === 'everyone' ? 'Všichni mohou psát' : 'Pouze organizátoři mohou psát'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="flex flex-col group hover:bg-secondary/20 rounded-lg p-2 -m-2 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary">
                      {message.sender}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.originalTimestamp || message.timestamp)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMessage(message.id)}
                        className="w-6 h-6 p-0 hover:bg-primary/10"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                        className="w-6 h-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                    {editingMessage === message.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          Uložit
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          Zrušit
                        </Button>
                      </div>
                    ) : (
                      <p className="text-foreground whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Napište zprávu do ${chatSettings.name}...`}
                className="flex-1"
                disabled={chatSettings.writePermission === 'organizers' && false} // Vždy povoleno pro demo
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nastavení komunikačního kanálu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chat-name">Název kanálu</Label>
              <Input
                id="chat-name"
                value={tempSettings.name}
                onChange={(e) => setTempSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Zadejte název kanálu..."
              />
            </div>
            <div className="space-y-2">
              <Label>Oprávnění pro psaní</Label>
              <RadioGroup
                value={tempSettings.writePermission}
                onValueChange={(value: 'everyone' | 'organizers') => 
                  setTempSettings(prev => ({ ...prev, writePermission: value }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organizers" id="organizers" />
                  <Label htmlFor="organizers">Pouze organizátoři</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="everyone" id="everyone" />
                  <Label htmlFor="everyone">Všichni účastníci</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleStartChat} className="flex-1">
                {chatSettings ? 'Uložit změny' : 'Spustit kanál'}
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Zrušit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}