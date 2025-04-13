
import React from 'react';
import { FriendRequest } from '@/types/friend';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FriendRequestsProps {
  requests: FriendRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ 
  requests, 
  onAccept, 
  onDecline 
}) => {
  if (requests.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-3">
      {requests.map((request, index) => (
        <motion.li 
          key={request.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={request.from.photoURL} />
              <AvatarFallback>{request.from.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{request.from.displayName}</div>
              <div className="text-sm text-muted-foreground">{request.from.email}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDecline(request.id)}
            >
              Decline
            </Button>
            <Button 
              size="sm" 
              onClick={() => onAccept(request.id)}
            >
              Accept
            </Button>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

export default FriendRequests;
