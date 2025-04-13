
import React from 'react';
import { useState } from 'react';
import SocialSidebar from './social/SocialSidebar';
import { useAuth } from '@/hooks/useAuth';

interface DistractoLogoProps {
  className?: string;
}

const DistractoLogo: React.FC<DistractoLogoProps> = ({ className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <button 
        onClick={() => setSidebarOpen(true)}
        className={`flex items-center ${className} transition-transform hover:scale-105`}
        title={isAuthenticated ? "Open social sidebar" : "Login to access social features"}
      >
        <span className="text-primary font-bold text-xl tracking-tight">Distracto</span>
      </button>
      
      <SocialSidebar 
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
    </>
  );
};

export default DistractoLogo;
