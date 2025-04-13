import { toast } from "sonner";

interface AppUsage {
  appName: string;
  timeSpent: number; // in minutes
  category: 'productive' | 'neutral' | 'distracting';
}

interface WebsiteUsage {
  domain: string;
  timeSpent: number; // in minutes
  category: 'productive' | 'neutral' | 'distracting';
}

interface DeviceUsage {
  deviceName: string;
  timeSpent: number; // in minutes
  apps: AppUsage[];
}

interface ScreenTimeData {
  totalScreenTime: number; // in minutes
  productiveTime: number; // in minutes
  neutralTime: number; // in minutes
  distractingTime: number; // in minutes
  devices: DeviceUsage[];
  topWebsites: WebsiteUsage[];
  topApps: AppUsage[];
  dailyUsage: { date: string; screenTime: number }[]; // Last 7 days
  weeklyComparison: { current: number; previous: number; change: number }; // % change 
}

const getBrowserData = async (): Promise<{ activeTime: number; domains: Record<string, number> }> => {
  return {
    activeTime: 240,
    domains: {
      'github.com': 78,
      'youtube.com': 45,
      'stackoverflow.com': 37,
      'docs.google.com': 32,
      'reddit.com': 25
    }
  };
};

const getFormattedDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const fetchScreenTimeData = async (): Promise<ScreenTimeData> => {
  try {
    const hasPermission = await requestPermissions();
    
    if (!hasPermission) {
      throw new Error("Permission denied to access screen time data");
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let browserData;
    try {
      browserData = await getBrowserData();
      console.log("Browser data:", browserData);
    } catch (error) {
      console.warn("Could not get real browser data, using mock data instead", error);
      browserData = {
        activeTime: 240,
        domains: {
          'github.com': 78,
          'youtube.com': 45,
          'stackoverflow.com': 37,
          'docs.google.com': 32,
          'reddit.com': 25
        }
      };
    }
    
    const storedData = localStorage.getItem('screenTimeData');
    let historyData: Record<string, number> = {};
    
    if (storedData) {
      try {
        historyData = JSON.parse(storedData);
      } catch (e) {
        console.error("Error parsing stored screen time data", e);
      }
    }
    
    const today = getFormattedDate();
    historyData[today] = (historyData[today] || 0) + 5;
    localStorage.setItem('screenTimeData', JSON.stringify(historyData));
    
    const dailyUsage = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = getFormattedDate();
      const dayName = dayNames[date.getDay()];
      
      const storedMinutes = historyData[formattedDate] || 0;
      const screenTime = storedMinutes > 0 
        ? storedMinutes 
        : 300 + Math.floor(Math.random() * 150);
        
      dailyUsage.push({ date: dayName, screenTime });
    }
    
    return {
      totalScreenTime: browserData.activeTime + 172,
      productiveTime: Math.floor((browserData.activeTime + 172) * 0.6),
      neutralTime: Math.floor((browserData.activeTime + 172) * 0.25),
      distractingTime: Math.floor((browserData.activeTime + 172) * 0.15),
      devices: [
        {
          deviceName: "Laptop/Desktop",
          timeSpent: browserData.activeTime + 72,
          apps: [
            { appName: "VS Code", timeSpent: 142, category: "productive" },
            { appName: "Chrome", timeSpent: browserData.activeTime, category: "neutral" },
            { appName: "Slack", timeSpent: 45, category: "productive" },
            { appName: "Spotify", timeSpent: 38, category: "neutral" },
          ]
        },
        {
          deviceName: "Smartphone",
          timeSpent: 100,
          apps: [
            { appName: "Instagram", timeSpent: 32, category: "distracting" },
            { appName: "Messages", timeSpent: 28, category: "neutral" },
            { appName: "Gmail", timeSpent: 22, category: "productive" },
            { appName: "TikTok", timeSpent: 18, category: "distracting" },
          ]
        }
      ],
      topWebsites: Object.entries(browserData.domains).map(([domain, timeSpent]) => ({
        domain,
        timeSpent,
        category: domain.includes('github') || domain.includes('stackoverflow') || domain.includes('docs.google') 
          ? 'productive' 
          : domain.includes('youtube') || domain.includes('reddit') 
            ? 'distracting' 
            : 'neutral'
      })) as WebsiteUsage[],
      topApps: [
        { appName: "VS Code", timeSpent: 142, category: "productive" },
        { appName: "Chrome", timeSpent: browserData.activeTime, category: "neutral" },
        { appName: "Instagram", timeSpent: 32, category: "distracting" },
        { appName: "Slack", timeSpent: 45, category: "productive" },
        { appName: "Spotify", timeSpent: 38, category: "neutral" },
      ],
      dailyUsage,
      weeklyComparison: {
        current: dailyUsage.reduce((sum, day) => sum + day.screenTime, 0) / 7,
        previous: 440,
        change: -6.4
      }
    };
  } catch (error) {
    console.error("Error fetching screen time data:", error);
    toast.error("Failed to fetch screen time data");
    throw error;
  }
};

const requestPermissions = async (): Promise<boolean> => {
  try {
    if (typeof performance !== 'undefined' && 
        navigator.hardwareConcurrency) {
      console.log("Some performance APIs are available");
      return true;
    }
    return true;
  } catch (e) {
    console.warn("Error checking permissions:", e);
    return true;
  }
};

export const fetchGoogleActivityData = async (): Promise<{
  websites: { domain: string; timeSpent: number }[];
  youtubeWatched: number;
  searchesPerformed: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    websites: [
      { domain: "youtube.com", timeSpent: 87 },
      { domain: "gmail.com", timeSpent: 45 },
      { domain: "docs.google.com", timeSpent: 30 },
      { domain: "drive.google.com", timeSpent: 22 },
      { domain: "calendar.google.com", timeSpent: 15 },
    ],
    youtubeWatched: 87,
    searchesPerformed: 34
  };
};

export type { ScreenTimeData, AppUsage, WebsiteUsage, DeviceUsage };
