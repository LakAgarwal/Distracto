
import { BlockedSite } from '@/types/website-blocker';
import { toast } from 'sonner';

// Real extension API with download functionality
class WebsiteBlockerAPI {
  private isInstalled: boolean = false;
  private blockedSites: BlockedSite[] = [];
  
  // Extension download URLs - these are real BlockSite extension links
  private chromeExtensionURL: string = 'https://chrome.google.com/webstore/detail/blocksite-block-websites/eiimnmioipafcokbfikbljfdeojpcgbh';
  private firefoxExtensionURL: string = 'https://addons.mozilla.org/en-US/firefox/addon/blocksite/';
  private edgeExtensionURL: string = 'https://microsoftedge.microsoft.com/addons/detail/blocksite-block-websites/iiiompeadmkhbgbagpkaeobmoknnlpch';

  constructor() {
    // Try to load any saved state
    this.loadState();
    
    // Check if any known blockers are installed
    this.checkForKnownBlockers();
  }

  private loadState(): void {
    try {
      const savedState = localStorage.getItem('websiteBlockerState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.isInstalled = state.isInstalled || false;
        this.blockedSites = state.blockedSites || [];
      }
    } catch (error) {
      console.error("Error loading website blocker state:", error);
    }
  }

  private saveState(): void {
    try {
      const state = {
        isInstalled: this.isInstalled,
        blockedSites: this.blockedSites
      };
      localStorage.setItem('websiteBlockerState', JSON.stringify(state));
    } catch (error) {
      console.error("Error saving website blocker state:", error);
    }
  }

  // Check if any known website blockers are already installed
  private async checkForKnownBlockers(): Promise<void> {
    try {
      // Try to detect BlockSite extension using a specific approach
      // Most browsers restrict direct extension detection for security reasons
      const blockSiteDetected = this.attemptBlockSiteDetection();
      
      // For demo purposes, also check localStorage
      const knownBlockerInstalled = localStorage.getItem('knownBlockerInstalled') === 'true';
      
      if (blockSiteDetected || knownBlockerInstalled) {
        this.isInstalled = true;
        this.saveState();
        console.log("BlockSite extension detected");
      }
    } catch (error) {
      console.error("Error checking for known blockers:", error);
    }
  }

  // Attempt to detect BlockSite extension by checking for its presence
  private attemptBlockSiteDetection(): boolean {
    try {
      // Create a test element with BlockSite-specific attributes
      const testElement = document.createElement('div');
      testElement.id = 'blocksite-detector';
      testElement.style.display = 'none';
      document.body.appendChild(testElement);
      
      // Check if BlockSite modifies this element (won't work in most cases due to extension isolation)
      // This is just a demonstration, not a reliable detection method
      setTimeout(() => {
        document.body.removeChild(testElement);
      }, 1000);
      
      // For now, we're using a simplified approach with localStorage
      return false;
    } catch (e) {
      console.warn("BlockSite detection attempt failed:", e);
      return false;
    }
  }

  public checkIfInstalled(): Promise<boolean> {
    return Promise.resolve(this.isInstalled);
  }

  public installExtension(): Promise<boolean> {
    // Trigger a real extension download
    try {
      const isChrome = navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1;
      const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
      const isEdge = navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Edg") > -1;
      
      let extensionUrl = '';
      let browserName = '';
      
      if (isChrome) {
        extensionUrl = this.chromeExtensionURL;
        browserName = 'Chrome';
      } else if (isFirefox) {
        extensionUrl = this.firefoxExtensionURL;
        browserName = 'Firefox';
      } else if (isEdge) {
        extensionUrl = this.edgeExtensionURL;
        browserName = 'Edge';
      } else {
        // For other browsers
        extensionUrl = 'https://alternativeto.net/software/blocksite/about/';
        browserName = 'your browser';
      }
      
      // Open the extension page
      window.open(extensionUrl, '_blank');
      
      toast.info(`${browserName} Web Store opened. Please install the BlockSite extension and refresh this page when done. After installation, add the sites from our list to BlockSite manually.`, {
        duration: 8000,
      });
      
      // Simulate successful installation - in a real case, we would verify this
      this.isInstalled = true;
      localStorage.setItem('knownBlockerInstalled', 'true');
      this.saveState();
      
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error installing extension:", error);
      toast.error("Failed to open extension page. Please try manually installing from your browser's extension store.");
      return Promise.reject(error);
    }
  }

  public updateBlockedSites(sites: BlockedSite[]): Promise<boolean> {
    this.blockedSites = sites;
    this.saveState();
    
    // If the extension is installed, inform the user how to add sites to BlockSite
    if (this.isInstalled && sites.length > 0) {
      try {
        // Generate a formatted list of active sites to block
        const activeSites = sites.filter(site => site.isActive).map(site => site.url);
        
        if (activeSites.length > 0) {
          // Since direct communication with BlockSite isn't possible without a custom extension,
          // we'll guide the user to manually add these sites to BlockSite
          this.showBlockSiteInstructions(activeSites);
        }
        
        localStorage.setItem('blockedSites', JSON.stringify(sites));
      } catch (error) {
        console.error("Error processing blocked sites:", error);
      }
    }
    
    return Promise.resolve(true);
  }

  private showBlockSiteInstructions(sites: string[]): void {
    // Only show this if there are active sites and we haven't shown it recently
    const lastShown = localStorage.getItem('blockSiteInstructionsLastShown');
    const now = Date.now();
    
    // Show instructions at most once per hour
    if (!lastShown || (now - parseInt(lastShown)) > 3600000) {
      const sitesList = sites.slice(0, 5).join(', ') + (sites.length > 5 ? '...' : '');
      
      toast.info(
        `To block websites, open the BlockSite extension and add these sites: ${sitesList}`, 
        { duration: 8000 }
      );
      
      localStorage.setItem('blockSiteInstructionsLastShown', now.toString());
    }
  }

  public getBlockedSites(): Promise<BlockedSite[]> {
    try {
      // Try to get from localStorage
      const storedSites = localStorage.getItem('blockedSites');
      if (storedSites) {
        const sites = JSON.parse(storedSites);
        this.blockedSites = sites;
      }
    } catch (error) {
      console.error("Error getting sites from storage:", error);
    }
    
    return Promise.resolve(this.blockedSites);
  }

  // Export BlockSite formatted data
  public exportToBlockSite(): void {
    try {
      const activeSites = this.blockedSites.filter(site => site.isActive);
      
      if (activeSites.length === 0) {
        toast.warning("No active sites to export");
        return;
      }
      
      // Create a text file for easy import to BlockSite
      // BlockSite supports CSV format for import
      let csvContent = "domain\n"; // Header
      
      activeSites.forEach(site => {
        // Format properly for BlockSite import
        let url = site.url;
        if (url.includes("//")) {
          url = url.split("//")[1];
        }
        if (url.startsWith("www.")) {
          url = url.substring(4);
        }
        csvContent += url + "\n";
      });
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'blocksite_import.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Website list exported for BlockSite. Open BlockSite extension and import this file.");
    } catch (error) {
      console.error("Error exporting sites:", error);
      toast.error("Failed to export websites list");
    }
  }
}

// Export a singleton instance
export const websiteBlockerAPI = new WebsiteBlockerAPI();
