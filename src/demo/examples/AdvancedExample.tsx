import { useState } from 'react';
import { LLMInput } from '../../lib';

export const AdvancedExample = () => {
  const [value, setValue] = useState('');
  const [completions, setCompletions] = useState<string[]>([]);

  // Custom suggestions with faster response
  const customSuggestion = async (input: string): Promise<string> => {
    if (input.length < 2) return '';

    // Fast response (100ms delay)
    await new Promise(resolve => setTimeout(resolve, 100));

    const suggestions: { [key: string]: string } = {
      'fast': ' completion with short delay',
      'custom': ' suggestion with 2-char trigger',
      'demo': ' of advanced configuration',
      'quick': ' response example',
      'test': ' with minimal input length',
    };

    // Find matching suggestion
    for (const [key, value] of Object.entries(suggestions)) {
      if (input.toLowerCase().startsWith(key.toLowerCase())) {
        return value;
      }
    }

    return ' (custom fallback)';
  };

  const handleComplete = (completed: string) => {
    setCompletions(prev => [...prev, completed]);
  };

  return (
    <div className="example-section">
      <h3>Advanced Example</h3>
      <p>Custom configuration with completion tracking.</p>
      
      <LLMInput
        value={value}
        onChange={setValue}
        onComplete={handleComplete}
        getSuggestion={customSuggestion}
        placeholder="Try 'fast', 'custom', 'demo', 'quick'..."
        className="advanced-input"
      />
      
      <div className="output">
        <strong>Current value:</strong> {value || 'Empty'}
        
        {completions.length > 0 && (
          <div>
            <strong>Completed suggestions:</strong>
            <ul>
              {completions.map((completion, index) => (
                <li key={index}>{completion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};