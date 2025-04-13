
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Timer, Play, Pause, RotateCcw, Eye, EyeOff, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

type TimerType = 'work' | 'short-break' | 'long-break';

const FocusTimer: React.FC = () => {
  // Timer state
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 minutes
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Focus mode state
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  
  // Custom time settings
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  
  // Sound reference
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    alarmSoundRef.current = new Audio('https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3');
    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current = null;
      }
    };
  }, []);
  
  // Set timer based on type
  useEffect(() => {
    let newTotalSeconds = 0;
    switch (timerType) {
      case 'work':
        newTotalSeconds = workTime * 60;
        break;
      case 'short-break':
        newTotalSeconds = shortBreakTime * 60;
        break;
      case 'long-break':
        newTotalSeconds = longBreakTime * 60;
        break;
    }
    setTotalSeconds(newTotalSeconds);
    setSecondsLeft(newTotalSeconds);
    setIsRunning(false);
  }, [timerType, workTime, shortBreakTime, longBreakTime]);
  
  // Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      
      // Play sound if enabled
      if (showNotifications && alarmSoundRef.current) {
        alarmSoundRef.current.play().catch(err => console.error("Error playing sound:", err));
      }
      
      // Show notification
      if (showNotifications) {
        toast.success(`${timerType === 'work' ? 'Work session' : 'Break'} completed!`);
      }
      
      // Increment completed pomodoros if work session
      if (timerType === 'work') {
        setCompletedPomodoros(prev => prev + 1);
        
        // Auto-switch to break after work
        if (completedPomodoros % 3 === 2) { // Every 4th pomodoro (0-indexed)
          setTimerType('long-break');
        } else {
          setTimerType('short-break');
        }
      } else {
        // Auto-switch to work after break
        setTimerType('work');
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, timerType, completedPomodoros, showNotifications]);
  
  // Toggle focus mode
  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    
    if (!isFocusMode) {
      toast.success('Focus mode activated. Stay on task!');
      // In a real implementation, this would communicate with the website blocker feature
    } else {
      toast.info('Focus mode deactivated');
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className={`p-6 ${isFocusMode ? 'border-primary' : 'glass'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Focus Timer</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="focus-mode" className="cursor-pointer text-sm">
              Focus Mode
            </Label>
            <Switch
              id="focus-mode"
              checked={isFocusMode}
              onCheckedChange={toggleFocusMode}
            />
          </div>
        </div>
        
        <ToggleGroup type="single" value={timerType} onValueChange={(value) => value && setTimerType(value as TimerType)} className="justify-center mb-6">
          <ToggleGroupItem value="work" className="px-4">Work</ToggleGroupItem>
          <ToggleGroupItem value="short-break" className="px-4">Short Break</ToggleGroupItem>
          <ToggleGroupItem value="long-break" className="px-4">Long Break</ToggleGroupItem>
        </ToggleGroup>
        
        <div className="text-center mb-4">
          <motion.div
            key={secondsLeft}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            className="text-5xl font-bold font-mono"
          >
            {formatTime(secondsLeft)}
          </motion.div>
          <p className="text-muted-foreground text-sm mt-1">
            {timerType === 'work' ? 'Focus on your task' : 'Take a break'}
          </p>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-6" />
        
        <div className="flex justify-center space-x-3 mb-6">
          {isRunning ? (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsRunning(false)}
              className="w-24"
            >
              <Pause className="mr-1" />
              Pause
            </Button>
          ) : (
            <Button
              variant={secondsLeft === totalSeconds ? "default" : "outline"}
              size="lg"
              onClick={() => setIsRunning(true)}
              className="w-24"
            >
              <Play className="mr-1" />
              {secondsLeft === totalSeconds ? 'Start' : 'Resume'}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(totalSeconds);
            }}
            className="w-24"
          >
            <RotateCcw className="mr-1" />
            Reset
          </Button>
        </div>
        
        {completedPomodoros > 0 && (
          <div className="text-center text-sm text-muted-foreground mb-4">
            Completed sessions: {completedPomodoros}
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <Label htmlFor="notifications" className="text-sm">Notifications</Label>
            </div>
            <Switch
              id="notifications"
              checked={showNotifications}
              onCheckedChange={setShowNotifications}
            />
          </div>
          
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Timer Settings</summary>
            <div className="mt-3 space-y-3 p-3 rounded-md bg-background/50">
              <div>
                <Label htmlFor="work-time">Work (minutes)</Label>
                <Input
                  id="work-time"
                  type="number"
                  min={1}
                  max={60}
                  value={workTime}
                  onChange={(e) => setWorkTime(parseInt(e.target.value) || 25)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="short-break-time">Short Break (minutes)</Label>
                <Input
                  id="short-break-time"
                  type="number"
                  min={1}
                  max={30}
                  value={shortBreakTime}
                  onChange={(e) => setShortBreakTime(parseInt(e.target.value) || 5)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="long-break-time">Long Break (minutes)</Label>
                <Input
                  id="long-break-time"
                  type="number"
                  min={1}
                  max={60}
                  value={longBreakTime}
                  onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                  className="h-8"
                />
              </div>
            </div>
          </details>
        </div>
        
        {isFocusMode && (
          <div className="mt-6 flex items-center p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex-shrink-0 mr-3">
              <div className="p-2 rounded-full bg-primary/20">
                {isFocusMode ? <Eye className="h-5 w-5 text-primary" /> : <EyeOff className="h-5 w-5" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Focus Mode Active</p>
              <p className="text-xs text-muted-foreground">Distractions are minimized. Stay focused!</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FocusTimer;
