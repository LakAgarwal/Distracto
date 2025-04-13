
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { LoaderCircle, CheckCircle, Clock, Coffee, Brain, DumbbellIcon, BookOpen, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateTimeTable } from '@/utils/openai';

type Task = {
  time: string;
  description: string;
};

type Schedule = {
  date: string;
  tasks: Task[];
};

const TimeTableGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter your requirements');
      return;
    }
    
    // Get API key from localStorage
    let key = localStorage.getItem('gemini_api_key') || localStorage.getItem('ai_api_key');
    
    if (!key) {
      setShowApiKeyInput(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await generateTimeTable(prompt, key);
      setSchedule(result.schedule);
      setRecommendations(result.recommendations);
      toast.success('Timetable generated successfully');
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Failed to generate timetable. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('ai_api_key', apiKey);
    setShowApiKeyInput(false);
    toast.success('API key saved successfully');
    
    // Auto-submit if there was a prompt
    if (prompt.trim()) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  };

  const downloadCSV = () => {
    if (!schedule) return;
    
    let csvContent = 'Time,Description\n';
    schedule.tasks.forEach(task => {
      csvContent += `"${task.time}","${task.description}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `timetable-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTaskIcon = (description: string) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('work') || desc.includes('task') || desc.includes('project') || desc.includes('priority')) {
      return <Brain className="h-4 w-4 mr-2 text-primary" />;
    } else if (desc.includes('exercise') || desc.includes('workout') || desc.includes('fitness') || desc.includes('movement')) {
      return <DumbbellIcon className="h-4 w-4 mr-2 text-rose-500" />;
    } else if (desc.includes('eat') || desc.includes('breakfast') || desc.includes('lunch') || desc.includes('dinner')) {
      return <Coffee className="h-4 w-4 mr-2 text-amber-500" />;
    } else if (desc.includes('learn') || desc.includes('study') || desc.includes('read')) { 
      return <BookOpen className="h-4 w-4 mr-2 text-blue-500" />;
    } else if (desc.includes('relax') || desc.includes('meditation') || desc.includes('mindful')) {
      return <HeartPulse className="h-4 w-4 mr-2 text-purple-500" />;
    } else {
      return <Clock className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <Card className="p-6 glass">
          <h2 className="text-2xl font-semibold mb-4">Generate Your Perfect Schedule</h2>
          <p className="text-muted-foreground mb-6">
            Tell us about your goals, preferences, and constraints, and we'll create a personalized timetable for you using Google's Gemini 1.5 Flash AI.
          </p>
          
          {showApiKeyInput ? (
            <div className="mb-6 p-4 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium mb-2">Connect to Google Gemini</h3>
              <p className="text-muted-foreground mb-4">
                Enter your Google AI API key to generate personalized schedules with Gemini 1.5 Flash. 
                You can obtain an API key from makersuite.google.com.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="Your Gemini API key..." 
                  className="flex-1"
                />
                <Button onClick={saveApiKey}>Save Key</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your API key is stored locally and is only used for requests to the Google Gemini API.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Your requirements</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: I need a productive schedule for a work day where I can focus on deep work in the morning, handle meetings after lunch, and exercise in the evening."
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Generate Timetable
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>

        {schedule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 glass">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Schedule</h2>
                <span className="text-sm text-muted-foreground">{schedule.date}</span>
              </div>

              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="space-y-4">
                  {schedule.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="min-w-[120px] text-sm text-muted-foreground">
                        {task.time}
                      </div>
                      <div className="flex-1">
                        <div className="bg-primary/10 rounded-lg p-3 relative">
                          <div className="absolute w-2 h-2 rounded-full bg-primary left-[-18px] top-[14px]"></div>
                          <div className="flex items-center">
                            {getTaskIcon(task.description)}
                            <p>{task.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>
                
                <TabsContent value="list">
                  <div className="space-y-2">
                    {schedule.tasks.map((task, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-primary/5 transition-all"
                      >
                        <span className="text-primary font-medium">{task.time}</span>
                        <span className="flex-1 ml-4 flex items-center">
                          {getTaskIcon(task.description)}
                          {task.description}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {recommendations.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Personalized Recommendations</h3>
                  <ul className="space-y-2 pl-2">
                    {recommendations.map((rec, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <div className="min-w-4 pt-1">•</div>
                        <p className="text-sm text-muted-foreground">{rec}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="my-4" />
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={downloadCSV}>
                  Download as CSV
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TimeTableGenerator;
