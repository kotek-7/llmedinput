# ドロップダウン式プロトタイプ実装計画

## Demo/Prototype Implementation Plan

### 1. 核心機能の特定

**必須機能：**

- テキスト入力フィールド
- 入力に基づく補完候補の表示
- 補完候補の選択機能
- ローディング状態の表示

**省略可能（後で追加）：**

- 複数LLMプロバイダー対応
- 高度なキャッシュ機能
- 詳細な設定オプション
- アクセシビリティ対応

### 2. 最小限のコンポーネント構成

```
src/
├── components/
│   └── LLMInput.tsx          # 単一のメインコンポーネント
├── App.tsx                    # デモアプリケーション
├── App.css                    # 基本スタイル
└── main.tsx                   # エントリーポイント（既存）
```

### 3. 実装戦略

#### Phase 1: 基本構造

1. **LLMInputコンポーネント**
   - シンプルなpropsインターフェース
   - useState による状態管理
   - モック補完機能（setTimeout使用）

#### Phase 2: UI機能

2. **基本的な補完UI**
   - 入力フィールド
   - ドロップダウン形式の補完候補
   - ローディングインジケーター

#### Phase 3: インタラクション

3. **基本的なユーザーインタラクション**
   - 入力時の補完候補表示
   - マウスクリックで選択
   - 基本的なキーボード操作（Enter、Escape）

### 4. 技術選択

- **状態管理**: useState（シンプル）
- **API呼び出し**: モック関数（setTimeout）
- **スタイリング**: CSS（外部ライブラリなし）
- **イベント処理**: 基本的なReactイベント

### 5. データフロー（簡略版）

```
入力変更 → debounce（簡易版） → モック補完 → 状態更新 → 再レンダー
```

### 6. 実装順序

1. **基本コンポーネント作成**（30分）
2. **モック機能実装**（20分）
3. **基本スタイル追加**（20分）
4. **デモアプリ統合**（10分）
5. **動作確認・調整**（10分）

### 7. 段階的拡張計画

- **v0.1**: 基本的なモック機能
- **v0.2**: 実際のLLM API統合
- **v0.3**: デバウンシング・キャッシュ
- **v0.4**: プロバイダー抽象化
- **v0.5**: 高度な機能（アクセシビリティ等）

### 8. 実装コード例

#### LLMInput.tsx（最小限版）

```typescript
import React, { useState, useEffect } from 'react';

interface LLMInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onComplete?: (suggestion: string) => void;
}

export const LLMInput: React.FC<LLMInputProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  onComplete
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // モック補完機能
  const mockComplete = async (input: string): Promise<string[]> => {
    if (input.length < 3) return [];

    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSuggestions = [
          `${input} with AI assistance`,
          `${input} using machine learning`,
          `${input} powered by LLM technology`
        ];
        resolve(mockSuggestions);
      }, 500);
    });
  };

  // 入力変更時の処理
  useEffect(() => {
    if (value.length >= 3) {
      setIsLoading(true);
      setShowSuggestions(true);

      mockComplete(value).then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [value]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onComplete?.(suggestion);
  };

  return (
    <div className="llm-input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="llm-input"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
      />

      {showSuggestions && (
        <div className="suggestions-container">
          {isLoading ? (
            <div className="loading">Loading suggestions...</div>
          ) : (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

#### App.tsx（デモ版）

```typescript
import React, { useState } from 'react';
import { LLMInput } from './components/LLMInput';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [completedTexts, setCompletedTexts] = useState<string[]>([]);

  const handleComplete = (suggestion: string) => {
    setCompletedTexts(prev => [...prev, suggestion]);
  };

  return (
    <div className="app">
      <h1>LLM Input Demo</h1>
      <p>Type at least 3 characters to see suggestions</p>

      <LLMInput
        value={inputValue}
        onChange={setInputValue}
        onComplete={handleComplete}
        placeholder="Start typing..."
      />

      <div className="output">
        <h3>Current Input:</h3>
        <p>{inputValue || 'No input yet'}</p>

        {completedTexts.length > 0 && (
          <>
            <h3>Completed Suggestions:</h3>
            <ul>
              {completedTexts.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
```

#### 基本スタイル（App.css追加分）

```css
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.llm-input-container {
  position: relative;
  margin-bottom: 2rem;
}

.llm-input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.llm-input:focus {
  border-color: #007bff;
}

.suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.loading {
  padding: 1rem;
  color: #666;
  text-align: center;
  font-style: italic;
}

.suggestions {
  display: flex;
  flex-direction: column;
}

.suggestion-item {
  padding: 0.75rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.output {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 1rem;
}

.output h3 {
  margin-top: 0;
  color: #333;
}

.output ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.output li {
  margin: 0.25rem 0;
}
```

この実装計画により、約1-2時間で動作するプロトタイプが完成し、その後段階的に機能を拡張できます。
