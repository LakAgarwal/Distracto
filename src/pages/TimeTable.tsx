
import React from 'react';
import TimeTableGenerator from '@/components/TimeTableGenerator';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import AIAssistant from '@/components/AIAssistant';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TimeTable = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <AnimatedTransition>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Timetable Generator</h1>
              <p className="text-muted-foreground">Create your personalized schedule with AI assistance powered by Gemini 1.5 Flash</p>
            </div>
            
            {!isAuthenticated && (
              <Alert className="mb-6 border-amber-500 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-500">You're not logged in</AlertTitle>
                <AlertDescription>
                  Log in to save your API key and generated timetables across devices.
                </AlertDescription>
              </Alert>
            )}
            
            <TimeTableGenerator />
          </div>
        </AnimatedTransition>
      </main>
      
      <AIAssistant />
    </div>
  );
};

export default TimeTable;
