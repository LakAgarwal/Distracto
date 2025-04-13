
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlockedSite } from '@/types/website-blocker';

interface BlockedWebsitesListProps {
  blockedSites: BlockedSite[];
  masterSwitch: boolean;
  extensionInstalled: boolean;
  onToggleSite: (id: string) => void;
  onDeleteSite: (id: string) => void;
  onUpdateSite: (site: BlockedSite) => void;
}

const BlockedWebsitesList: React.FC<BlockedWebsitesListProps> = ({
  blockedSites,
  masterSwitch,
  extensionInstalled,
  onToggleSite,
  onDeleteSite,
  onUpdateSite
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Blocked Websites</h3>
      
      {blockedSites.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No websites in your blocklist. Add some above to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {blockedSites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                site.isActive && masterSwitch && extensionInstalled
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
                  : 'border-border bg-background/50'
              }`}
            >
              <div className="flex items-center space-x-2 flex-1">
                <Switch
                  checked={site.isActive}
                  onCheckedChange={() => onToggleSite(site.id)}
                  disabled={!masterSwitch || !extensionInstalled}
                />
                <span className="font-medium">{site.url}</span>
                {site.blockType === 'scheduled' && (
                  <span className="text-xs px-2 py-1 bg-primary/10 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {site.scheduleStart} - {site.scheduleEnd}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(site.id)} disabled={!extensionInstalled}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Blocking Settings</DialogTitle>
                      <DialogDescription>
                        Update the settings for {site.url}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`edit-active-${site.id}`}>Active</Label>
                        <Switch
                          id={`edit-active-${site.id}`}
                          checked={site.isActive}
                          onCheckedChange={() => onToggleSite(site.id)}
                          disabled={!extensionInstalled}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Block Type</Label>
                        <Tabs 
                          value={site.blockType} 
                          onValueChange={(value) => {
                            const updatedSite = { 
                              ...site, 
                              blockType: value as 'always' | 'scheduled',
                              ...(value === 'scheduled' && !site.scheduleStart && { 
                                scheduleStart: '09:00', 
                                scheduleEnd: '17:00' 
                              })
                            };
                            onUpdateSite(updatedSite);
                          }}
                        >
                          <TabsList className="w-full">
                            <TabsTrigger value="always" className="flex-1" disabled={!extensionInstalled}>Always</TabsTrigger>
                            <TabsTrigger value="scheduled" className="flex-1" disabled={!extensionInstalled}>Scheduled</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      {site.blockType === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`edit-start-${site.id}`}>Start Time</Label>
                            <Input
                              id={`edit-start-${site.id}`}
                              type="time"
                              value={site.scheduleStart}
                              onChange={(e) => {
                                const updatedSite = { ...site, scheduleStart: e.target.value };
                                onUpdateSite(updatedSite);
                              }}
                              disabled={!extensionInstalled}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-end-${site.id}`}>End Time</Label>
                            <Input
                              id={`edit-end-${site.id}`}
                              type="time"
                              value={site.scheduleEnd}
                              onChange={(e) => {
                                const updatedSite = { ...site, scheduleEnd: e.target.value };
                                onUpdateSite(updatedSite);
                              }}
                              disabled={!extensionInstalled}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setEditingId(null)} disabled={!extensionInstalled}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteSite(site.id)}
                  disabled={!extensionInstalled}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedWebsitesList;

