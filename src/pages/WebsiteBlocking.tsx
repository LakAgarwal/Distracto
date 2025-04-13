
import React from 'react';
import WebsiteBlocker from '@/components/WebsiteBlocker';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import StickyNotepad from '@/components/StickyNotepad';
import AIAssistant from '@/components/AIAssistant';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InfoIcon } from 'lucide-react';

const WebsiteBlocking = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <AnimatedTransition>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Website Blocking</h1>
              <p className="text-muted-foreground">Eliminate distractions and focus on what matters</p>
            </div>
            
            <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">How Website Blocking Works</h3>
                  <p className="text-muted-foreground mb-3">
                    This feature uses the BlockSite browser extension to block distracting websites, helping you stay focused on important tasks.
                  </p>
                  <ol className="list-decimal ml-5 text-sm space-y-1 text-muted-foreground">
                    <li>Install the BlockSite extension from your browser's store</li>
                    <li>Add websites to your block list in our app</li>
                    <li>Export the list and import it into BlockSite</li>
                    <li>BlockSite will actively block these sites when you try to visit them</li>
                  </ol>
                </div>
              </div>
            </Card>
            
            <WebsiteBlocker />
          </div>
        </AnimatedTransition>
      </main>
      
      <StickyNotepad />
      <AIAssistant />
    </div>
  );
};

export default WebsiteBlocking;
