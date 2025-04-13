
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Download, ExternalLink, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExtensionStatusCardProps {
  extensionInstalled: boolean;
  onInstallExtension: () => void;
}

const ExtensionStatusCard: React.FC<ExtensionStatusCardProps> = ({ extensionInstalled, onInstallExtension }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Card className={`p-6 glass ${extensionInstalled ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full ${
          extensionInstalled 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
        }`}>
          {extensionInstalled ? (
            <Download className="h-6 w-6" />
          ) : (
            <AlertTriangle className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">
            {extensionInstalled ? 'Website Blocking Extension Installed' : 'Browser Extension Required'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {extensionInstalled 
              ? 'BlockSite extension is installed. You can now add, edit, or remove blocked websites above.'
              : 'To enable real website blocking functionality, you need to install the BlockSite extension. The extension works with Chrome, Firefox, and Edge browsers.'}
          </p>
          
          {extensionInstalled ? (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {isOpen ? "Hide Instructions" : "How to Use BlockSite"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 mt-4">
                <div className="rounded-md bg-black/5 dark:bg-white/5 p-4 text-sm">
                  <h4 className="font-medium mb-2">Using BlockSite with this application:</h4>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Add websites to the list above</li>
                    <li>Click the "Export List for BlockSite" button at the bottom of your list</li>
                    <li>Open the BlockSite extension in your browser</li>
                    <li>In the BlockSite settings, look for "Import from file" option</li>
                    <li>Import the CSV file you just downloaded</li>
                    <li>BlockSite will now block these websites according to your settings</li>
                  </ol>
                  <p className="mt-3 text-muted-foreground">
                    <strong>Note:</strong> Any changes you make to your block list will require re-exporting and re-importing to BlockSite.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Button variant="default" className="flex items-center" onClick={onInstallExtension}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Download & Install BlockSite Extension
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExtensionStatusCard;
