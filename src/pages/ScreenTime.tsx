
import React from 'react';
import ScreenTimeAnalytics from '@/components/ScreenTimeAnalytics';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import AIInsights from '@/components/AIInsights';
import FocusTimer from '@/components/FocusTimer';
import DetachableTimer from '@/components/DetachableTimer';
import StickyNotepad from '@/components/StickyNotepad';
import AIAssistant from '@/components/AIAssistant';
import { Card } from '@/components/ui/card';
import { AlertCircle, InfoIcon, RefreshCw, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { screenTimeExtensionAPI } from '@/services/screen-time-extension-api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ScreenTime = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<{installed: boolean, name: string | null}>({
    installed: false,
    name: null
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Check extension status when component mounts
  useEffect(() => {
    const checkExtension = async () => {
      const status = await screenTimeExtensionAPI.checkIfInstalled();
      setExtensionStatus(status);
      
      // Attempt auto-sync when component mounts if extension is installed
      if (status.installed) {
        handleSyncWithExtension(true);
      }
    };
    
    checkExtension();
    
    // Listen for extension status changes
    const handleExtensionStatusChange = (event: any) => {
      if (event.detail && typeof event.detail.installed === 'boolean') {
        setExtensionStatus({
          installed: event.detail.installed,
          name: event.detail.name
        });
        
        if (event.detail.installed) {
          handleSyncWithExtension(true);
        }
      }
    };
    
    window.addEventListener('extension-status-changed', handleExtensionStatusChange);
    
    // Set up a polling interval to check for extension data changes
    const intervalId = setInterval(() => {
      if (extensionStatus.installed && !isSyncing) {
        console.log("Auto-refreshing screen time data");
        handleSyncWithExtension(true); // silent sync
      }
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('extension-status-changed', handleExtensionStatusChange);
    };
  }, []);

  const handleSyncWithExtension = async (silent = false) => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const result = await screenTimeExtensionAPI.synchronizeWithExtension();
      
      // Only show toasts if not silent mode
      if (!silent) {
        if (result) {
          toast.success(`Successfully synced with ${extensionStatus.name || 'Screen Time Extension'}`);
        } else {
          toast.error("Sync failed. Please check the extension is running and has permission to access this site.");
          setSyncError("Failed to sync with extension. Is it active and has permission for this site?");
        }
      } else if (!result) {
        // Even in silent mode, update the sync error state
        setSyncError("Failed to sync with extension. Is it active and has permission for this site?");
      }
      
      // Set last sync time
      const newTime = new Date().toLocaleTimeString();
      setLastSyncTime(newTime);
      
      // Refresh the analytics component by dispatching an event
      window.dispatchEvent(new CustomEvent('refresh-screen-time-data'));
    } catch (error) {
      console.error("Error syncing with extension:", error);
      if (!silent) {
        toast.error(`Failed to sync with ${extensionStatus.name || 'Screen Time Extension'}`);
      }
      setSyncError("Error connecting to extension. Please check if it's installed and active.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <AnimatedTransition>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Screen Time Analytics</h1>
                <p className="text-muted-foreground">Track and analyze your digital habits</p>
                {lastSyncTime && (
                  <p className="text-xs text-muted-foreground mt-1">Last synced: {lastSyncTime}</p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {syncError && (
                  <span className="text-sm text-red-500 mr-2">{syncError}</span>
                )}
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleSyncWithExtension(false)}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            </div>
            
            <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  <InfoIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">How Screen Time Tracking Works</h3>
                  <p className="text-muted-foreground mb-3">
                    This feature works best with a browser extension that tracks your actual web activity. You can:
                  </p>
                  <ol className="list-decimal ml-5 text-sm space-y-1 text-muted-foreground">
                    <li>Install the Distracto extension from your browser's store</li>
                    <li>The extension will track which websites you visit and for how long</li>
                    <li>Use the "Sync Now" button to update data from the extension</li>
                    <li>All data is stored locally on your device for privacy</li>
                  </ol>
                </div>
              </div>
            </Card>
            
            {!extensionStatus.installed && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Extension Required</AlertTitle>
                <AlertDescription>
                  Please install the Distracto extension to get accurate screen time data.
                  <Button 
                    variant="outline" 
                    className="ml-4"
                    onClick={() => screenTimeExtensionAPI.installExtension()}
                  >
                    Install Extension
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end mb-4">
              <DetachableTimer initialMinutes={25} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <div className="lg:col-span-2">
                <ScreenTimeAnalytics 
                  extensionInstalled={extensionStatus.installed}
                  onSyncRequest={() => handleSyncWithExtension(false)}
                />
              </div>
              <div>
                <FocusTimer />
              </div>
            </div>
            
            <div>
              <AIInsights />
            </div>
          </div>
        </AnimatedTransition>
      </main>
      
      <StickyNotepad />
      <AIAssistant />
    </div>
  );
};

export default ScreenTime;
