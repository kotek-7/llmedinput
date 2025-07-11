import React, { useEffect } from 'react';
import { useCompletion } from '../hooks/useCompletion';

interface LLMInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (completedText: string) => void;
  placeholder?: string;
  getSuggestion: (input: string) => Promise<string>;
  className?: string;
}

export const LLMInput: React.FC<LLMInputProps> = ({
  value,
  onChange,
  onComplete,
  placeholder = 'Start typing...',
  getSuggestion,
  className = '',
}) => {
  const { state, dispatch, debouncedFetch } = useCompletion(getSuggestion);

  // 入力変更時にAPI呼び出し（valueの変更を直接監視）
  useEffect(() => {
    // 入力変更時は即座に補完をクリア
    dispatch({ type: 'SUGGESTION_DISMISSED' });
    // デバウンス付きでAPI呼び出し
    debouncedFetch(value);
  }, [value, debouncedFetch, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 直接親に通知（内部状態は更新しない）
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Tab':
        if (state.showSuggestion && state.suggestion) {
          e.preventDefault();
          const completed = value + state.suggestion;
          onChange(completed);
          dispatch({ type: 'SUGGESTION_DISMISSED' });
          onComplete?.(completed);
        }
        break;

      case 'Escape':
        if (state.showSuggestion) {
          e.preventDefault();
          dispatch({ type: 'SUGGESTION_DISMISSED' });
        }
        break;

      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        // カーソル移動時は補完を非表示
        dispatch({ type: 'SUGGESTION_DISMISSED' });
        break;
    }
  };

  const handleFocus = () => {
    if (value.length >= 3 && state.suggestion) {
      dispatch({ type: 'SUGGESTION_RECEIVED', payload: state.suggestion });
    }
  };

  const handleBlur = () => {
    // 少し遅延させてTab補完が実行できるようにする
    setTimeout(() => {
      dispatch({ type: 'SUGGESTION_DISMISSED' });
    }, 150);
  };

  return (
    <div className={`llm-input-container ${className}`}>
      {/* 実際の入力要素 */}
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="llm-input-field"
        aria-label="LLM-powered input with inline completion"
        aria-expanded={state.showSuggestion}
        aria-autocomplete="inline"
      />

      {/* 補完表示オーバーレイ */}
      <div className="llm-suggestion-overlay" aria-hidden="true">
        <span className="input-text">{value}</span>
        {state.showSuggestion && (
          <span className="suggestion-text">{state.suggestion}</span>
        )}
      </div>

      {/* ローディング表示 */}
      {state.isLoading && (
        <div className="loading-indicator">
          <span className="loading-spinner"></span>
        </div>
      )}

      {/* スクリーンリーダー用のヘルプテキスト */}
      {state.showSuggestion && state.suggestion && (
        <div id="completion-help" aria-live="polite" className="sr-only">
          Suggestion available: {state.suggestion}. Press Tab to accept, Escape
          to dismiss.
        </div>
      )}
    </div>
  );
};
