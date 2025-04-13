
import React from 'react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import AIAssistant from '@/components/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialDashboard from '@/components/social/SocialDashboard';
import FindUsers from '@/components/social/FindUsers';
import { UsersRound, UserPlus, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Social = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <AnimatedTransition>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Social Dashboard</h1>
              <p className="text-muted-foreground">Connect with friends, compare productivity, and stay motivated together</p>
            </div>
            
            {!isAuthenticated ? (
              <Card className="p-6 text-center">
                <div className="py-10">
                  <UsersRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Connect with Friends</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Log in to connect with friends, share productivity stats, and build a community
                    of like-minded individuals focused on digital wellbeing.
                  </p>
                  <Button asChild>
                    <a href="/login">Log In to Continue</a>
                  </Button>
                </div>
              </Card>
            ) : (
              <Tabs defaultValue="social">
                <TabsList className="mb-6">
                  <TabsTrigger value="social">
                    <UsersRound className="h-4 w-4 mr-2" />
                    Friends & Groups
                  </TabsTrigger>
                  <TabsTrigger value="discover">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Discover Users
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="social">
                  <SocialDashboard />
                </TabsContent>
                
                <TabsContent value="discover">
                  <FindUsers />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </AnimatedTransition>
      </main>
      
      <AIAssistant />
    </div>
  );
};

export default Social;
