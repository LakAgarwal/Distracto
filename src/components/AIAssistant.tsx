import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Minimize, Loader2, Key, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getAIAssistantResponse, AIModel, getAvailableModels } from '@/utils/openai';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant powered by Gemini 1.5 Flash. I can help with a wide range of topics, from science and technology to productivity and motivation. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-1.5-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const availableModels = getAvailableModels();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key') || localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    try {
      let key = selectedModel.startsWith('gemini') 
        ? localStorage.getItem('gemini_api_key')
        : localStorage.getItem('claude_api_key');
      
      if (!key) {
        key = localStorage.getItem('ai_api_key');
      }
      
      if (!key) {
        setIsTyping(false);
        setShowApiKeyInput(true);
        return;
      }
      
      const response = await getAIAssistantResponse(input, key, selectedModel);
      
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sorry, I couldn't process your request right now.";
      toast.error(errorMessage);
      console.error("Error processing message:", error);
      
      if (error instanceof Error && error.message.includes("API key")) {
        setShowApiKeyInput(true);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    if (selectedModel.startsWith('gemini')) {
      localStorage.setItem('gemini_api_key', apiKey);
    } else if (selectedModel === 'claude-3-opus') {
      localStorage.setItem('claude_api_key', apiKey);
    }
    
    localStorage.setItem('ai_api_key', apiKey);
    
    setShowApiKeyInput(false);
    toast.success('API key saved successfully');
    
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      const lastMessage = messages[messages.length - 1];
      setInput(lastMessage.content);
      setMessages(prev => prev.slice(0, -1));
      setTimeout(() => {
        handleSendMessage();
      }, 500);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12 shadow-md" 
          onClick={() => setMinimized(false)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 left-4 w-80 z-50"
    >
      <Card className="shadow-lg overflow-hidden border-t-4 border-t-primary">
        <div className="flex justify-between items-center p-3 border-b bg-muted/30">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={toggleSettings}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMinimized(true)}>
              <Minimize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showSettings && !showApiKeyInput && (
          <div className="p-3 border-b bg-background">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">Select AI Model</label>
                <Select value={selectedModel} onValueChange={(value: AIModel) => setSelectedModel(value)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="text-xs">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowApiKeyInput(true)}
                >
                  <Key className="h-3 w-3 mr-1" />
                  Update API Key
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    setMessages([{
                      id: '1',
                      content: "Hello! I'm your AI assistant. How can I help you today?",
                      sender: 'assistant',
                      timestamp: new Date()
                    }]);
                  }}
                >
                  Clear Chat
                </Button>
              </div>
            </div>
          </div>
        )}

        {showApiKeyInput ? (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Enter your API Key</h3>
            <p className="text-xs text-muted-foreground mb-3">
              {selectedModel.startsWith('gemini') 
                ? 'Enter your Google AI API key for Gemini. You can get one at makersuite.google.com' 
                : 'Enter your Anthropic API key for Claude.'}
            </p>
            <div className="space-y-3">
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="Your API key" 
                className="text-xs"
              />
              <Button onClick={saveApiKey} className="w-full text-xs" size="sm">
                <Key className="h-3 w-3 mr-1" />
                Save API Key
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your API key is stored locally and never shared.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-80 p-3">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex mb-3 justify-start">
                  <div className="bg-muted max-w-[85%] p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">AI is typing...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-3 border-t bg-background">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default AIAssistant;
