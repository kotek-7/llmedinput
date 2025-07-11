import './App.css';
import { BasicExample } from './examples/BasicExample';
import { AdvancedExample } from './examples/AdvancedExample';
import { CustomProviderExample } from './examples/CustomProviderExample';

function App() {
  return (
    <div className="app">
      <header className="demo-header">
        <h1>🤖 LLM Input Library</h1>
        <p className="demo-subtitle">
          Copilot-style inline text completion for React applications
        </p>
      </header>

      <main className="demo-main">
        <section className="demo-intro">
          <h2>Features</h2>
          <ul className="feature-list">
            <li>✨ Copilot-style inline completions</li>
            <li>🔌 Pluggable LLM providers</li>
            <li>⚡ Debounced API calls with abort control</li>
            <li>🎨 Customizable styling</li>
            <li>♿ Accessibility support</li>
            <li>📱 Responsive design</li>
          </ul>
        </section>

        <section className="examples-container">
          <BasicExample />
          <AdvancedExample />
          <CustomProviderExample />
        </section>

        <section className="demo-section">
          <h2>💡 Keyboard Shortcuts</h2>
          <div className="shortcuts-grid">
            <div className="shortcut">
              <kbd>Tab</kbd>
              <span>Accept suggestion</span>
            </div>
            <div className="shortcut">
              <kbd>Esc</kbd>
              <span>Dismiss suggestion</span>
            </div>
            <div className="shortcut">
              <kbd>Arrow keys</kbd>
              <span>Move cursor (dismisses suggestion)</span>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>🚀 Getting Started</h2>
          <div className="code-example">
            <pre><code>{`import { LLMInput } from 'llm-input';

function MyApp() {
  const [value, setValue] = useState('');
  
  const getSuggestion = async (input: string) => {
    // Your LLM API call here
    return await callYourLLMAPI(input);
  };

  return (
    <LLMInput
      value={value}
      onChange={setValue}
      getSuggestion={getSuggestion}
      placeholder="Start typing..."
    />
  );
}`}</code></pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
