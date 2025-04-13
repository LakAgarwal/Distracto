
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  UserCheck, 
  UserPlus, 
  Target, 
  Briefcase,
  BookOpen,
  Tag,
  Phone
} from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import CallDialog from './CallDialog';
import ChatDrawer from './ChatDrawer';

interface UserProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
  isFollowing: boolean;
  onFollow: (userId: string) => Promise<void>;
  onUnfollow: (userId: string) => Promise<void>;
  onMessage: (userId: string) => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  user,
  isOpen,
  onOpenChange,
  currentUserId,
  isFollowing,
  onFollow,
  onUnfollow,
  onMessage
}) => {
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  
  if (!user) return null;
  
  const handleFollowAction = () => {
    if (isFollowing) {
      onUnfollow(user.id);
    } else {
      onFollow(user.id);
    }
  };
  
  const handleMessageClick = () => {
    setChatDrawerOpen(true);
    onMessage(user.id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.photoURL} />
              <AvatarFallback className="text-lg">{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className="text-muted-foreground">@{user.preferences?.distractoId || user.email.split('@')[0]}</p>
            
            {currentUserId !== user.id && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowAction}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                
                <Button onClick={handleMessageClick}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                
                <Button variant="outline" size="icon" onClick={() => setCallDialogOpen(true)}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-3 py-2">
            {user.preferences?.goal && (
              <div className="flex items-start">
                <Target className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <p className="text-sm">{user.preferences.goal}</p>
              </div>
            )}
            
            {user.preferences?.occupation && (
              <div className="flex items-start">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <p className="text-sm">{user.preferences.occupation}</p>
              </div>
            )}
            
            {user.preferences?.college && (
              <div className="flex items-start">
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <p className="text-sm">{user.preferences.college}</p>
              </div>
            )}
          </div>
          
          {user.preferences?.interests && user.preferences.interests.length > 0 && (
            <div className="pt-2">
              <div className="flex items-start">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                <div className="flex flex-wrap gap-1">
                  {user.preferences.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{interest}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <CallDialog 
        open={callDialogOpen} 
        onOpenChange={setCallDialogOpen} 
        user={user}
      />
      
      <ChatDrawer
        user={user}
        isOpen={chatDrawerOpen}
        onOpenChange={setChatDrawerOpen}
      />
    </>
  );
};

export default UserProfileDialog;
