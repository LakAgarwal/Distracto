
import React, { useState } from 'react';
import { Friend } from '@/types/friend';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserPlus, MoreVertical, MessageCircle, UserMinus, ChartLine } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FriendsListProps {
  friends: Friend[];
  loading: boolean;
  onSendFriendRequest: (email: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onStartChat: (friendId: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ 
  friends, 
  loading, 
  onSendFriendRequest,
  onRemoveFriend,
  onStartChat
}) => {
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSendRequest = () => {
    onSendFriendRequest(email);
    setEmail('');
    setDialogOpen(false);
  };
  
  const getStatusColor = (status: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-amber-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
        </span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Friend</DialogTitle>
              <DialogDescription>
                Send a friend request to connect with someone on Distracto.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Input 
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendRequest}>Send Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {friends.length === 0 ? (
        <div className="text-center py-10">
          <UserPlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">No Friends Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add friends to connect, share productivity stats, and chat.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {friends.map((friend) => (
            <li 
              key={friend.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={friend.photoURL} />
                    <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`}
                  />
                </div>
                <div>
                  <div className="font-medium">{friend.displayName}</div>
                  <div className="text-sm text-muted-foreground">{friend.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" onClick={() => onStartChat(friend.id)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStartChat(friend.id)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ChartLine className="h-4 w-4 mr-2" />
                      Compare Productivity
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => onRemoveFriend(friend.id)}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remove Friend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
