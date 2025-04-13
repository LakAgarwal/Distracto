
import { toast } from "sonner";

// Define global interface augmentation for Window
declare global {
  interface Window {
    blockSiteExtension?: any;
    blockSiteDetected?: boolean;
    distractoExtension?: any;
  }
}

// Screen time extension API service
class ScreenTimeExtensionAPI {
  private isInstalled: boolean = false;
  private extensionName: string | null = null;
  private lastSyncAttempt: number = 0;
  
  // Extension URLs for popular screen time tracking extensions
  private chromeWebTimeTrackerURL: string = 'https://chrome.google.com/webstore/detail/web-activity-time-tracker/hhfnghjdeddcfegfekjeihfmbjenlomm';
  private firefoxWebTimeTrackerURL: string = 'https://addons.mozilla.org/en-US/firefox/addon/web-activity-time-tracker/';
  private chromeRescueTimeURL: string = 'https://chrome.google.com/webstore/detail/rescuetime-for-chrome-and/bdakmnplckeopfghnlpocafcepegjeap';
  private chromeDistractoURL: string = 'https://chromewebstore.google.com/detail/nlkcecddkejakmaipagbcemeohfomedn';
  
  constructor() {
    this.loadState();
    this.checkForKnownExtensions();
  }

  private loadState(): void {
    try {
      const savedState = localStorage.getItem('screenTimeExtensionState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.isInstalled = state.isInstalled || false;
        this.extensionName = state.extensionName || null;
      }
    } catch (error) {
      console.error("Error loading screen time extension state:", error);
    }
  }

  private saveState(): void {
    try {
      const state = {
        isInstalled: this.isInstalled,
        extensionName: this.extensionName
      };
      localStorage.setItem('screenTimeExtensionState', JSON.stringify(state));
    } catch (error) {
      console.error("Error saving screen time extension state:", error);
    }
  }

  // Try to detect if a known screen time extension is installed
  private async checkForKnownExtensions(): Promise<void> {
    try {
      // First check if Web Activity Time Tracker extension is installed
      if (typeof window !== 'undefined') {
        // Add a listener for extension detection
        const checkExtensionResponse = (event: any) => {
          console.log("Extension response received:", event);
          if (event && event.detail && event.detail.status === 'installed') {
            console.log("Web Activity Time Tracker extension detected");
            this.isInstalled = true;
            this.extensionName = 'Web Activity Time Tracker';
            this.saveState();
            
            // Remove the event listener after successful detection
            window.removeEventListener('web-activity-tracker-response', checkExtensionResponse);
            
            // Dispatch an event to notify the app that the extension is installed
            window.dispatchEvent(new CustomEvent('extension-status-changed', { 
              detail: { installed: true, name: this.extensionName } 
            }));
          }
        };
        
        // Listen for responses from the extension
        window.addEventListener('web-activity-tracker-response', checkExtensionResponse);
        
        // Create a custom event to request data from the extension
        const event = new CustomEvent('web-activity-tracker-check', {
          detail: { type: 'check-installed' }
        });
        window.dispatchEvent(event);
        
        // Also check for Distracto extension
        const checkDistractoExtension = () => {
          console.log("Checking for Distracto extension");
          if (window.distractoExtension) {
            console.log("Distracto extension detected");
            this.isInstalled = true;
            this.extensionName = 'Distracto';
            this.saveState();
            
            // Dispatch an event to notify the app that the extension is installed
            window.dispatchEvent(new CustomEvent('extension-status-changed', { 
              detail: { installed: true, name: this.extensionName } 
            }));
            
            return true;
          }
          return false;
        };
        
        // Try to detect the Distracto extension
        if (checkDistractoExtension()) {
          // If found, we don't need to continue with other checks
          return;
        }
        
        // Set a timeout to remove the listener if no response received
        setTimeout(() => {
          window.removeEventListener('web-activity-tracker-response', checkExtensionResponse);
          
          // Try with Distracto extension again
          if (checkDistractoExtension()) {
            return;
          }
          
          // Try alternative detection method
          console.log("Checking for BlockSite extension");
          if (window.blockSiteExtension || window.blockSiteDetected) {
            console.log("BlockSite extension detected");
            this.isInstalled = true;
            this.extensionName = 'BlockSite';
            this.saveState();
          } else {
            // Fallback to localStorage check (for demo purposes)
            const screenTimeExtensionInstalled = localStorage.getItem('screenTimeExtensionInstalled');
            const extensionName = localStorage.getItem('screenTimeExtensionName');
            
            if (screenTimeExtensionInstalled === 'true') {
              this.isInstalled = true;
              this.extensionName = extensionName;
              this.saveState();
            }
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking for screen time extensions:", error);
      
      // Fallback to localStorage check (for demo purposes)
      const screenTimeExtensionInstalled = localStorage.getItem('screenTimeExtensionInstalled');
      const extensionName = localStorage.getItem('screenTimeExtensionName');
      
      if (screenTimeExtensionInstalled === 'true') {
        this.isInstalled = true;
        this.extensionName = extensionName;
        this.saveState();
      }
    }
  }

  public checkIfInstalled(): Promise<{installed: boolean, name: string | null}> {
    // Re-check the extension status to ensure we have the latest
    this.checkForKnownExtensions();
    
    return Promise.resolve({
      installed: this.isInstalled,
      name: this.extensionName
    });
  }

  public installExtension(): Promise<boolean> {
    try {
      const isChrome = navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1;
      const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
      
      let extensionUrl = '';
      let browserName = '';
      let extensionName = 'Distracto'; // Updated default extension name
      
      if (isChrome) {
        extensionUrl = this.chromeDistractoURL; // Use Distracto extension by default
        browserName = 'Chrome';
      } else if (isFirefox) {
        extensionUrl = this.firefoxWebTimeTrackerURL; // For Firefox, still use the old one as fallback
        browserName = 'Firefox';
        extensionName = 'Web Activity Time Tracker';
      } else {
        // For other browsers, direct to Chrome version as fallback
        extensionUrl = this.chromeDistractoURL;
        browserName = 'your browser';
      }
      
      // Open the extension page
      window.open(extensionUrl, '_blank');
      
      toast.info(`${browserName} Web Store opened. Please install the ${extensionName} extension and refresh this page when done.`, {
        duration: 8000,
      });
      
      // For demo purposes, we'll set as installed
      this.isInstalled = true;
      this.extensionName = extensionName;
      localStorage.setItem('screenTimeExtensionInstalled', 'true');
      localStorage.setItem('screenTimeExtensionName', extensionName);
      this.saveState();
      
      // Notify the app that the extension is installed
      window.dispatchEvent(new CustomEvent('extension-status-changed', { 
        detail: { installed: true, name: extensionName } 
      }));
      
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error installing extension:", error);
      toast.error("Failed to open extension page. Please try manually installing from your browser's extension store.");
      return Promise.reject(error);
    }
  }

  public async getScreenTimeData() {
    if (!this.isInstalled) {
      return null;
    }
    
    try {
      // First try to get real data from Web Activity Time Tracker extension
      let realData = await this.fetchRealWebActivityData();
      
      // Always use real data if available
      if (realData && realData.topSites && realData.topSites.length > 0) {
        console.log("Using real extension data:", realData);
        // Store the data for consistency
        localStorage.setItem('mockScreenTimeData', JSON.stringify(realData));
        return realData;
      }
      
      console.log("No real extension data available, checking for saved mock data");
      
      // If no real data, check for saved mock data
      const mockData = localStorage.getItem('mockScreenTimeData');
      
      if (mockData) {
        return JSON.parse(mockData);
      }
      
      // Generate some realistic looking data if none exists
      const today = new Date();
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = weekDays[today.getDay()];
      
      // Generate realistic looking data based on time of day
      const hourOfDay = today.getHours();
      const baseTime = Math.min(hourOfDay * 15, 240); // Max 4 hours by end of day
      
      const productiveTime = Math.round(baseTime * (0.6 + Math.random() * 0.2)); // 60-80% productive
      const unproductiveTime = baseTime - productiveTime;
      
      const data = {
        totalToday: baseTime,
        productiveToday: productiveTime,
        unproductiveToday: unproductiveTime,
        topSites: [
          { url: 'work.com', minutes: Math.round(productiveTime * 0.4), category: 'Productivity' },
          { url: 'gmail.com', minutes: Math.round(productiveTime * 0.3), category: 'Communication' },
          { url: 'docs.google.com', minutes: Math.round(productiveTime * 0.2), category: 'Productivity' },
          { url: 'youtube.com', minutes: Math.round(unproductiveTime * 0.5), category: 'Entertainment' },
          { url: 'reddit.com', minutes: Math.round(unproductiveTime * 0.3), category: 'Social Media' },
          { url: 'news.com', minutes: Math.round(unproductiveTime * 0.2), category: 'News' }
        ],
        weeklyData: [
          { day: 'Mon', total: 320, productive: 210, unproductive: 110 },
          { day: 'Tue', total: 380, productive: 250, unproductive: 130 },
          { day: 'Wed', total: 390, productive: 230, unproductive: 160 },
          { day: 'Thu', total: 410, productive: 280, unproductive: 130 },
          { day: 'Fri', total: 350, productive: 220, unproductive: 130 },
          { day: 'Sat', total: 290, productive: 170, unproductive: 120 },
          { day: 'Sun', total: 250, productive: 140, unproductive: 110 },
        ],
        currentDay
      };
      
      // Store the data for consistency
      localStorage.setItem('mockScreenTimeData', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error("Error getting screen time data:", error);
      return null;
    }
  }

  private async fetchRealWebActivityData(): Promise<any> {
    return new Promise((resolve) => {
      try {
        if (typeof window === 'undefined') {
          resolve(null);
          return;
        }

        console.log("Attempting to fetch real web activity data from extension");
        
        // Check if we've attempted a sync too recently (prevent hammering the extension)
        const now = Date.now();
        if (now - this.lastSyncAttempt < 2000) {
          console.log("Skipping sync request - too soon after last attempt");
          resolve(null);
          return;
        }
        
        this.lastSyncAttempt = now;

        // Create a timeout to resolve with null if no response received
        const timeout = setTimeout(() => {
          window.removeEventListener('web-activity-data-response', handler);
          console.log("Timeout waiting for extension data response");
          resolve(null);
        }, 3000); // Increased timeout to 3 seconds for better reliability

        // Handler for the response
        const handler = (event: any) => {
          clearTimeout(timeout);
          window.removeEventListener('web-activity-data-response', handler);
          
          console.log("Received web activity data response:", event);
          
          if (event && event.detail && event.detail.data) {
            // Process the data from the extension
            const extensionData = event.detail.data;
            console.log("Raw extension data:", extensionData);
            
            // Transform the data to match our application's format
            const transformedData = this.transformExtensionData(extensionData);
            console.log("Transformed extension data:", transformedData);
            
            // Dispatch an event so components can react to new data
            window.dispatchEvent(new CustomEvent('screen-time-data-updated', { 
              detail: { data: transformedData } 
            }));
            
            resolve(transformedData);
          } else {
            console.log("Invalid response data from extension");
            resolve(null);
          }
        };

        // Listen for the response from the extension
        window.addEventListener('web-activity-data-response', handler);

        // Send a request to the extension
        const event = new CustomEvent('web-activity-data-request', {
          detail: { 
            type: 'get-today-data',
            timestamp: Date.now()
          }
        });
        
        console.log("Dispatching web activity data request event");
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Error fetching real web activity data:", error);
        resolve(null);
      }
    });
  }

  private transformExtensionData(extensionData: any): any {
    try {
      console.log("Transforming extension data:", extensionData);
      
      // Setup default data structure
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = weekDays[new Date().getDay()];
      const result: any = {
        totalToday: 0,
        productiveToday: 0,
        unproductiveToday: 0,
        topSites: [],
        weeklyData: [],
        currentDay,
        lastUpdated: new Date().toISOString()
      };
      
      // Check if this is Distracto extension data format
      if (extensionData && extensionData.distracto) {
        console.log("Processing Distracto extension data format");
        
        const distractoData = extensionData.distracto;
        const domains = [];
        
        // Process sites data if available
        if (distractoData.sites && Array.isArray(distractoData.sites)) {
          for (const site of distractoData.sites) {
            // Convert time to minutes (Distracto might use different time format)
            let minutes = 0;
            
            if (typeof site.timeSpent === 'number') {
              minutes = site.timeSpent / 60; // Assume seconds
            } else if (typeof site.minutes === 'number') {
              minutes = site.minutes;
            }
            
            if (minutes > 0) {
              domains.push({
                url: site.url || site.domain || site.name,
                minutes: Math.round(minutes * 100) / 100,
                category: this.categorizeDomain(site.url || site.domain || site.name)
              });
            }
          }
        }
        
        // If no specific sites data but has summary data
        if (domains.length === 0 && distractoData.summary) {
          const summary = distractoData.summary;
          
          if (summary.productiveTime) {
            result.productiveToday = summary.productiveTime / 60; // Convert to minutes
          }
          
          if (summary.distractingTime) {
            result.unproductiveToday = summary.distractingTime / 60; // Convert to minutes
          }
          
          if (summary.totalTime) {
            result.totalToday = summary.totalTime / 60; // Convert to minutes
          }
        }
        
        if (domains.length > 0) {
          // Sort domains by minutes (descending)
          domains.sort((a: any, b: any) => b.minutes - a.minutes);
          
          result.topSites = domains;
          result.totalToday = domains.reduce((total: number, site: any) => total + site.minutes, 0);
          
          result.productiveToday = domains
            .filter((site: any) => site.category === 'Productivity' || site.category === 'Communication')
            .reduce((total: number, site: any) => total + site.minutes, 0);
            
          result.unproductiveToday = domains
            .filter((site: any) => ['Social Media', 'Entertainment'].includes(site.category))
            .reduce((total: number, site: any) => total + site.minutes, 0);
        }
        
        return result;
      }
      
      // For other extensions, use the existing processing logic
      // Direct processing of the Web Activity Time Tracker format
      if (extensionData && Array.isArray(extensionData.domains)) {
        console.log("Processing domains array from extension data");
        
        // Convert time to minutes (extension usually provides time in seconds)
        const domains = extensionData.domains.map((site: any) => {
          // Parse time values (if they're in format like "2m 53s" or raw seconds)
          let minutes = 0;
          
          if (typeof site.time === 'string') {
            // Format: "2m 53s" or similar
            const timeStr = site.time;
            const hourMatch = timeStr.match(/(\d+)\s*h/);
            const minuteMatch = timeStr.match(/(\d+)\s*m/);
            const secondMatch = timeStr.match(/(\d+)\s*s/);
            
            if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
            if (minuteMatch) minutes += parseInt(minuteMatch[1]);
            if (secondMatch) minutes += parseInt(secondMatch[1]) / 60;
          } else if (typeof site.seconds === 'number') {
            // Raw seconds
            minutes = site.seconds / 60;
          } else if (typeof site.time === 'number') {
            // Assume it's seconds if a number
            minutes = site.time / 60;
          }
          
          // Categorize the domain
          let category = this.categorizeDomain(site.domain || site.name);
          
          return {
            url: site.domain || site.name,
            minutes: Math.round(minutes * 100) / 100, // Round to 2 decimal places
            category
          };
        });
        
        // Sort domains by minutes (descending)
        domains.sort((a: any, b: any) => b.minutes - a.minutes);
        
        result.topSites = domains;
        
        // Calculate total, productive, and unproductive time
        result.totalToday = domains.reduce((total: number, site: any) => total + site.minutes, 0);
        
        result.productiveToday = domains
          .filter((site: any) => site.category === 'Productivity' || site.category === 'Communication')
          .reduce((total: number, site: any) => total + site.minutes, 0);
          
        result.unproductiveToday = domains
          .filter((site: any) => ['Social Media', 'Entertainment'].includes(site.category))
          .reduce((total: number, site: any) => total + site.minutes, 0);
      } else if (extensionData && typeof extensionData === 'object') {
        // Try alternate formats that the extension might provide
        console.log("Trying alternate data format processing");
        
        // Some extensions might provide data in a different format
        // Extract any site/domain data we can find
        const domains = [];
        let totalTime = 0;
        
        for (const key in extensionData) {
          if (typeof extensionData[key] === 'object' && extensionData[key] !== null) {
            // This might be a domain entry
            const entry = extensionData[key];
            if (entry.domain || entry.url || entry.site || entry.name) {
              const domain = entry.domain || entry.url || entry.site || entry.name;
              let minutes = 0;
              
              // Try to extract time information
              if (typeof entry.time === 'number') {
                minutes = entry.time / 60; // Assume seconds
              } else if (typeof entry.seconds === 'number') {
                minutes = entry.seconds / 60;
              } else if (typeof entry.minutes === 'number') {
                minutes = entry.minutes;
              }
              
              if (minutes > 0) {
                totalTime += minutes;
                domains.push({
                  url: domain,
                  minutes: Math.round(minutes * 100) / 100,
                  category: this.categorizeDomain(domain)
                });
              }
            }
          }
        }
        
        if (domains.length > 0) {
          // Sort domains by minutes (descending)
          domains.sort((a: any, b: any) => b.minutes - a.minutes);
          
          result.topSites = domains;
          result.totalToday = totalTime;
          
          result.productiveToday = domains
            .filter((site: any) => site.category === 'Productivity' || site.category === 'Communication')
            .reduce((total: number, site: any) => total + site.minutes, 0);
            
          result.unproductiveToday = domains
            .filter((site: any) => ['Social Media', 'Entertainment'].includes(site.category))
            .reduce((total: number, site: any) => total + site.minutes, 0);
        } else {
          console.log("No domain data found in extension data");
        }
      } else {
        console.log("Extension data not in expected format");
      }
      
      // Generate weekly data (could be replaced with real data if the extension provides it)
      // For now, we'll keep using mock weekly data
      result.weeklyData = [
        { day: 'Mon', total: 320, productive: 210, unproductive: 110 },
        { day: 'Tue', total: 380, productive: 250, unproductive: 130 },
        { day: 'Wed', total: 390, productive: 230, unproductive: 160 },
        { day: 'Thu', total: 410, productive: 280, unproductive: 130 },
        { day: 'Fri', total: 350, productive: 220, unproductive: 130 },
        { day: 'Sat', total: 290, productive: 170, unproductive: 120 },
        { day: 'Sun', total: 250, productive: 140, unproductive: 110 },
      ];
      
      return result;
    } catch (error) {
      console.error("Error transforming extension data:", error);
      return null;
    }
  }
  
  private categorizeDomain(domain: string): string {
    const domainLower = domain.toLowerCase();
    
    // Productivity sites
    if (
      domainLower.includes('github') || 
      domainLower.includes('gitlab') || 
      domainLower.includes('bitbucket') ||
      domainLower.includes('stackoverflow') ||
      domainLower.includes('docs.') ||
      domainLower.includes('jira') ||
      domainLower.includes('notion') ||
      domainLower.includes('trello') ||
      domainLower.includes('asana') ||
      domainLower.includes('clickup') ||
      domainLower.includes('figma') ||
      domainLower.includes('miro') ||
      domainLower.includes('dev') ||
      domainLower.includes('code')
    ) {
      return 'Productivity';
    }
    
    // Communication sites
    if (
      domainLower.includes('gmail') ||
      domainLower.includes('outlook') ||
      domainLower.includes('mail') ||
      domainLower.includes('slack') ||
      domainLower.includes('teams') ||
      domainLower.includes('zoom') ||
      domainLower.includes('meet') ||
      domainLower.includes('chat')
    ) {
      return 'Communication';
    }
    
    // Entertainment sites
    if (
      domainLower.includes('youtube') ||
      domainLower.includes('netflix') ||
      domainLower.includes('hulu') ||
      domainLower.includes('disney') ||
      domainLower.includes('prime') ||
      domainLower.includes('video') ||
      domainLower.includes('tv') ||
      domainLower.includes('movie') ||
      domainLower.includes('game') ||
      domainLower.includes('play')
    ) {
      return 'Entertainment';
    }
    
    // Social Media sites
    if (
      domainLower.includes('facebook') ||
      domainLower.includes('twitter') ||
      domainLower.includes('instagram') ||
      domainLower.includes('tiktok') ||
      domainLower.includes('reddit') ||
      domainLower.includes('linkedin') ||
      domainLower.includes('pinterest') ||
      domainLower.includes('snapchat') ||
      domainLower.includes('whatsapp') ||
      domainLower.includes('social')
    ) {
      return 'Social Media';
    }
    
    // Default to Neutral for unknown sites
    return 'Other';
  }

  public exportData(): void {
    try {
      this.getScreenTimeData().then(data => {
        if (!data) {
          toast.error("No screen time data available to export");
          return;
        }
        
        // Create CSV content
        let csvContent = "date,site,time,category\n";
        
        // Add top sites data
        const today = new Date().toISOString().split('T')[0];
        data.topSites.forEach(site => {
          csvContent += `${today},${site.url},${site.minutes},${site.category}\n`;
        });
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'screen_time_data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success("Screen time data exported successfully");
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export screen time data");
    }
  }
  
  public synchronizeWithExtension(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log("Attempting to synchronize with Web Activity Time Tracker extension");
      
      // Check if extension is installed first
      if (!this.isInstalled) {
        this.checkForKnownExtensions();
        // Give it a moment to check
        setTimeout(() => {
          if (!this.isInstalled) {
            toast.error("Extension not detected. Please install and enable the Web Activity Time Tracker extension.");
            resolve(false);
            return;
          }
          this.performSync(resolve);
        }, 500);
      } else {
        this.performSync(resolve);
      }
    });
  }
  
  private performSync(resolve: (value: boolean) => void): void {
    this.fetchRealWebActivityData()
      .then(data => {
        if (data && data.topSites && data.topSites.length > 0) {
          // Store the synchronized data
          localStorage.setItem('mockScreenTimeData', JSON.stringify(data));
          localStorage.setItem('lastSyncTime', new Date().toISOString());
          resolve(true);
        } else {
          console.error("Sync failed: No data received from extension");
          resolve(false);
        }
      })
      .catch(error => {
        console.error("Error syncing with extension:", error);
        resolve(false);
      });
  }
}

// Export a singleton instance
export const screenTimeExtensionAPI = new ScreenTimeExtensionAPI();
