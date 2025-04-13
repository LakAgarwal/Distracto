
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { BlockedSite } from '@/types/website-blocker';

interface AddWebsiteFormProps {
  onAddSite: (site: BlockedSite) => void;
  extensionInstalled: boolean;
}

const AddWebsiteForm: React.FC<AddWebsiteFormProps> = ({ onAddSite, extensionInstalled }) => {
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [blockType, setBlockType] = useState<'always' | 'scheduled'>('always');
  const [scheduleStart, setScheduleStart] = useState('09:00');
  const [scheduleEnd, setScheduleEnd] = useState('17:00');

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSiteUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }
    
    // Basic URL validation
    let url = newSiteUrl.trim();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      url = url.replace(/^https?:\/\//, '');
    }
    if (url.startsWith('www.')) {
      url = url.replace(/^www\./, '');
    }
    
    const newSite: BlockedSite = {
      id: Date.now().toString(),
      url,
      isActive: true,
      blockType,
      ...(blockType === 'scheduled' && { scheduleStart, scheduleEnd }),
    };
    
    onAddSite(newSite);
    setNewSiteUrl('');
    toast.success(`${url} added to blocked sites`);
  };

  return (
    <form onSubmit={handleAddSite} className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label htmlFor="site-url" className="sr-only">Website URL</Label>
          <Input
            id="site-url"
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
            placeholder="Enter website URL (e.g. facebook.com)"
            className="w-full"
            disabled={!extensionInstalled}
          />
        </div>
        <Tabs value={blockType} onValueChange={(value) => setBlockType(value as 'always' | 'scheduled')} className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="always" className="flex-1" disabled={!extensionInstalled}>Always Block</TabsTrigger>
            <TabsTrigger value="scheduled" className="flex-1" disabled={!extensionInstalled}>Schedule</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {blockType === 'scheduled' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="schedule-start">Start Time</Label>
            <Input
              id="schedule-start"
              type="time"
              value={scheduleStart}
              onChange={(e) => setScheduleStart(e.target.value)}
              disabled={!extensionInstalled}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="schedule-end">End Time</Label>
            <Input
              id="schedule-end"
              type="time"
              value={scheduleEnd}
              onChange={(e) => setScheduleEnd(e.target.value)}
              disabled={!extensionInstalled}
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" className="flex items-center" disabled={!extensionInstalled}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Website
        </Button>
      </div>
    </form>
  );
};

export default AddWebsiteForm;

