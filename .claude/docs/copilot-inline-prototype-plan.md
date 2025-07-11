# Copilot風インライン補完UI実装計画

## 1. UI仕様の定義

### 基本動作

- **インライン表示**: 入力テキストの直後に灰色で補完候補を表示
- **単一候補**: 一度に1つの補完候補のみ表示（ドロップダウンなし）
- **Tab補完**: Tabキーで現在の候補を受け入れ
- **Escape拒否**: Escapeキーで候補を拒否/非表示
- **継続入力**: 文字入力で候補が動的に更新

### 視覚デザイン

```
ユーザー入力: "Hello w"
表示結果: "Hello w|orld with AI assistance"
         実際の文字   灰色の補完候補
```

## 2. 技術的実装方式

### アプローチ1: オーバーレイ式

```typescript
// 入力フィールドの上に透明な div を重ねる方式
<div className="input-container">
  <input value={userInput} onChange={handleChange} />
  <div className="suggestion-overlay">
    <span className="user-text">{userInput}</span>
    <span className="suggestion-text">{suggestion}</span>
  </div>
</div>
```

### アプローチ2: 単一要素式（推奨）

```typescript
// contentEditable div で実現
<div
  contentEditable
  className="inline-input"
  onInput={handleInput}
>
  <span className="user-text">{userInput}</span>
  <span className="suggestion-ghost">{suggestion}</span>
</div>
```

### 状態管理

```typescript
interface InlineCompletionState {
  userInput: string; // ユーザーが入力したテキスト
  suggestion: string; // 現在の補完候補
  isShowingSuggestion: boolean; // 候補表示中かどうか
  cursorPosition: number; // カーソル位置
}
```

## 3. 実装ステップとコンポーネント設計

### Phase 1: 基本コンポーネント（1-2時間）

```typescript
// InlineCompletionInput.tsx
interface InlineCompletionInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (completedText: string) => void;
  placeholder?: string;
  getSuggestion?: (input: string) => Promise<string>;
}
```

### Phase 2: キーボードハンドリング（30分）

- Tab: 補完受け入れ
- Escape: 補完拒否
- Arrow keys: カーソル移動時は補完非表示
- Enter: 通常の改行（補完は無視）

### Phase 3: スタイリング（30分）

```css
.inline-completion-input {
  position: relative;
  font-family: 'Monaco', 'Menlo', monospace;
}

.suggestion-ghost {
  color: #6b7280; /* 灰色 */
  opacity: 0.6;
  pointer-events: none;
  user-select: none;
}

.user-text {
  color: inherit;
}
```

### Phase 4: モック統合（15分）

```typescript
const mockGetSuggestion = async (input: string): Promise<string> => {
  if (input.length < 3) return '';

  const suggestions = {
    'Hello w': 'orld with AI assistance',
    'How to': ' implement LLM completion',
    React: ' components with TypeScript',
  };

  return suggestions[input] || ' with AI completion';
};
```

## 4. キーボードインタラクションとアクセシビリティ

### キーボードショートカット

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Tab':
      if (isShowingSuggestion) {
        e.preventDefault();
        acceptSuggestion();
      }
      break;

    case 'Escape':
      if (isShowingSuggestion) {
        e.preventDefault();
        dismissSuggestion();
      }
      break;

    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowDown':
      // カーソル移動時は補完を非表示
      dismissSuggestion();
      break;
  }
};
```

### アクセシビリティ対応

```typescript
// ARIA属性の設定
<div
  role="textbox"
  aria-label="LLM-powered input with inline completion"
  aria-describedby="completion-help"
  aria-expanded={isShowingSuggestion}
  aria-autocomplete="inline"
>
  {/* 補完候補がある場合のスクリーンリーダー通知 */}
  {isShowingSuggestion && (
    <div
      id="completion-help"
      aria-live="polite"
      className="sr-only"
    >
      Suggestion available: {suggestion}. Press Tab to accept, Escape to dismiss.
    </div>
  )}
</div>
```

## 5. 実装優先順位と時間見積もり

### 最小構成（約3時間）

1. **基本インライン表示**（90分）
   - contentEditable または input overlay
   - 基本的な文字入力とカーソル管理

2. **Tab補完機能**（45分）
   - キーボードイベントハンドリング
   - 補完の受け入れ/拒否

3. **モック補完API**（30分）
   - 固定パターンの補完候補
   - デバウンシング処理

4. **基本スタイリング**（15分）
   - 灰色の候補表示
   - カーソルとフォント調整

### 拡張機能（段階的追加）

- **複数候補切り替え**（Ctrl+→/←で候補変更）
- **部分補完**（単語単位でのTab補完）
- **補完統計**（受け入れ率、拒否率の追跡）
- **カスタマイズ**（色、フォント、ショートカットキー）

## 6. 主要な実装課題と解決策

### 課題1: カーソル位置の正確な管理

```typescript
// Selection API を使用してカーソル位置を制御
const setCursorPosition = (element: HTMLElement, position: number) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(element.childNodes[0], position);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
};
```

### 課題2: contentEditable の制御

```typescript
// contentEditable の不要な機能を無効化
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const text = e.clipboardData?.getData('text/plain') || '';
  insertText(text);
};
```

### 課題3: モバイル対応

```typescript
// タッチデバイスでの動作調整
const isTouchDevice = 'ontouchstart' in window;
const completionTrigger = isTouchDevice ? 'onDoubleTab' : 'onTab';
```

## 7. コンポーネント階層構造

### Copilot風UI用の新しいコンポーネント構成

```
src/
├── components/
│   ├── LLMInput.tsx              # 既存のドロップダウン式
│   ├── InlineCompletionInput.tsx # 新しいCopilot風
│   └── common/
│       ├── CompletionProvider.tsx # 補完ロジック共通化
│       └── types.ts              # 型定義
├── hooks/
│   ├── useInlineCompletion.ts    # インライン補完フック
│   └── useKeyboardShortcuts.ts   # キーボードイベント管理
└── utils/
    ├── cursorUtils.ts            # カーソル位置制御
    └── completionUtils.ts        # 補完ロジック
```

この実装計画により、約3時間でCopilot風のインライン補完UIが完成し、段階的に機能を拡張できます。
