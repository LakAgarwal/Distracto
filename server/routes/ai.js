import express from 'express';

const router = express.Router();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, model = 'gemini-1.5-flash' } = req.body;
    
    // In a real implementation, you would call the actual AI API here
    // For now, we'll return a mock response
    const response = `This is a mock AI response to: "${message}". In a production environment, this would integrate with ${model} API.`;
    
    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate timetable
router.post('/timetable', async (req, res) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    
    // Mock timetable generation
    const mockTimetable = {
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      tasks: [
        { time: "07:00 - 08:00", description: "Morning routine and breakfast" },
        { time: "08:00 - 10:00", description: "Deep work session - Priority tasks" },
        { time: "10:00 - 10:15", description: "Short break" },
        { time: "10:15 - 12:00", description: "Focused work on main project" },
        { time: "12:00 - 13:00", description: "Lunch break" },
        { time: "13:00 - 15:00", description: "Meetings and collaboration" },
        { time: "15:00 - 15:15", description: "Break and refresh" },
        { time: "15:15 - 17:00", description: "Administrative tasks and emails" },
        { time: "17:00 - 18:00", description: "Exercise and physical activity" },
        { time: "18:00 - 19:00", description: "Dinner" },
        { time: "19:00 - 21:00", description: "Personal time and relaxation" },
        { time: "21:00 - 22:00", description: "Plan for tomorrow and wind down" }
      ],
      recommendations: [
        "Schedule your most challenging tasks during your peak energy hours",
        "Take regular breaks to maintain focus and productivity",
        "Use the Pomodoro technique for deep work sessions",
        "Keep your workspace organized and distraction-free"
      ]
    };
    
    res.json(mockTimetable);
  } catch (error) {
    console.error('AI timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;