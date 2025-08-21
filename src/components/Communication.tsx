import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Edit3, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
  originalTimestamp?: Date;
}

export function Communication() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Vítejte v komunikačním kanálu závodu!',
      timestamp: new Date(),
      sender: 'Organizátor'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

      <Card className="h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <h3 className="font-semibold text-foreground">Komunikační kanál závodu</h3>
          <p className="text-sm text-muted-foreground">Informace o průběhu závodu</p>
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
              placeholder="Napište zprávu o průběhu závodu..."
              className="flex-1"
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
    </div>
  );
}