import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
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
              <div key={message.id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-primary">
                    {message.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                  <p className="text-foreground whitespace-pre-wrap">{message.text}</p>
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