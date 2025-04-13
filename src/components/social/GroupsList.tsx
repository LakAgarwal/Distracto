
import React, { useState, useEffect } from 'react';
import { FriendGroup } from '@/types/friend';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Users } from 'lucide-react';
import { friendsAPI } from '@/services/friends-api';

interface GroupsListProps {
  onCreateChat: (groupId: string, memberIds: string[]) => void;
}

const GroupsList: React.FC<GroupsListProps> = ({ onCreateChat }) => {
  const [groups, setGroups] = useState<FriendGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupsData = await friendsAPI.getFriendGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error("Error loading groups:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, []);

  const handleCreateGroupChat = (group: FriendGroup) => {
    const memberIds = group.members.map(member => member.id);
    onCreateChat(group.id, memberIds);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
      
      {groups.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">No Groups Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a group to connect with multiple friends at once.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li 
              key={group.id} 
              className="p-4 rounded-lg border border-border hover:bg-primary/5 transition-all"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-lg">{group.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {group.description || `A group with ${group.members.length} members`}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCreateGroupChat(group)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
              
              <div className="flex -space-x-2 overflow-hidden mt-2">
                {group.members.map((member, i) => (
                  <Avatar key={member.id} className="border-2 border-background w-8 h-8">
                    <AvatarImage src={member.photoURL} />
                    <AvatarFallback>{member.displayName[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs border-2 border-background">
                    +{group.members.length - 5}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default GroupsList;
