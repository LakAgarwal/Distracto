
import React, { useState, useEffect, useRef } from 'react';
import { userSearchService } from '@/services/user-search-service';
import { User } from '@/hooks/useAuth';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, Search, UserPlus, UserCheck, Target, Briefcase, BookOpen, Tag } from 'lucide-react';
import { toast } from 'sonner';
import UserProfileDialog from './UserProfileDialog';

const FindUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { user, followUser, unfollowUser } = useAuth();
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) return;
      
      try {
        const recommended = await userSearchService.getRecommendedUsers(user.id);
        setRecommendedUsers(recommended);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user]);

  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-suggestion as user types
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchQuery.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      
      try {
        const results = await userSearchService.autoSuggestUsers(searchQuery);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error getting suggestions:', error);
      }
    };
    
    const timeoutId = setTimeout(getSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const results = await userSearchService.searchByDistractoId(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchByGoal = async (goal: string) => {
    setIsSearching(true);
    try {
      const results = await userSearchService.searchByPreferences({ goal });
      setSearchResults(results);
    } catch (error) {
      console.error('Search by goal error:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      // Update the UI to reflect the change
      toast.success('User followed successfully');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
      // Update the UI to reflect the change
      toast.success('User unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow user');
    }
  };

  const handleSuggestionSelect = (selectedUser: User) => {
    setSearchQuery(selectedUser.displayName);
    setShowSuggestions(false);
    setSearchResults([selectedUser]);
  };

  const handleOpenProfile = (clickedUser: User) => {
    setSelectedUser(clickedUser);
    setProfileDialogOpen(true);
  };

  const isFollowing = (userId: string): boolean => {
    return user?.following?.includes(userId) || false;
  };

  const UserCard: React.FC<{ user: User }> = ({ user: displayUser }) => {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleOpenProfile(displayUser)}>
              <Avatar>
                <AvatarImage src={displayUser.photoURL} />
                <AvatarFallback>{displayUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{displayUser.displayName}</CardTitle>
                <CardDescription className="text-xs">@{displayUser.preferences?.distractoId}</CardDescription>
              </div>
            </div>
            {user && user.id !== displayUser.id && (
              isFollowing(displayUser.id) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnfollow(displayUser.id)}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Following
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleFollow(displayUser.id)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Follow
                </Button>
              )
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-2">
          {displayUser.preferences?.goal && (
            <div className="flex items-start mb-2">
              <Target className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <p className="text-sm">{displayUser.preferences.goal}</p>
            </div>
          )}
          
          {displayUser.preferences?.occupation && (
            <div className="flex items-start mb-2">
              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <p className="text-sm">{displayUser.preferences.occupation}</p>
            </div>
          )}
          
          {displayUser.preferences?.college && (
            <div className="flex items-start mb-2">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <p className="text-sm">{displayUser.preferences.college}</p>
            </div>
          )}
        </CardContent>
        
        {displayUser.preferences?.interests && displayUser.preferences.interests.length > 0 && (
          <CardFooter className="pt-0 pb-4">
            <div className="flex items-start">
              <Tag className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
              <div className="flex flex-wrap gap-1">
                {displayUser.preferences.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">{interest}</Badge>
                ))}
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div>
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="search">Search Users</TabsTrigger>
          <TabsTrigger value="recommended">Recommended Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Find Distracto Users</CardTitle>
              <CardDescription>
                Search for users by DistractoID or common productivity goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col relative">
                  <div className="flex space-x-2 w-full">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Search by name or DistractoID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                    </Button>
                  </div>
                  
                  {showSuggestions && (
                    <div ref={commandRef} className="w-full">
                      <Command className="rounded-lg border shadow-md mt-1 overflow-hidden">
                        <CommandList>
                          <CommandGroup heading="Suggestions">
                            {suggestions.length > 0 ? (
                              suggestions.map((suggestionUser) => (
                                <CommandItem
                                  key={suggestionUser.id}
                                  onSelect={() => handleSuggestionSelect(suggestionUser)}
                                  className="flex items-center gap-2 p-2 cursor-pointer"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={suggestionUser.photoURL} />
                                    <AvatarFallback>{suggestionUser.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{suggestionUser.displayName}</p>
                                    <p className="text-xs text-muted-foreground">@{suggestionUser.preferences?.distractoId}</p>
                                  </div>
                                </CommandItem>
                              ))
                            ) : (
                              <CommandEmpty>No users found</CommandEmpty>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <p className="w-full text-sm text-muted-foreground mb-1">Common productivity goals:</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSearchByGoal('Reduce screen time')}
                  >
                    Reduce screen time
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSearchByGoal('Better focus')}
                  >
                    Better focus
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSearchByGoal('Work-life balance')}
                  >
                    Work-life balance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {searchResults.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
          
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <div className="mt-6 text-center p-6 bg-muted rounded-lg">
              <p className="text-muted-foreground">No users found matching "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : recommendedUsers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No recommended users yet. Try updating your preferences to find like-minded individuals.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <UserProfileDialog 
        user={selectedUser}
        isOpen={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        currentUserId={user?.id}
        isFollowing={selectedUser ? isFollowing(selectedUser.id) : false}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onMessage={(userId) => {
          setProfileDialogOpen(false);
          toast.info(`Opening chat with user ${userId}`);
        }}
      />
    </div>
  );
};

export default FindUsers;
