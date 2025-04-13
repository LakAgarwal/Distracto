
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { friendsAPI } from '@/services/friends-api';
import { Friend, FriendRequest, ChatThread } from '@/types/friend';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus, Users, MessageCircle, ChartLine } from 'lucide-react';
import { toast } from 'sonner';
import FriendsList from './FriendsList';
import FriendRequests from './FriendRequests';
import GroupsList from './GroupsList';
import CreateGroupDialog from './CreateGroupDialog';
import ChatList from './ChatList';
import ChatPanel from './ChatPanel';
import ProductivityComparison from './ProductivityComparison';

const SocialDashboard: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("friends");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatThread | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [friendsData, requestsData, chatsData] = await Promise.all([
          friendsAPI.getFriends(),
          friendsAPI.getFriendRequests(),
          friendsAPI.getChatThreads()
        ]);
        
        setFriends(friendsData);
        setFriendRequests(requestsData);
        setChatThreads(chatsData);
      } catch (error) {
        console.error("Error loading social data:", error);
        toast.error("Failed to load social data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleSendFriendRequest = async (email: string) => {
    try {
      await friendsAPI.sendFriendRequest(email);
      toast.success("Friend request sent successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send friend request");
    }
  };
  
  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      const newFriend = await friendsAPI.acceptFriendRequest(requestId);
      setFriends([...friends, newFriend]);
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Failed to accept friend request");
    }
  };
  
  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      await friendsAPI.declineFriendRequest(requestId);
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
      toast.success("Friend request declined");
    } catch (error) {
      toast.error("Failed to decline friend request");
    }
  };
  
  const handleRemoveFriend = async (friendId: string) => {
    try {
      await friendsAPI.removeFriend(friendId);
      setFriends(friends.filter(friend => friend.id !== friendId));
      toast.success("Friend removed");
    } catch (error) {
      toast.error("Failed to remove friend");
    }
  };
  
  const handleSelectChat = async (chatId: string) => {
    try {
      setSelectedChatId(chatId);
      const chatThread = await friendsAPI.getChatThread(chatId);
      setCurrentChat(chatThread);
    } catch (error) {
      toast.error("Failed to load chat");
    }
  };
  
  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !currentChat) return;
    
    try {
      const newMessage = await friendsAPI.sendMessage(selectedChatId, content);
      
      // Update the local chat state
      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, newMessage],
        lastMessage: newMessage
      });
      
      // Update the chat threads list
      setChatThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === selectedChatId 
            ? { ...thread, lastMessage: newMessage }
            : thread
        )
      );
    } catch (error) {
      toast.error("Failed to send message");
    }
  };
  
  const handleCreateGroup = async (name: string, description: string, memberIds: string[]) => {
    try {
      await friendsAPI.createFriendGroup(name, description, memberIds);
      setShowCreateGroup(false);
      toast.success("Group created successfully!");
      // Reload groups in a real app
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create group");
    }
  };
  
  const handleCreateChat = async (participantIds: string[], isGroup: boolean, groupName?: string) => {
    try {
      const newThread = await friendsAPI.createChatThread(participantIds, isGroup, groupName);
      setChatThreads([newThread, ...chatThreads]);
      setSelectedChatId(newThread.id);
      setCurrentChat(newThread);
      setSelectedTab("messages");
      toast.success(isGroup ? "Group chat created" : "Chat started");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create chat");
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Connect with Friends</h3>
          <p className="text-muted-foreground mb-6">
            Log in to connect with friends, compare productivity, and chat with each other.
          </p>
          <Button asChild>
            <a href="/login">Log In to Continue</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="friends">
            <Users className="h-4 w-4 mr-2" />
            Friends & Groups
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <ChartLine className="h-4 w-4 mr-2" />
            Productivity Comparison
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="friends" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Friends</h2>
              <Button size="sm" onClick={() => setShowCreateGroup(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
            
            <FriendsList 
              friends={friends} 
              loading={loading} 
              onSendFriendRequest={handleSendFriendRequest}
              onRemoveFriend={handleRemoveFriend}
              onStartChat={(friendId) => handleCreateChat([friendId], false)}
            />
            
            {friendRequests.length > 0 && (
              <div className="mt-6">
                <Separator className="my-4" />
                <h3 className="text-lg font-medium mb-4">Friend Requests</h3>
                <FriendRequests
                  requests={friendRequests}
                  onAccept={handleAcceptFriendRequest}
                  onDecline={handleDeclineFriendRequest}
                />
              </div>
            )}
          </Card>
          
          <GroupsList onCreateChat={(groupId, memberIds) => handleCreateChat(memberIds, true, `Group ${groupId}`)} />
        </TabsContent>
        
        <TabsContent value="messages">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <ChatList 
                  chats={chatThreads} 
                  selectedChatId={selectedChatId}
                  onSelectChat={handleSelectChat}
                  friends={friends}
                  onCreateChat={handleCreateChat}
                />
              </Card>
            </div>
            <div className="md:col-span-2">
              {currentChat ? (
                <ChatPanel 
                  chat={currentChat} 
                  onSendMessage={handleSendMessage} 
                />
              ) : (
                <Card className="h-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No chat selected</h3>
                    <p className="text-muted-foreground">
                      Select a chat or start a new conversation
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison">
          <ProductivityComparison friends={friends} />
        </TabsContent>
      </Tabs>
      
      <CreateGroupDialog
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
        friends={friends}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default SocialDashboard;
