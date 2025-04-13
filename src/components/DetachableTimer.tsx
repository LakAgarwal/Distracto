
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Maximize2, Minimize2, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface DetachableTimerProps {
  initialMinutes?: number;
}

const DetachableTimer: React.FC<DetachableTimerProps> = ({ initialMinutes = 25 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isDetached, setIsDetached] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timerWindowRef = useRef<Window | null>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      toast.success('Timer completed!');
    }
    
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);
  
  // Handle detached window
  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (timerWindowRef.current && !timerWindowRef.current.closed) {
        timerWindowRef.current.close();
      }
    };
  }, []);
  
  // Open detached window with clock style
  const openDetachedWindow = () => {
    // Close previous window if exists
    if (timerWindowRef.current && !timerWindowRef.current.closed) {
      timerWindowRef.current.close();
    }
    
    const width = 250;
    const height = 250;
    const left = window.screen.width - width;
    const top = 0;
    
    // Open new window
    const newWindow = window.open(
      '', 
      'TimerWindow', 
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,status=no,location=no,menubar=no,titlebar=no`
    );
    
    if (newWindow) {
      timerWindowRef.current = newWindow;
      setIsDetached(true);
      setIsOpen(false);
      
      // Write HTML content to the new window with clock style
      newWindow.document.write(`
        <html>
        <head>
          <title>Focus Timer</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #f8fafc;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 0;
              color: #0f172a;
              overflow: hidden;
              user-select: none;
            }
            .clock-container {
              position: relative;
              width: 200px;
              height: 200px;
              border-radius: 50%;
              background-color: white;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              cursor: move;
              border: 1px solid rgba(0,0,0,0.1);
            }
            .clock-face {
              position: relative;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              background-color: #f9fafb;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
            }
            .timer-display {
              font-size: 28px;
              font-weight: bold;
              margin: 0;
              font-variant-numeric: tabular-nums;
              color: #1e293b;
              z-index: 2;
            }
            .clock-hand {
              position: absolute;
              bottom: 50%;
              left: calc(50% - 2px);
              width: 4px;
              background-color: #3b82f6;
              transform-origin: bottom;
              transform: rotate(0deg);
              border-radius: 4px;
              z-index: 1;
            }
            .seconds-hand {
              height: 60px;
              background-color: #ef4444;
            }
            .progress-ring {
              position: absolute;
              top: 0;
              left: 0;
              width: 150px;
              height: 150px;
            }
            .controls {
              position: absolute;
              bottom: 10px;
              display: flex;
              gap: 8px;
              z-index: 3;
            }
            .btn {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: none;
              background-color: #f1f5f9;
              color: #0f172a;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              padding: 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .btn:hover {
              background-color: #e2e8f0;
            }
            .btn-play {
              background-color: #10b981;
              color: white;
            }
            .btn-pause {
              background-color: #f59e0b;
              color: white;
            }
            .title {
              position: absolute;
              top: 20px;
              font-size: 14px;
              font-weight: 500;
              color: #64748b;
              z-index: 3;
            }
            .transparent-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: transparent;
            }
          </style>
        </head>
        <body>
          <div class="transparent-overlay" id="dragOverlay"></div>
          <div class="clock-container" id="clockContainer">
            <div class="title">Focus Timer</div>
            <div class="clock-face">
              <svg class="progress-ring" viewBox="0 0 150 150">
                <circle 
                  cx="75" 
                  cy="75" 
                  r="70" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  stroke-width="6"
                />
                <circle 
                  id="progressRing"
                  cx="75" 
                  cy="75" 
                  r="70" 
                  fill="none" 
                  stroke="#3b82f6" 
                  stroke-width="6" 
                  stroke-dasharray="439.8" 
                  stroke-dashoffset="${439.8 * (secondsLeft / (initialMinutes * 60))}"
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div class="timer-display" id="timeDisplay">${formatTime(secondsLeft)}</div>
              <div class="clock-hand seconds-hand" id="secondsHand" style="transform: rotate(${(secondsLeft % 60) * 6}deg);"></div>
            </div>
            <div class="controls">
              <button id="startPauseBtn" class="${isRunning ? 'btn btn-pause' : 'btn btn-play'}">
                ${isRunning ? '❚❚' : '▶'}
              </button>
              <button id="resetBtn" class="btn">↺</button>
              <button id="closeBtn" class="btn">✕</button>
            </div>
          </div>
          
          <script>
            let isRunning = ${isRunning};
            let secondsLeft = ${secondsLeft};
            let initialSeconds = ${initialMinutes * 60};
            let interval;
            
            const timeDisplay = document.getElementById('timeDisplay');
            const progressRing = document.getElementById('progressRing');
            const secondsHand = document.getElementById('secondsHand');
            const startPauseBtn = document.getElementById('startPauseBtn');
            const resetBtn = document.getElementById('resetBtn');
            const closeBtn = document.getElementById('closeBtn');
            const clockContainer = document.getElementById('clockContainer');
            const dragOverlay = document.getElementById('dragOverlay');
            
            // Drag functionality
            let isDragging = false;
            let offsetX, offsetY;
            
            function makeDraggable(element) {
              element.addEventListener('mousedown', startDrag);
              
              function startDrag(e) {
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                dragOverlay.style.display = 'block';
                
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', endDrag);
                e.preventDefault();
              }
              
              function drag(e) {
                if (isDragging) {
                  const x = e.clientX - offsetX;
                  const y = e.clientY - offsetY;
                  
                  element.style.position = 'absolute';
                  element.style.left = x + 'px';
                  element.style.top = y + 'px';
                  element.style.margin = '0';
                }
              }
              
              function endDrag() {
                isDragging = false;
                dragOverlay.style.display = 'none';
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', endDrag);
              }
            }
            
            // Make clock draggable
            makeDraggable(clockContainer);
            
            function formatTime(seconds) {
              const mins = Math.floor(seconds / 60);
              const secs = seconds % 60;
              return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
            }
            
            function updateTimer() {
              if (isRunning && secondsLeft > 0) {
                secondsLeft--;
                timeDisplay.textContent = formatTime(secondsLeft);
                
                // Update clock hand and progress ring
                secondsHand.style.transform = \`rotate(\${(secondsLeft % 60) * 6}deg)\`;
                progressRing.setAttribute('stroke-dashoffset', (439.8 * (secondsLeft / initialSeconds)).toString());
                
                if (secondsLeft === 0) {
                  isRunning = false;
                  startPauseBtn.textContent = '▶';
                  startPauseBtn.className = 'btn btn-play';
                  clearInterval(interval);
                  
                  // Play sound and show notification
                  try {
                    const audio = new Audio('https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3');
                    audio.play();
                  } catch (e) {
                    console.error("Error playing sound:", e);
                  }
                  
                  if (Notification.permission === 'granted') {
                    new Notification('Timer Complete!', {
                      body: 'Your focus session has ended.'
                    });
                  }
                }
              }
            }
            
            startPauseBtn.addEventListener('click', () => {
              isRunning = !isRunning;
              startPauseBtn.textContent = isRunning ? '❚❚' : '▶';
              startPauseBtn.className = isRunning ? 'btn btn-pause' : 'btn btn-play';
              
              if (isRunning) {
                interval = setInterval(updateTimer, 1000);
              } else {
                clearInterval(interval);
              }
              
              // Communicate with parent window
              window.opener && window.opener.postMessage({
                type: 'timerStateChange',
                isRunning,
                secondsLeft
              }, '*');
            });
            
            resetBtn.addEventListener('click', () => {
              isRunning = false;
              secondsLeft = initialSeconds;
              startPauseBtn.textContent = '▶';
              startPauseBtn.className = 'btn btn-play';
              timeDisplay.textContent = formatTime(secondsLeft);
              secondsHand.style.transform = 'rotate(0deg)';
              progressRing.setAttribute('stroke-dashoffset', '0');
              clearInterval(interval);
              
              // Communicate with parent window
              window.opener && window.opener.postMessage({
                type: 'timerStateChange',
                isRunning,
                secondsLeft
              }, '*');
            });
            
            closeBtn.addEventListener('click', () => {
              window.close();
            });
            
            // Initialize timer
            if (isRunning) {
              interval = setInterval(updateTimer, 1000);
            }
            
            // Request notification permission
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
            
            // Keep on top (works in some browsers)
            window.focus();
            
            // Handle window close
            window.addEventListener('beforeunload', () => {
              // Communicate with parent window
              window.opener && window.opener.postMessage({
                type: 'timerWindowClosed'
              }, '*');
            });
          </script>
        </body>
        </html>
      `);
      
      // Close the document to finish writing
      newWindow.document.close();
      
      // Listen for messages from the popup window
      window.addEventListener('message', handleMessageFromPopup);
    }
  };
  
  // Handle messages from popup window
  const handleMessageFromPopup = (event: MessageEvent) => {
    if (event.data.type === 'timerStateChange') {
      setIsRunning(event.data.isRunning);
      setSecondsLeft(event.data.secondsLeft);
    } else if (event.data.type === 'timerWindowClosed') {
      setIsDetached(false);
      timerWindowRef.current = null;
    }
  };
  
  // Progress percentage
  const progressPercentage = ((initialMinutes * 60 - secondsLeft) / (initialMinutes * 60)) * 100;
  
  return (
    <>
      <Dialog open={isOpen && !isDetached} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => setIsOpen(true)}
          >
            <Clock className="h-4 w-4" />
            <span>Clock Timer</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Focus Timer</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={openDetachedWindow}
                className="h-8 w-8"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="4"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="4" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 * (secondsLeft / (initialMinutes * 60))}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <motion.div
                  key={secondsLeft}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  className="text-4xl font-bold font-mono z-10"
                >
                  {formatTime(secondsLeft)}
                </motion.div>
                <div 
                  className="absolute bottom-[50%] left-[calc(50%-1px)] w-[2px] h-[40%] bg-red-500 origin-bottom z-0"
                  style={{ transform: `rotate(${(secondsLeft % 60) * 6}deg)` }}
                />
              </div>
            </div>
            
            <div className="flex justify-center space-x-3 mt-2">
              <Button
                variant={isRunning ? "outline" : "default"}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(initialMinutes * 60);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Floating timer for small view when detached */}
      {isDetached && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg"
              variant="default"
            >
              <Clock className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="font-medium">Focus Timer</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    if (timerWindowRef.current && !timerWindowRef.current.closed) {
                      timerWindowRef.current.focus();
                    } else {
                      openDetachedWindow();
                    }
                  }}
                  className="h-8 w-8"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md mb-4">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="4"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="4" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 * (secondsLeft / (initialMinutes * 60))}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="text-2xl font-bold font-mono z-10">
                  {formatTime(secondsLeft)}
                </div>
                <div 
                  className="absolute bottom-[50%] left-[calc(50%-1px)] w-[2px] h-[30%] bg-red-500 origin-bottom z-0"
                  style={{ transform: `rotate(${(secondsLeft % 60) * 6}deg)` }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isRunning ? "outline" : "default"}
                  onClick={() => {
                    const newIsRunning = !isRunning;
                    setIsRunning(newIsRunning);
                    if (timerWindowRef.current && !timerWindowRef.current.closed) {
                      timerWindowRef.current.postMessage({
                        type: 'timerStateChange',
                        isRunning: newIsRunning,
                        secondsLeft
                      }, '*');
                    }
                  }}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsRunning(false);
                    setSecondsLeft(initialMinutes * 60);
                    if (timerWindowRef.current && !timerWindowRef.current.closed) {
                      timerWindowRef.current.postMessage({
                        type: 'timerStateChange',
                        isRunning: false,
                        secondsLeft: initialMinutes * 60
                      }, '*');
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default DetachableTimer;
