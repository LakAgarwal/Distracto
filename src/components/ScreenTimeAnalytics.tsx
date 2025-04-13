import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { screenTimeExtensionAPI } from '@/services/screen-time-extension-api';
import { Download, ExternalLink, InfoIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type ScreenTimeAnalyticsProps = {
  extensionInstalled?: boolean;
  onSyncRequest?: () => void;
};

type AppUsage = {
  name: string;
  minutes: number;
  color: string;
};

type DailyData = {
  date: string;
  total: number;
  productive: number;
  unproductive: number;
};

const COLORS: Record<string, string> = {
  'Productivity': '#60a5fa',
  'Communication': '#34d399',
  'Entertainment': '#fbbf24',
  'Social Media': '#f87171',
  'News': '#8b5cf6',
  'Shopping': '#f472b6',
  'Other': '#94a3b8'
};

const DUMMY_APP_USAGE: AppUsage[] = [
  { name: 'Productivity', minutes: 187, color: COLORS['Productivity'] },
  { name: 'Social Media', minutes: 94, color: COLORS['Social Media'] },
  { name: 'Entertainment', minutes: 63, color: COLORS['Entertainment'] },
  { name: 'Communication', minutes: 48, color: COLORS['Communication'] },
];

const DUMMY_WEEKLY_DATA: DailyData[] = [
  { date: 'Mon', total: 320, productive: 210, unproductive: 110 },
  { date: 'Tue', total: 380, productive: 250, unproductive: 130 },
  { date: 'Wed', total: 390, productive: 230, unproductive: 160 },
  { date: 'Thu', total: 410, productive: 280, unproductive: 130 },
  { date: 'Fri', total: 350, productive: 220, unproductive: 130 },
  { date: 'Sat', total: 290, productive: 170, unproductive: 120 },
  { date: 'Sun', total: 250, productive: 140, unproductive: 110 },
];

const ScreenTimeAnalytics: React.FC<ScreenTimeAnalyticsProps> = ({ extensionInstalled: propExtensionInstalled, onSyncRequest }) => {
  const [activeTab, setActiveTab] = useState('today');
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>(DUMMY_WEEKLY_DATA);
  const [totalTime, setTotalTime] = useState(0);
  const [productiveTime, setProductiveTime] = useState(0);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [extensionName, setExtensionName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh data
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
  useEffect(() => {
    if (propExtensionInstalled !== undefined) {
      setExtensionInstalled(propExtensionInstalled);
    }
  }, [propExtensionInstalled]);
  
  useEffect(() => {
    console.log("Checking extension status and fetching data...");
    const checkExtension = async () => {
      try {
        const { installed, name } = await screenTimeExtensionAPI.checkIfInstalled();
        setExtensionInstalled(installed);
        setExtensionName(name);
        
        // Always fetch data, even if extension is not installed
        // This will use cached data or fallback to mock data
        fetchScreenTimeData();
      } catch (error) {
        console.error("Error checking extension:", error);
        setLoading(false);
      }
    };
    
    checkExtension();
  }, [refreshKey]); // Add refreshKey dependency to re-run this effect
  
  const fetchScreenTimeData = async () => {
    setLoading(true);
    try {
      console.log("Fetching screen time data...");
      const data = await screenTimeExtensionAPI.getScreenTimeData();
      
      if (data) {
        console.log("Received screen time data:", data);
        // Convert topSites data to AppUsage format
        const sitesByCategory: Record<string, number> = {};
        
        if (data.topSites && Array.isArray(data.topSites)) {
          data.topSites.forEach((site: any) => {
            if (sitesByCategory[site.category]) {
              sitesByCategory[site.category] += site.minutes;
            } else {
              sitesByCategory[site.category] = site.minutes;
            }
          });
          
          const newAppUsage: AppUsage[] = Object.entries(sitesByCategory)
            .filter(([_, minutes]) => minutes > 0) // Only include categories with time spent
            .map(([name, minutes]) => ({
              name,
              minutes,
              color: COLORS[name as keyof typeof COLORS] || COLORS['Other']
            }))
            .sort((a, b) => b.minutes - a.minutes); // Sort by minutes in descending order
          
          if (newAppUsage.length === 0) {
            // No data, use dummy data
            setAppUsage(DUMMY_APP_USAGE);
            processAppUsageData(DUMMY_APP_USAGE);
          } else {
            setAppUsage(newAppUsage);
            processAppUsageData(newAppUsage);
          }
          
          if (data.weeklyData && Array.isArray(data.weeklyData)) {
            setWeeklyData(data.weeklyData);
          }
          
          // Set last sync time
          setLastSyncTime(new Date().toLocaleTimeString());
        } else {
          console.warn("Data has no topSites array:", data);
          setAppUsage(DUMMY_APP_USAGE);
          processAppUsageData(DUMMY_APP_USAGE);
        }
      } else {
        console.warn("No data returned from getScreenTimeData");
        // Fallback to dummy data
        setAppUsage(DUMMY_APP_USAGE);
        processAppUsageData(DUMMY_APP_USAGE);
      }
    } catch (error) {
      console.error("Error fetching screen time data:", error);
      // Fallback to dummy data
      setAppUsage(DUMMY_APP_USAGE);
      processAppUsageData(DUMMY_APP_USAGE);
    } finally {
      setLoading(false);
    }
  };
  
  const processAppUsageData = (data: AppUsage[]) => {
    const total = data.reduce((acc, app) => acc + app.minutes, 0);
    setTotalTime(total);
    
    const productive = data
      .filter(app => ['Productivity', 'Education', 'Communication', 'Productivity Apps'].includes(app.name))
      .reduce((acc, app) => acc + app.minutes, 0);
    
    setProductiveTime(productive);
  };
  
  const formatMinutes = (minutes: number) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) {
      return '0h 0m';
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };
  
  const handleInstallExtension = () => {
    screenTimeExtensionAPI.installExtension()
      .then(() => {
        setExtensionInstalled(true);
        setExtensionName('Web Activity Time Tracker');
        toast.success("Screen time extension installed successfully!");
        fetchScreenTimeData();
      })
      .catch(error => {
        console.error("Failed to install extension:", error);
      });
  };
  
  const handleExportData = () => {
    screenTimeExtensionAPI.exportData();
  };
  
  const handleRefreshData = async () => {
    try {
      setLoading(true);
      if (onSyncRequest) {
        await onSyncRequest();
      } else {
        await screenTimeExtensionAPI.synchronizeWithExtension();
      }
      setRefreshKey(prevKey => prevKey + 1);
    } finally {
      setLoading(false);
    }
  };

  const productivePercentage = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;

  const pieData = [
    { name: 'Productive', value: productiveTime, color: '#60a5fa' },
    { name: 'Unproductive', value: totalTime - productiveTime, color: '#f87171' },
  ].filter(item => item.value > 0); // Only include non-zero values
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!extensionInstalled && (
        <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              <InfoIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Get Accurate Screen Time Analytics</h3>
              <p className="text-muted-foreground mb-3">
                For more accurate screen time tracking, install a browser extension that monitors your web activity.
              </p>
              <Button 
                onClick={handleInstallExtension}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Install Web Activity Time Tracker
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="p-6 glass overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Screen Time Overview</h2>
          {extensionInstalled && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground mr-2 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Connected to: {extensionName}
                {lastSyncTime && <span className="ml-2">({lastSyncTime})</span>}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleRefreshData}
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            {loading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Screen Time</h3>
                    <p className="text-3xl font-bold mt-2">{formatMinutes(totalTime)}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Productive Time</h3>
                    <p className="text-3xl font-bold mt-2">{formatMinutes(productiveTime)}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Productivity Ratio</h3>
                    <div className="flex items-center mt-2">
                      <p className="text-3xl font-bold mr-4">{productivePercentage}%</p>
                      <Progress value={productivePercentage} className="h-2 flex-1" />
                    </div>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-80"
                  >
                    <h3 className="text-lg font-medium mb-4">Usage by Category</h3>
                    {appUsage.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={appUsage}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={120} />
                          <Tooltip 
                            formatter={(value: number) => [`${formatMinutes(value)}`, 'Time Spent']}
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: 'none', 
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                            }}
                          />
                          <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                            {appUsage.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No usage data available</p>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-80"
                  >
                    <h3 className="text-lg font-medium mb-4">Productivity Distribution</h3>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${formatMinutes(value)}`, 'Time Spent']}
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: 'none', 
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No productivity data available</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="week">
            {loading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="h-80 mb-6">
                  <h3 className="text-lg font-medium mb-4">Weekly Overview</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`${formatMinutes(value)}`, 'Time Spent']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                        }}
                      />
                      <Legend />
                      <Bar dataKey="productive" name="Productive" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="unproductive" name="Unproductive" fill="#f87171" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Average</h3>
                    <p className="text-2xl font-bold mt-1">
                      {formatMinutes(weeklyData.reduce((acc, day) => acc + day.total, 0) / 7)}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Productive Day</h3>
                    <p className="text-2xl font-bold mt-1">
                      {weeklyData.sort((a, b) => b.productive - a.productive)[0]?.date || 'Thursday'}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Productivity</h3>
                    <p className="text-2xl font-bold mt-1">
                      {Math.round((weeklyData.reduce((acc, day) => acc + day.productive, 0) / 
                        weeklyData.reduce((acc, day) => acc + day.total, 0)) * 100)}%
                    </p>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="month">
            <div className="flex items-center justify-center h-60">
              <p className="text-muted-foreground">Monthly data visualization coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      <Card className="p-6 glass">
        <h2 className="text-2xl font-semibold mb-4">Detailed App Usage</h2>
        {appUsage.length > 0 ? (
          <div className="space-y-4">
            {appUsage.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{app.name}</span>
                  <span className="text-sm text-muted-foreground">{formatMinutes(app.minutes)}</span>
                </div>
                <Progress value={totalTime > 0 ? (app.minutes / totalTime) * 100 : 0} className="h-2" 
                  style={{ backgroundColor: `${app.color}20`, '--tw-progress-bar': app.color } as React.CSSProperties}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No usage data available</p>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Total Screen Time</h3>
            <p className="text-2xl font-bold">{formatMinutes(totalTime)}</p>
          </div>
          <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ScreenTimeAnalytics;

