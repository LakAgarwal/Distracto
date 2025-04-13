
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Brain, CheckCircle, LoaderCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type AIInsight = {
  type: 'productivity' | 'recommendation' | 'analysis';
  content: string;
};

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Check for existing API key on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  // Example analysis data - in a real app, this would be actual screen time data
  const screenTimeData = {
    mostUsedApps: ['Visual Studio Code', 'Chrome', 'Slack', 'Spotify'],
    productiveTime: '4h 15m',
    unproductiveTime: '2h 30m',
    productivityRatio: '63%',
    peakHours: '9:00 AM - 11:30 AM',
    distractions: ['Social Media', 'News Sites', 'Video Streaming'],
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    try {
      localStorage.setItem('gemini_api_key', apiKey);
      setIsApiKeySet(true);
      setShowApiKeyInput(false);
      toast.success('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key. Please try again.');
    }
  };

  const handleChatGPTRequest = async () => {
    setLoading(true);
    const storedApiKey = localStorage.getItem('gemini_api_key');
    
    if (!storedApiKey) {
      setShowApiKeyInput(true);
      setLoading(false);
      return;
    }
    
    try {
      // In a real implementation, you would make an actual API call to Gemini here
      // This is a simulated response for demonstration purposes
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock insights based on the screen time data
      const newInsights: AIInsight[] = [
        {
          type: 'analysis',
          content: 'Based on your screen time data, your most productive hours are in the morning (9:00 AM - 11:30 AM). You spend most of your time in development tools and communication apps.'
        },
        {
          type: 'productivity',
          content: 'Your productivity ratio of 63% is above average! However, you might be getting distracted by social media during your peak focus periods.'
        },
        {
          type: 'recommendation',
          content: 'Consider scheduling deep work sessions during your morning peak hours and blocking social media during these times to boost productivity by an estimated 15-20%.'
        }
      ];
      
      setInsights(newInsights);
      toast.success('AI analysis completed');
    } catch (error) {
      console.error('Error with Gemini request:', error);
      toast.error('Failed to get AI insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    const storedApiKey = localStorage.getItem('gemini_api_key');
    
    if (!storedApiKey) {
      setShowApiKeyInput(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, you would make an actual API call to Gemini here
      // This is a simulated response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInsight: AIInsight = {
        type: 'recommendation',
        content: `Based on your request: "${userMessage}", I recommend creating a focused work schedule that alternates 50 minutes of deep work with 10-minute breaks. Your screen time data suggests this rhythm aligns well with your natural productivity patterns.`
      };
      
      setInsights(prev => [...prev, newInsight]);
      setUserMessage('');
      toast.success('Received AI response');
    } catch (error) {
      console.error('Error with custom prompt:', error);
      toast.error('Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const insightVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getIconForInsightType = (type: AIInsight['type']) => {
    switch (type) {
      case 'productivity':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'recommendation':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'analysis':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-6 glass">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 mr-3">
          <Brain className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold">AI-Powered Insights</h2>
      </div>

      {showApiKeyInput ? (
        <div className="mb-6 p-4 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">Connect to Gemini AI</h3>
          <p className="text-muted-foreground mb-4">
            Enter your Google AI API key to unlock personalized AI insights based on your screen time data.
          </p>
          <div className="flex gap-2">
            <Input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Your Google AI API key..." 
              className="flex-1"
            />
            <Button onClick={saveApiKey}>Save Key</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your API key is stored locally and is only used for requests to the Google AI API.
          </p>
        </div>
      ) : !isApiKeySet && insights.length === 0 ? (
        <div className="flex justify-center mb-6">
          <Button 
            onClick={() => setShowApiKeyInput(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Connect Your Gemini Account
          </Button>
        </div>
      ) : null}

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <Button
            onClick={handleChatGPTRequest}
            className="mb-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze My Screen Time
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Get personalized insights and recommendations based on your usage patterns
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                variants={insightVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIconForInsightType(insight.type)}
                  </div>
                  <div>
                    <p>{insight.content}</p>
                    <p className="text-xs text-muted-foreground mt-2 capitalize">
                      {insight.type} • AI Generated
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Separator className="my-6" />

          <form onSubmit={handleCustomPrompt} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userMessage">Ask for custom insights</Label>
              <div className="flex gap-2">
                <Textarea
                  id="userMessage"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Example: How can I improve my focus during afternoon hours?"
                  className="flex-1 resize-none"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={loading || !userMessage.trim()}
                  className="h-auto"
                >
                  {loading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};

export default AIInsights;
