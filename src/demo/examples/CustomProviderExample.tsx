import { useState } from 'react';
import { LLMInput } from '../../lib';

// Simulate a different LLM provider
const simulateOpenAI = async (input: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Simulate OpenAI-style completions
  const openAIStyle: { [key: string]: string } = {
    'write a': ' professional email to the client',
    'create a': ' React component for user authentication',
    'explain': ' the concept of artificial intelligence',
    'debug': ' the following JavaScript code',
    'optimize': ' this SQL query for better performance',
  };
  
  for (const [trigger, completion] of Object.entries(openAIStyle)) {
    if (input.toLowerCase().startsWith(trigger)) {
      return completion;
    }
  }
  
  return ` and continue with AI assistance`;
};

export const CustomProviderExample = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProviderCall = async (input: string): Promise<string> => {
    console.log('Calling custom provider with input:', input);
    setIsLoading(true);
    try {
      const result = await simulateOpenAI(input);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="example-section">
      <h3>Custom Provider Example</h3>
      <p>Simulated OpenAI integration with custom provider function.</p>
      
      <LLMInput
        value={value}
        onChange={setValue}
        getSuggestion={handleProviderCall}
        placeholder="Try 'write a', 'create a', 'explain'..."
      />
      
      {isLoading && <div className="provider-status">🔄 Calling OpenAI API...</div>}
      
      <div className="output">
        <strong>Current value:</strong> {value || 'Empty'}
      </div>
      
      <div className="provider-info">
        <small>
          This example demonstrates how to integrate with real LLM providers.
          Replace <code>simulateOpenAI</code> with actual API calls.
        </small>
      </div>
    </div>
  );
};