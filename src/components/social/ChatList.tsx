
import React, { useState } from 'react';
import { ChatThread, Friend } from '@/types/friend';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Users } from 'lucide-react';
import { format } from 'date-fns';

interface ChatListProps {
  chats: ChatThread[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  friends: Friend[];
  onCreateChat: (participantIds: string[], isGroup: boolean, groupName?: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  friends,
  onCreateChat
}) => {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState('');

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateChat = () => {
    onCreateChat(selectedFriends, isGroupChat, isGroupChat ? groupName : undefined);
    resetForm();
    setNewChatDialogOpen(false);
  };

  const resetForm = () => {
    setSelectedFriends([]);
    setIsGroupChat(false);
    setGroupName('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MM/dd/yyyy');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setNewChatDialogOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {chats.length === 0 ? (
          <div className="text-center p-6">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-2">No Conversations Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start a new conversation with a friend.
            </p>
          </div>
        ) : (
          <ul className="p-2">
            {chats.map((chat) => {
              const isSelected = selectedChatId === chat.id;
              const otherParticipant = chat.isGroupChat 
                ? null 
                : friends.find(f => f.id === chat.participants.find(p => p !== 'currentUser'));
              
              return (
                <li 
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`
                    py-3 px-4 rounded-lg mb-1 cursor-pointer
                    ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {chat.isGroupChat ? (
                      <Avatar>
                        <AvatarFallback className="bg-indigo-500 text-primary-foreground">
                          <Users className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage src={otherParticipant?.photoURL} />
                        <AvatarFallback>
                          {otherParticipant?.displayName[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <div className="font-medium truncate">
                          {chat.isGroupChat 
                            ? chat.groupName 
                            : otherParticipant?.displayName || 'Unknown'}
                        </div>
                        {chat.lastMessage && (
                          <div className="text-xs text-muted-foreground">
                            {formatTime(chat.lastMessage.timestamp)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </div>
                        
                        {chat.unreadCount > 0 && (
                          <div className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
      
      <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="is-group-chat"
                checked={isGroupChat}
                onCheckedChange={(checked) => setIsGroupChat(checked === true)}
              />
              <Label htmlFor="is-group-chat">Create a group chat</Label>
            </div>
            
            {isGroupChat && (
              <div className="mb-4">
                <Label htmlFor="group-name" className="mb-2 block">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <Label className="mb-2 block">
                Select {isGroupChat ? 'members' : 'a friend'}
              </Label>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {friends.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    You don't have any friends yet. Add friends first.
                  </p>
                ) : (
                  friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="flex items-center space-x-3 py-1"
                    >
                      <Checkbox 
                        id={`chat-friend-${friend.id}`}
                        checked={selectedFriends.includes(friend.id)}
                        onCheckedChange={() => handleFriendToggle(friend.id)}
                      />
                      <Label 
                        htmlFor={`chat-friend-${friend.id}`} 
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={friend.photoURL} />
                          <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <span>{friend.displayName}</span>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewChatDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateChat}
              disabled={
                selectedFriends.length === 0 || 
                (isGroupChat && !groupName.trim())
              }
            >
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatList;
