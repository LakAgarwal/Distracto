
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { User } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const CallDialog: React.FC<CallDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [ringAudio] = useState(() => typeof Audio !== 'undefined' ? new Audio('/ringtone.mp3') : null);
  
  // Handle ringtone
  useEffect(() => {
    if (open && callState === 'connecting' && ringAudio) {
      ringAudio.loop = true;
      ringAudio.play().catch(e => console.error('Could not play ringtone:', e));
      
      // Auto connect after 3 seconds
      const timer = setTimeout(() => {
        setCallState('connected');
        toast.success('Call connected');
        if (ringAudio) ringAudio.pause();
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        if (ringAudio) ringAudio.pause();
      };
    }
  }, [open, callState, ringAudio]);
  
  // Reset call state when dialog is closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCallState('connecting');
      }, 300);
    }
  }, [open]);
  
  const handleEndCall = () => {
    setCallState('ended');
    toast.info('Call ended');
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };
  
  return (
    <Dialog open={open} onOpenChange={(newState) => {
      if (!newState) handleEndCall();
      else onOpenChange(newState);
    }}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex flex-col items-center py-8 space-y-6">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.photoURL} />
            <AvatarFallback className="text-lg">{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className={`mt-2 ${callState === 'connecting' ? 'text-amber-500' : callState === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
              {callState === 'connecting' && 'Connecting...'}
              {callState === 'connected' && 'Connected'}
              {callState === 'ended' && 'Call ended'}
            </p>
            {callState === 'connected' && (
              <p className="text-sm text-muted-foreground mt-1">Call duration: 00:00</p>
            )}
          </div>
          
          <div className="flex gap-4 mt-4">
            {callState === 'connected' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full" 
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-12 w-12 rounded-full" 
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
