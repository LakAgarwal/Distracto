import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, UserPreferences } from '@/hooks/useAuth';
import { Check, Loader2, Key, User, BookOpen, Briefcase, Target } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
});

const preferencesSchema = z.object({
  distractoId: z.string().min(3, { message: 'DistractoID must be at least 3 characters' }),
  goal: z.string().optional(),
  occupation: z.string().optional(),
  college: z.string().optional(),
  interests: z.string().optional(),
});

const apiKeySchema = z.object({
  apiKey: z.string().min(20, { message: 'API key must be at least 20 characters' })
});

const Profile: React.FC = () => {
  const { user, updateUserProfile, updateUserPreferences } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isSavingApiKey, setIsSavingApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      distractoId: user?.preferences?.distractoId || '',
      goal: user?.preferences?.goal || '',
      occupation: user?.preferences?.occupation || '',
      college: user?.preferences?.college || '',
      interests: user?.preferences?.interests?.join(', ') || '',
    },
  });

  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: apiKey,
    },
  });

  useEffect(() => {
    apiKeyForm.reset({ apiKey });
  }, [apiKey, apiKeyForm]);

  const onSubmitProfile = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      updateUserProfile({
        displayName: values.displayName,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPreferences = async (values: z.infer<typeof preferencesSchema>) => {
    setIsSavingPreferences(true);
    try {
      const preferences: UserPreferences = {
        distractoId: values.distractoId,
        goal: values.goal,
        occupation: values.occupation,
        college: values.college,
        interests: values.interests ? values.interests.split(',').map(i => i.trim()) : [],
      };
      
      updateUserPreferences(preferences);
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Preferences update error:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const onSubmitApiKey = async (values: z.infer<typeof apiKeySchema>) => {
    setIsSavingApiKey(true);
    try {
      localStorage.setItem('openai_api_key', values.apiKey);
      setApiKey(values.apiKey);
      toast.success('API key saved successfully');
    } catch (error) {
      console.error('API key save error:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSavingApiKey(false);
    }
  };

  if (!user) {
    return null; // Or a loading state
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <AnimatedTransition>
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account and application settings</p>
            </div>
            
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} disabled />
                            </FormControl>
                            <FormDescription>
                              Email cannot be changed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preferences & Interests</CardTitle>
                  <CardDescription>
                    Add your preferences to find like-minded people
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...preferencesForm}>
                    <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-4">
                      <FormField
                        control={preferencesForm.control}
                        name="distractoId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DistractoID</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">@</span>
                                <Input 
                                  className="rounded-l-none" 
                                  placeholder="yourdistractoid" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Your unique identifier for Distracto
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Productivity Goal</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Target className="h-4 w-4 mr-2 absolute ml-3 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Reduce screen time by 30%" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              What productivity goal are you working towards?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2 absolute ml-3 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Software Developer, Student, etc." {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College/University</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 absolute ml-3 text-muted-foreground" />
                                <Input className="pl-9" placeholder="MIT, Stanford, etc." {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Productivity, Focus techniques, Time management (separate with commas)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your interests separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isSavingPreferences}>
                        {isSavingPreferences ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>OpenAI API Key</CardTitle>
                  <CardDescription>
                    Provide your OpenAI API key to enable AI features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...apiKeyForm}>
                    <form onSubmit={apiKeyForm.handleSubmit(onSubmitApiKey)} className="space-y-4">
                      <FormField
                        control={apiKeyForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input 
                                type="password"
                                placeholder="sk-..." 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  setApiKey(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Your key is stored locally and never sent to our servers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSavingApiKey}>
                        {isSavingApiKey ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Key className="mr-2 h-4 w-4" />
                            Save API Key
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default Profile;
