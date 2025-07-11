import { useState } from 'react';
import { LLMInput } from '../../lib';

export const BasicExample = () => {
  const [value, setValue] = useState('');

  // Basic mock completion (simplified for debugging)
  const mockGetSuggestion = async (input: string): Promise<string> => {
    try {
      console.log('mockGetSuggestion called with:', input);
      
      if (input.length < 3) return '';

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const suggestions: { [key: string]: string } = {
        'Hello w': 'orld with AI assistance',
        'How to': ' implement LLM completion',
        'React': ' components with TypeScript',
        'TypeScript': ' is a powerful language',
        'AI': ' will help you write better code',
      };

      // Find matching suggestion
      for (const [key, value] of Object.entries(suggestions)) {
        if (input.toLowerCase().startsWith(key.toLowerCase())) {
          console.log('Found suggestion:', value);
          return value;
        }
      }

      const fallback = ' with AI assistance';
      console.log('Using fallback:', fallback);
      return fallback;
    } catch (error) {
      console.error('Error in mockGetSuggestion:', error);
      return '';
    }
  };

  return (
    <div className="example-section">
      <h3>Basic Example</h3>
      <p>Simple LLM input with default mock completion.</p>
      
      <LLMInput
        value={value}
        onChange={setValue}
        getSuggestion={mockGetSuggestion}
        placeholder="Type 'Hello w' or 'React'..."
      />
      
      <div className="output">
        <strong>Current value:</strong> {value || 'Empty'}
      </div>
    </div>
  );
};