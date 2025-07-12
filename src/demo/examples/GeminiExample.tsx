import { useState } from 'react';
import { LLMInput } from '../../lib';
import { createGeminiSuggestion } from '../utils/gemini';

export const GeminiExample = () => {
  const [value, setValue] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  // Create Gemini suggestion function when API key is provided
  const geminiSuggestion = apiKey ? createGeminiSuggestion({
    apiKey,
    model: 'gemini-2.5-flash',
    temperature: 0.8,
    maxTokens: 400,
  }) : null;

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setIsConfigured(true);
    }
  };

  const handleReset = () => {
    setIsConfigured(false);
    setApiKey('');
    setValue('');
  };

  if (!isConfigured) {
    return (
      <div className="example-section">
        <h3>🧠 Gemini AI Example</h3>
        <p>Connect to Google's Gemini AI for intelligent text completion.</p>
        
        <form onSubmit={handleApiKeySubmit} className="api-key-form">
          <div className="input-group">
            <label htmlFor="gemini-api-key">
              Gemini API Key:
            </label>
            <input
              id="gemini-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="api-key-input"
              required
            />
          </div>
          <button type="submit" className="configure-btn">
            Configure Gemini
          </button>
        </form>
        
        <div className="api-key-help">
          <p>
            <strong>How to get a Gemini API key:</strong>
          </p>
          <ol>
            <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
            <li>Create a new API key</li>
            <li>Copy and paste it above</li>
          </ol>
          <p><em>Note: Your API key is only stored locally and never sent to our servers.</em></p>
        </div>
      </div>
    );
  }

  return (
    <div className="example-section">
      <h3>🧠 Gemini AI Example</h3>
      <div className="configured-header">
        <p>✅ Connected to Gemini AI</p>
        <button onClick={handleReset} className="reset-btn">
          Disconnect
        </button>
      </div>
      
      <LLMInput
        value={value}
        onChange={setValue}
        getSuggestion={geminiSuggestion!}
        placeholder="Try: 'Hello w', 'I want to', 'The weather is', 'React is'..."
      />
      
      <div className="output">
        <strong>Current value:</strong> {value || 'Empty'}
      </div>
      
      <div className="gemini-info">
        <p>
          <strong>Model:</strong> gemini-2.5-flash<br/>
          <strong>Temperature:</strong> 0.8 (creative)<br/>
          <strong>Max tokens:</strong> 400 (short sentences)
        </p>
      </div>
    </div>
  );
};