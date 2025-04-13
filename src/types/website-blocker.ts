
export type BlockedSite = {
  id: string;
  url: string;
  isActive: boolean;
  blockType: 'always' | 'scheduled';
  scheduleStart?: string;
  scheduleEnd?: string;
};

