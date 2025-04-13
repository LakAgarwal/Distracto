
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, Shield, ChevronRight, BarChart, Focus, BrainCircuit, Timer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'AI-Powered Timetable',
      description: 'Generate personalized schedules based on your preferences and goals using advanced AI technology.',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      path: '/timetable'
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: 'Screen Time Analytics',
      description: 'Track and analyze your digital habits across all your devices to understand where your time goes.',
      color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
      path: '/screen-time'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Website Blocking',
      description: 'Eliminate distractions by blocking time-wasting websites during your focus periods.',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
      path: '/website-blocking'
    },
    {
      icon: <Focus className="h-6 w-6" />,
      title: 'Focus Sessions',
      description: 'Schedule dedicated focus sessions with timers and distraction blocking to maximize productivity.',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
      path: '/dashboard'
    }
  ];

  const benefits = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-indigo-500" />,
      title: 'Powered by AI',
      description: 'Our system learns from your habits and provides personalized recommendations to improve productivity.'
    },
    {
      icon: <Timer className="h-10 w-10 text-indigo-500" />,
      title: 'Real Screen Time Tracking',
      description: 'Syncs with your devices and accounts to give you a complete picture of your digital habits.'
    },
    {
      icon: <Clock className="h-10 w-10 text-indigo-500" />,
      title: 'Time Management',
      description: 'Analyze how you spend your time and identify opportunities for improving focus and efficiency.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 z-0" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }} />
        </div>
        
        <div className="container mx-auto px-8 z-10 max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 mb-4 inline-block">
                Reclaim your focus and productivity
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Distracto
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Your all-in-one solution to defeat digital distractions, monitor screen time across all devices, and build productive habits.
            </motion.p>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Powered by AI, synced with your devices, designed for focus.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Dashboard" : "Get Started"} <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/timetable">
                  Try Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Abstract shape decoration */}
        <div className="absolute -bottom-32 left-0 right-0 h-64 bg-indigo-500/5 -skew-y-3 z-0" />
      </section>
      
      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 mb-4 inline-block">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Everything you need to defeat distractions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our integrated suite of tools helps you understand your habits,
              plan effectively, and eliminate distractions.
            </p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md group"
              >
                <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <Button asChild variant="ghost" className="group">
                  <Link to={feature.path}>
                    Learn more <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-indigo-50 dark:bg-indigo-950/30 relative">
        <div className="container mx-auto px-8 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 mb-4 inline-block">
              Why Choose Distracto
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Built for real productivity gains
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our science-backed approach helps you understand and improve your digital habits
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-8 max-w-6xl">
          <motion.div
            className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-12 text-white text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">
              Ready to take control of your digital life?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of users who have transformed their productivity with Distracto
            </p>
            <Button asChild size="lg" className="rounded-full px-8 bg-white text-indigo-600 hover:bg-white/90">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"} <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
