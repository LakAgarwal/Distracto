
import React, { useState } from 'react';
import { Friend } from '@/types/friend';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: Friend[];
  onCreateGroup: (name: string, description: string, memberIds: string[]) => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onOpenChange,
  friends,
  onCreateGroup
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleMemberToggle = (friendId: string) => {
    setSelectedMembers(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = () => {
    onCreateGroup(name, description, selectedMembers);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedMembers([]);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>
            Create a group to connect with multiple friends.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input 
              id="group-name" 
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-description">Description (optional)</Label>
            <Textarea 
              id="group-description" 
              placeholder="What's this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Add Members</Label>
            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                You need to add friends before creating a group.
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                {friends.map((friend) => (
                  <div 
                    key={friend.id} 
                    className="flex items-center space-x-3 py-1"
                  >
                    <Checkbox 
                      id={`friend-${friend.id}`}
                      checked={selectedMembers.includes(friend.id)}
                      onCheckedChange={() => handleMemberToggle(friend.id)}
                    />
                    <Label 
                      htmlFor={`friend-${friend.id}`} 
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={friend.photoURL} />
                        <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <span>{friend.displayName}</span>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!name || selectedMembers.length === 0}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
