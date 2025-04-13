
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { User } from '@/hooks/useAuth';
import { friendsAPI } from '@/services/friends-api';
import { toast } from 'sonner';
import { ChatMessage, ChatThread } from '@/types/friend';
import { format } from 'date-fns';

interface ChatDrawerProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ user, isOpen, onOpenChange }) => {
  const [message, setMessage] = useState('');
  const [chatThread, setChatThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrCreateChat = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get all chat threads
        const threads = await friendsAPI.getChatThreads();
        
        // Look for an existing thread with this user
        const existingThread = threads.find(thread => 
          !thread.isGroupChat && thread.participants.includes(user.id)
        );
        
        if (existingThread) {
          // Load the existing thread
          const fullThread = await friendsAPI.getChatThread(existingThread.id);
          setChatThread(fullThread);
        } else {
          // Create a new chat thread
          const newThread = await friendsAPI.createChatThread([user.id], false);
          setChatThread(newThread);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && user) {
      loadOrCreateChat();
    }
  }, [isOpen, user]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !chatThread) return;
    
    try {
      const newMessage = await friendsAPI.sendMessage(chatThread.id, message);
      
      // Update the local chat state
      setChatThread(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: newMessage
        };
      });
      
      // Clear the input
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), 'h:mm a');
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-2">
            {user && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.photoURL} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>Chat with {user.displayName}</span>
              </>
            )}
          </DrawerTitle>
        </DrawerHeader>
        
        <ScrollArea className="p-4 h-[50vh]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : chatThread?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatThread?.messages.map((msg) => {
                const isCurrentUser = msg.senderId === 'currentUser';
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex max-w-[70%]">
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <div 
                          className={`
                            px-3 py-2 rounded-lg break-words
                            ${isCurrentUser 
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                            }
                          `}
                        >
                          {msg.content}
                          <div className="text-xs opacity-70 mt-1 text-right">
                            {formatMessageTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        
        <DrawerFooter className="border-t pt-4 pb-6">
          <div className="flex gap-2">
            <Input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading || !chatThread}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!message.trim() || loading || !chatThread}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;
