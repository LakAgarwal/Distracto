
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export type AIModel = 'gemini-1.5-flash' | 'gemini-pro' | 'claude-3-opus';

export const callOpenAI = async (
  prompt: string,
  apiKey: string | null,
  model: AIModel = 'gemini-1.5-flash',
  temperature = 0.7,
  maxTokens = 1000
): Promise<string> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("No API key provided. Please set your API key in your profile settings.");
  }

  try {
    console.log(`Calling ${model} API...`);
    
    // For Gemini models
    if (model === 'gemini-pro' || model === 'gemini-1.5-flash') {
      const endpoint = model === 'gemini-1.5-flash' 
        ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' 
        : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxTokens,
            topP: 0.8,
            topK: 40
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        
        if (response.status === 400) {
          throw new Error("Invalid request to Gemini API. Please check your prompt.");
        } else if (response.status === 403) {
          throw new Error("Invalid API key or unauthorized. Please check your Google API key in your profile settings.");
        }
        throw new Error(errorData.error?.message || "Error calling Gemini API");
      }

      const data = await response.json() as GeminiResponse;
      return data.candidates[0]?.content?.parts[0]?.text || "No response from Gemini";
    }
    // For Claude model
    else if (model === 'claude-3-opus') {
      try {
        // Simulate API call to Claude
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return "This is a response from Claude 3 Opus. To use the actual Claude API, you would need to integrate with Anthropic's API using your API key.";
      } catch (error) {
        console.error("Claude API error:", error);
        throw new Error("Error calling Claude API. This is a simulated response as the actual integration requires an Anthropic API key.");
      }
    }
    else {
      throw new Error(`Unsupported model: ${model}`);
    }
  } catch (error) {
    console.error(`Error calling ${model}:`, error);
    throw error;
  }
};

export const generateTimeTable = async (
  userPrompt: string, 
  apiKey: string | null, 
  model: AIModel = 'gemini-1.5-flash'
): Promise<{ 
  schedule: { date: string; tasks: Array<{ time: string; description: string }> };
  recommendations: string[];
}> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("No API key provided. Please set your API key in your profile settings.");
  }
  
  const systemPrompt = `
    You are a productivity expert and scheduler. Based on the user's request, create a detailed daily schedule.
    
    Return your response in the following JSON format:
    {
      "date": "Current day, formatted as: Weekday, Month Day",
      "tasks": [
        {"time": "HH:MM - HH:MM", "description": "Task description"},
        ...
      ],
      "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3",
        "Recommendation 4"
      ]
    }
    
    Keep in mind:
    - Provide at least 8-12 tasks for a full day schedule
    - Include breaks and meals in the schedule
    - Adjust times based on whether the user indicates early morning or late night preferences
    - Include 3-4 specific recommendations relevant to the user's goals
    - Provide only the JSON. No explanations or additional text.
  `;

  const prompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;
  
  try {
    console.log(`Generating timetable using ${model}...`);
    const response = await callOpenAI(prompt, apiKey, model, 0.7, 1500);
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    try {
      const scheduleData = JSON.parse(jsonMatch[0]);
      return scheduleData;
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Response:", response);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    console.error("Error generating timetable:", error);
    throw error;
  }
};

export const getAIAssistantResponse = async (
  message: string,
  apiKey: string | null,
  model: AIModel = 'gemini-1.5-flash'
): Promise<string> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("No API key provided. Please set your API key in your profile settings.");
  }
  
  const systemPrompt = `
    You are a helpful, knowledgeable, and friendly AI assistant for an app called Distracto. Respond to the user's queries in a conversational manner.
    Provide accurate information about a wide range of topics, including science, technology, history, arts, and more.
    If the user asks about complex scientific concepts, provide clear explanations that are accessible but accurate.
    Keep responses concise but informative, between 2-4 paragraphs. Be engaging and personable in your tone.
    
    Distracto is an app that helps users manage their screen time, block distracting websites, and create productive schedules.
  `;

  const prompt = `${systemPrompt}\n\nUser message: ${message}`;
  
  try {
    console.log(`Getting AI assistant response using ${model}...`);
    return await callOpenAI(prompt, apiKey, model, 0.8, 1000);
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw error;
  }
};

export const getAvailableModels = (): { id: AIModel; name: string; description: string }[] => {
  return [
    { 
      id: 'gemini-1.5-flash', 
      name: 'Gemini 1.5 Flash', 
      description: 'Google\'s fastest and most cost-effective AI model (default)' 
    },
    { 
      id: 'gemini-pro', 
      name: 'Gemini Pro', 
      description: 'Google\'s advanced large language model' 
    },
    { 
      id: 'claude-3-opus', 
      name: 'Claude 3 Opus', 
      description: 'Anthropic\'s most capable model for complex tasks' 
    }
  ];
};

