import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Shield, ChevronRight, BarChart3, CheckCircle, PieChart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StickyNotepad from '@/components/StickyNotepad';
import AIAssistant from '@/components/AIAssistant';

const Dashboard = () => {
  // Mock data
  const todayScreenTime = {
    total: 315, // minutes
    productive: 210,
    unproductive: 105
  };

  const upcomingTasks = [
    { id: 1, time: '10:00 AM', title: 'Project Planning', duration: '1h' },
    { id: 2, time: '01:30 PM', title: 'Team Meeting', duration: '45m' },
    { id: 3, time: '03:00 PM', title: 'Client Presentation', duration: '1h 30m' },
  ];

  const blockedSites = [
    { url: 'facebook.com', count: 12 },
    { url: 'twitter.com', count: 8 },
    { url: 'instagram.com', count: 5 },
  ];

  const calculateTimeSaved = () => {
    return blockedSites.reduce((acc, site) => acc + site.count, 0) * 15; // Assuming average 15 minutes saved per block
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const productivityPercentage = Math.round((todayScreenTime.productive / todayScreenTime.total) * 100);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Your productivity at a glance</p>
              </div>
              <div className="flex space-x-2">
                <Button asChild variant="outline">
                  <Link to="/timetable">Generate Timetable</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Screen Time Overview */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 mr-3">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Today's Screen Time</h2>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/screen-time">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium">{formatMinutes(todayScreenTime.total)}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Productive</span>
                      <span className="font-medium">{formatMinutes(todayScreenTime.productive)}</span>
                    </div>
                    <Progress value={(todayScreenTime.productive / todayScreenTime.total) * 100} className="h-2 bg-gray-100 dark:bg-gray-700">
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Unproductive</span>
                      <span className="font-medium">{formatMinutes(todayScreenTime.unproductive)}</span>
                    </div>
                    <Progress value={(todayScreenTime.unproductive / todayScreenTime.total) * 100} className="h-2 bg-gray-100 dark:bg-gray-700">
                      <div className="h-full bg-red-500 rounded-full" />
                    </Progress>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Productivity</span>
                  <div className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-sm font-medium">
                    {productivityPercentage}%
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Schedule */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 mr-3">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Today's Schedule</h2>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/timetable">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6 space-y-4">
                  {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task) => (
                      <div key={task.id} className="flex space-x-4 items-start">
                        <div className="w-16 text-xs text-muted-foreground pt-0.5">
                          {task.time}
                        </div>
                        <div className="flex-1">
                          <div className="bg-primary/5 p-3 rounded-lg relative">
                            <div className="absolute left-[-16px] top-[14px] h-2 w-2 rounded-full bg-primary"></div>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.duration}</p>
                              </div>
                              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No scheduled tasks for today
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link to="/timetable">
                      Create New Schedule
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            {/* Website Blocking */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="p-6 h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 mr-3">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Website Blocking</h2>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/website-blocking">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300">{formatMinutes(calculateTimeSaved())}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Time saved today</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Most Blocked Sites</h3>
                    {blockedSites.map((site, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                        <span>{site.url}</span>
                        <span className="text-sm bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded-full">
                          {site.count} blocks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/website-blocking">
                      Manage Blocked Sites
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Productivity Insights */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 mr-3">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold">Weekly Productivity Insights</h2>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/screen-time">
                    <span className="text-sm mr-1">View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Average Daily Screen Time</h3>
                  <div className="text-2xl font-bold">5h 12m</div>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <span>↓ 12% vs. last week</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Productivity Ratio</h3>
                  <div className="text-2xl font-bold">68%</div>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <span>↑ 5% vs. last week</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Most Productive Day</h3>
                  <div className="text-2xl font-bold">Tuesday</div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>75% productivity</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 justify-start">
                <Link to="/timetable" className="flex items-start">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 mr-3">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Generate Timetable</div>
                    <div className="text-xs text-muted-foreground">Create a new AI-powered schedule</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 justify-start">
                <Link to="/screen-time" className="flex items-start">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 mr-3">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Detailed screen time analysis</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 justify-start">
                <Link to="/website-blocking" className="flex items-start">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 mr-3">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Block Websites</div>
                    <div className="text-xs text-muted-foreground">Manage your distraction blockers</div>
                  </div>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <StickyNotepad />
      <AIAssistant />
    </div>
  );
};

export default Dashboard;
