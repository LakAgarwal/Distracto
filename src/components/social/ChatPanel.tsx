
import React, { useState, useRef, useEffect } from 'react';
import { ChatThread } from '@/types/friend';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Send } from 'lucide-react';
import { format } from 'date-fns';

interface ChatPanelProps {
  chat: ChatThread;
  onSendMessage: (content: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chat, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };
  
  // Group messages by date
  const messagesByDate = chat.messages.reduce((groups, message) => {
    const dateKey = new Date(message.timestamp).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, typeof chat.messages>);

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {chat.isGroupChat ? (
            <Avatar>
              <AvatarFallback className="bg-indigo-500 text-primary-foreground">
                <Users className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=1" />
              <AvatarFallback>
                {chat.isGroupChat ? 'G' : 'U'}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div>
            <h2 className="font-semibold">
              {chat.isGroupChat 
                ? chat.groupName 
                : 'Direct Message'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {chat.isGroupChat 
                ? `${chat.participants.length} members` 
                : 'Online'}
            </p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {Object.keys(messagesByDate).length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No messages yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to send a message
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(messagesByDate).map(([dateStr, messages]) => (
              <div key={dateStr} className="space-y-4">
                <div className="flex justify-center">
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {formatMessageDate(new Date(dateStr))}
                  </div>
                </div>
                
                {messages.map((msg) => {
                  const isCurrentUser = msg.senderId === 'currentUser';
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex max-w-[70%]">
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarFallback>
                              {msg.senderName[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div>
                          {!isCurrentUser && chat.isGroupChat && (
                            <div className="text-xs text-muted-foreground mb-1">
                              {msg.senderName}
                            </div>
                          )}
                          
                          <div 
                            className={`
                              px-3 py-2 rounded-lg break-words
                              ${
                                isCurrentUser 
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }
                            `}
                          >
                            {msg.content}
                            <div className="text-xs opacity-70 mt-1 text-right">
                              {formatMessageTime(new Date(msg.timestamp))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
            ref={inputRef}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatPanel;
