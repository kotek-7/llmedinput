import { useState } from 'react';
import { LLMInput } from './components/LLMInput';
import { mockGetSuggestion } from './mocks/completionMock';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [completedTexts, setCompletedTexts] = useState<string[]>([]);

  const handleComplete = (suggestion: string) => {
    setCompletedTexts(prev => [...prev, suggestion]);
  };

  return (
    <div className="app">
      <h1>LLM Input Completion Demo</h1>
      <p>Type at least 3 characters to see suggestions</p>

      <div className="demo-section">
        <h2>🆕 Copilot-style Inline Completion</h2>
        <p>
          Type text and see inline suggestions appear in gray. Press{' '}
          <kbd>Tab</kbd> to accept or <kbd>Esc</kbd> to dismiss.
        </p>
        <LLMInput
          value={inputValue}
          onChange={setInputValue}
          onComplete={handleComplete}
          getSuggestion={mockGetSuggestion}
          placeholder="Try typing 'Hello w', 'React', or 'AI'..."
        />

        <div className="output">
          <h3>Current Input:</h3>
          <p>{inputValue || 'No input yet'}</p>
        </div>
      </div>

      {completedTexts.length > 0 && (
        <div className="output">
          <h3>Completion History:</h3>
          <ul>
            {completedTexts.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
          <button
            onClick={() => setCompletedTexts([])}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear History
          </button>
        </div>
      )}

      <div className="demo-section">
        <h2>💡 How to Use</h2>
        <div
          style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          <h3>Inline Completion (Copilot-style):</h3>
          <ul>
            <li>
              <kbd>Tab</kbd> - Accept the current suggestion
            </li>
            <li>
              <kbd>Esc</kbd> - Dismiss the suggestion
            </li>
            <li>
              <kbd>Arrow keys</kbd> - Move cursor (dismisses suggestion)
            </li>
          </ul>

          <h3>Try these prompts:</h3>
          <ul>
            <li>"Hello w" → "orld with AI assistance"</li>
            <li>"React" → " components with TypeScript"</li>
            <li>"AI" → " will help you write better code"</li>
            <li>"How to" → " implement LLM completion"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
