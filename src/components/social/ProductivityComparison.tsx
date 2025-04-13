
import React, { useState } from 'react';
import { Friend } from '@/types/friend';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ProductivityComparisonProps {
  friends: Friend[];
}

const ProductivityComparison: React.FC<ProductivityComparisonProps> = ({ friends }) => {
  const [selectedMetric, setSelectedMetric] = useState<'screenTime' | 'productiveTime' | 'distractingTime' | 'score'>('score');
  
  // Mock data for current user
  const currentUserProductivity = {
    score: 78,
    screenTime: 412,
    productiveTime: 235,
    distractingTime: 80
  };
  
  const friendsWithData = friends.filter(friend => friend.productivity);
  
  const comparisonData = [
    {
      name: 'You',
      ...currentUserProductivity,
      color: '#6366f1' // Indigo color
    },
    ...friendsWithData.map(friend => ({
      name: friend.displayName,
      ...friend.productivity!,
      color: getRandomPastelColor(friend.id)
    }))
  ];
  
  const timeDistributionData = [
    { name: 'Productive', value: currentUserProductivity.productiveTime, color: '#10b981' }, // Emerald
    { name: 'Distracting', value: currentUserProductivity.distractingTime, color: '#ef4444' }, // Red
    { name: 'Neutral', value: currentUserProductivity.screenTime - currentUserProductivity.productiveTime - currentUserProductivity.distractingTime, color: '#94a3b8' } // Slate
  ];
  
  const getMetricName = (metric: typeof selectedMetric): string => {
    switch (metric) {
      case 'score': return 'Productivity Score';
      case 'screenTime': return 'Total Screen Time (min)';
      case 'productiveTime': return 'Productive Time (min)';
      case 'distractingTime': return 'Distracting Time (min)';
    }
  };
  
  if (friendsWithData.length === 0) {
    return (
      <Card className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No friends with productivity data available. Add friends to compare productivity.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Productivity Comparison</h2>
        
        <div className="mb-4">
          <TabsList className="inline-flex">
            <TabsTrigger 
              value="score" 
              onClick={() => setSelectedMetric('score')}
              className={selectedMetric === 'score' ? 'bg-primary text-primary-foreground' : ''}
            >
              Score
            </TabsTrigger>
            <TabsTrigger 
              value="screenTime" 
              onClick={() => setSelectedMetric('screenTime')}
              className={selectedMetric === 'screenTime' ? 'bg-primary text-primary-foreground' : ''}
            >
              Screen Time
            </TabsTrigger>
            <TabsTrigger 
              value="productiveTime" 
              onClick={() => setSelectedMetric('productiveTime')}
              className={selectedMetric === 'productiveTime' ? 'bg-primary text-primary-foreground' : ''}
            >
              Productive
            </TabsTrigger>
            <TabsTrigger 
              value="distractingTime" 
              onClick={() => setSelectedMetric('distractingTime')}
              className={selectedMetric === 'distractingTime' ? 'bg-primary text-primary-foreground' : ''}
            >
              Distracting
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: getMetricName(selectedMetric), angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey={selectedMetric} barSize={40}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Time Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {timeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} min`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Productivity Leaderboard</h2>
          <ul className="space-y-3">
            {comparisonData
              .sort((a, b) => b.score - a.score)
              .map((user, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="font-bold text-lg w-6 text-center">
                      {index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback style={{ backgroundColor: user.color }}>
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={index === 0 ? "default" : "secondary"}
                      className={index === 0 ? "bg-amber-500 hover:bg-amber-500" : ""}
                    >
                      {user.score} points
                    </Badge>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

// Helper function to generate pastel colors based on ID
function getRandomPastelColor(id: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pastel color
  const h = hash % 360;
  return `hsl(${h}, 70%, 80%)`;
}

export default ProductivityComparison;
