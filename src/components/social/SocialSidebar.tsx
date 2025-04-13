
import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, UserCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { userSearchService } from '@/services/user-search-service';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';
import UserProfileDialog from './UserProfileDialog';

interface SocialSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SocialSidebar: React.FC<SocialSidebarProps> = ({ open, onOpenChange }) => {
  const { user, followUser, unfollowUser, getFollowers, getFollowing } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('following');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);

  // Load followers and following
  useEffect(() => {
    if (user) {
      setFollowers(getFollowers());
      setFollowing(getFollowing());
    }
  }, [user, getFollowers, getFollowing]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await userSearchService.searchByDistractoId(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;
    
    await followUser(userId);
    
    // Update UI for both followers and following
    const userToUpdate = [...searchResults, ...followers, ...following]
      .find(u => u.id === userId);
    
    if (userToUpdate) {
      // If user was in followers list, they should now be in both lists
      if (followers.some(f => f.id === userId) && !following.some(f => f.id === userId)) {
        setFollowing(prev => [...prev, userToUpdate]);
        toast.success(`You are now following ${userToUpdate.displayName}`);
      }
      
      // Update local state to reflect changes
      setFollowers(getFollowers());
      setFollowing(getFollowing());
      
      // Update selected user if it's the one we just followed
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({...selectedUser});
      }
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!user) return;
    
    await unfollowUser(userId);
    
    // Remove user from following list
    setFollowing(prev => prev.filter(f => f.id !== userId));
    toast.success(`You have unfollowed this user`);
    
    // Update selected user if it's the one we just unfollowed
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({...selectedUser});
    }
  };

  const isFollowing = (userId: string): boolean => {
    return user?.following?.includes(userId) || false;
  };
  
  const handleOpenProfile = (clickedUser: User) => {
    setSelectedUser(clickedUser);
    setProfileDialogOpen(true);
  };
  
  const handleMessage = (userId: string) => {
    // In a real app, this would navigate to or open a chat
    toast.info(`Messaging feature coming soon!`);
    setProfileDialogOpen(false);
  };

  // Generate more example users with richer data
  const exampleUsers: User[] = [
    {
      id: 'user5',
      displayName: 'Alex Rodriguez',
      email: 'alex@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=5',
      preferences: {
        goal: 'Reduce screen time by 30%',
        occupation: 'Software Developer',
        college: 'Stanford University',
        interests: ['Programming', 'AI', 'Fitness'],
        distractoId: 'alexr'
      }
    },
    {
      id: 'user6',
      displayName: 'Emma Williams',
      email: 'emma@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=6',
      preferences: {
        goal: 'Stay focused during work hours',
        occupation: 'Digital Marketing',
        college: 'NYU',
        interests: ['Social Media', 'Content Creation', 'Photography'],
        distractoId: 'emmaw'
      }
    },
    {
      id: 'user7',
      displayName: 'David Kim',
      email: 'david@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=7',
      preferences: {
        goal: 'Better work-life balance',
        occupation: 'Product Manager',
        college: 'UC Berkeley',
        interests: ['Product Strategy', 'UX Design', 'Hiking'],
        distractoId: 'davidk'
      }
    },
    {
      id: 'user8',
      displayName: 'Sophia Patel',
      email: 'sophia@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=8',
      preferences: {
        goal: 'Limit social media usage',
        occupation: 'Graphic Designer',
        college: 'RISD',
        interests: ['Typography', 'Visual Arts', 'Travel'],
        distractoId: 'sophiap'
      }
    },
    {
      id: 'user9',
      displayName: 'James Wilson',
      email: 'james@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=9',
      preferences: {
        goal: 'Study without distractions',
        occupation: 'Graduate Student',
        college: 'MIT',
        interests: ['Research', 'Data Science', 'Chess'],
        distractoId: 'jamesw'
      }
    },
    {
      id: 'user10',
      displayName: 'Olivia Martinez',
      email: 'olivia@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=10',
      preferences: {
        goal: 'Focus on deep work',
        occupation: 'Writer',
        college: 'Columbia',
        interests: ['Creative Writing', 'Literature', 'Mindfulness'],
        distractoId: 'oliviam'
      }
    }
  ];

  // Mix some of the example users into followers and following for demonstration
  const allFollowers = [...followers, exampleUsers[0], exampleUsers[1], exampleUsers[2]];
  const allFollowing = [...following, exampleUsers[3], exampleUsers[4]];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[350px] sm:w-[450px] p-0 overflow-y-auto">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Distracto Social</SheetTitle>
          </SheetHeader>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {isSearching ? (
              <div className="mt-2 text-center text-sm text-muted-foreground">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium">Search Results</h3>
                <ul className="space-y-2">
                  {searchResults.map((searchUser) => (
                    <li 
                      key={searchUser.id} 
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      onClick={() => handleOpenProfile(searchUser)}
                    >
                      <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar>
                          <AvatarImage src={searchUser.photoURL} />
                          <AvatarFallback>{searchUser.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{searchUser.displayName}</p>
                          <p className="text-xs text-muted-foreground">{searchUser.preferences?.distractoId}</p>
                        </div>
                      </div>
                      {user?.id !== searchUser.id && (
                        <Button
                          size="sm"
                          variant={isFollowing(searchUser.id) ? "outline" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            isFollowing(searchUser.id) 
                              ? handleUnfollow(searchUser.id) 
                              : handleFollow(searchUser.id);
                          }}
                        >
                          {isFollowing(searchUser.id) ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="p-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="followers">
                  <Users className="h-4 w-4 mr-2" />
                  Followers
                </TabsTrigger>
                <TabsTrigger value="following">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Following
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="followers" className="mt-4 space-y-4">
                {allFollowers.length > 0 ? (
                  <ul className="space-y-2">
                    {allFollowers.map((follower) => (
                      <li 
                        key={follower.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        onClick={() => handleOpenProfile(follower)}
                      >
                        <div className="flex items-center gap-3 cursor-pointer">
                          <Avatar>
                            <AvatarImage src={follower.photoURL} />
                            <AvatarFallback>{follower.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{follower.displayName}</p>
                            <p className="text-xs text-muted-foreground">{follower.preferences?.distractoId || follower.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isFollowing(follower.id) ? "outline" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            isFollowing(follower.id) 
                              ? handleUnfollow(follower.id) 
                              : handleFollow(follower.id);
                          }}
                        >
                          {isFollowing(follower.id) ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Follow Back
                            </>
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No followers yet</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="following" className="mt-4 space-y-4">
                {allFollowing.length > 0 ? (
                  <ul className="space-y-2">
                    {allFollowing.map((following) => (
                      <li 
                        key={following.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        onClick={() => handleOpenProfile(following)}  
                      >
                        <div className="flex items-center gap-3 cursor-pointer">
                          <Avatar>
                            <AvatarImage src={following.photoURL} />
                            <AvatarFallback>{following.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{following.displayName}</p>
                            <p className="text-xs text-muted-foreground">{following.preferences?.distractoId || following.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnfollow(following.id);
                          }}
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Unfollow
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>You're not following anyone yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <UserProfileDialog 
        user={selectedUser}
        isOpen={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        currentUserId={user?.id}
        isFollowing={selectedUser ? isFollowing(selectedUser.id) : false}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onMessage={handleMessage}
      />
    </>
  );
};

export default SocialSidebar;
