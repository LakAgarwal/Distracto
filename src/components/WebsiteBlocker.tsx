
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BlockedSite } from '@/types/website-blocker';
import { websiteBlockerAPI } from '@/services/website-blocker-api';
import AddWebsiteForm from './website-blocker/AddWebsiteForm';
import BlockedWebsitesList from './website-blocker/BlockedWebsitesList';
import ExtensionStatusCard from './website-blocker/ExtensionStatusCard';
import { Download } from 'lucide-react';

const WebsiteBlocker: React.FC = () => {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
    { id: '1', url: 'facebook.com', isActive: true, blockType: 'always' },
    { id: '2', url: 'twitter.com', isActive: true, blockType: 'always' },
    { id: '3', url: 'instagram.com', isActive: true, blockType: 'always' },
    { id: '4', url: 'youtube.com', isActive: true, blockType: 'scheduled', scheduleStart: '09:00', scheduleEnd: '17:00' },
    { id: '5', url: 'reddit.com', isActive: false, blockType: 'always' },
  ]);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [extensionInstalled, setExtensionInstalled] = useState(false);

  // Check extension status on mount
  useEffect(() => {
    const checkExtension = async () => {
      try {
        const isInstalled = await websiteBlockerAPI.checkIfInstalled();
        setExtensionInstalled(isInstalled);
        
        if (isInstalled) {
          const sites = await websiteBlockerAPI.getBlockedSites();
          if (sites.length > 0) {
            setBlockedSites(sites);
          }
        }
      } catch (error) {
        console.error("Error checking extension status:", error);
      }
    };
    
    checkExtension();
  }, []);
  
  // When blocked sites change, update the extension
  useEffect(() => {
    if (extensionInstalled) {
      websiteBlockerAPI.updateBlockedSites(blockedSites)
        .catch(error => {
          console.error("Error updating extension:", error);
          toast.error("Failed to update blocked sites in extension");
        });
    }
  }, [blockedSites, extensionInstalled]);

  const handleAddSite = (newSite: BlockedSite) => {
    setBlockedSites([...blockedSites, newSite]);
  };
  
  const toggleSiteActive = (id: string) => {
    setBlockedSites(blockedSites.map(site => 
      site.id === id ? { ...site, isActive: !site.isActive } : site
    ));
  };
  
  const deleteSite = (id: string) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
    toast.success('Website removed from blocklist');
  };
  
  const updateSite = (site: BlockedSite) => {
    setBlockedSites(blockedSites.map(s => 
      s.id === site.id ? site : s
    ));
    toast.success('Website blocking settings updated');
  };
  
  const handleInstallExtension = async () => {
    try {
      await websiteBlockerAPI.installExtension();
      setExtensionInstalled(true);
      // Update extension with current blocked sites
      await websiteBlockerAPI.updateBlockedSites(blockedSites);
      toast.success("Website blocking extension installed successfully!");
    } catch (error) {
      console.error("Error installing extension:", error);
      toast.error("Failed to install extension. Please try again.");
    }
  };

  const handleExportToBlockSite = () => {
    websiteBlockerAPI.exportToBlockSite();
  };

  const toggleMasterSwitch = (value: boolean) => {
    setMasterSwitch(value);
    if (value) {
      toast.success("Website blocking enabled");
    } else {
      toast.info("Website blocking disabled");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <Card className="p-6 glass">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Website Blocker</h2>
              <p className="text-muted-foreground">Block distracting websites to stay focused</p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="master-switch" className="cursor-pointer">
                {masterSwitch ? 'Blocker Active' : 'Blocker Inactive'}
              </Label>
              <Switch
                id="master-switch"
                checked={masterSwitch}
                onCheckedChange={toggleMasterSwitch}
                disabled={!extensionInstalled}
              />
            </div>
          </div>
          
          <AddWebsiteForm 
            onAddSite={handleAddSite}
            extensionInstalled={extensionInstalled}
          />
          
          <Separator className="my-6" />
          
          <BlockedWebsitesList 
            blockedSites={blockedSites}
            masterSwitch={masterSwitch}
            extensionInstalled={extensionInstalled}
            onToggleSite={toggleSiteActive}
            onDeleteSite={deleteSite}
            onUpdateSite={updateSite}
          />
          
          {extensionInstalled && blockedSites.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportToBlockSite}
              >
                <Download className="h-4 w-4" />
                Export List for BlockSite
              </Button>
            </div>
          )}
        </Card>
        
        <ExtensionStatusCard 
          extensionInstalled={extensionInstalled}
          onInstallExtension={handleInstallExtension}
        />
      </div>
    </div>
  );
};

export default WebsiteBlocker;
