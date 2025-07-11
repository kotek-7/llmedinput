# プロジェクト仕様

## Library Specification

### Core Features

- **汎用性**: 既存の`<input>`タグと同じAPIで使用可能
- **LLM統合**: OpenAI, Anthropic, Google等の主要LLMプロバイダに対応
- **リアルタイム補完**: 入力中に動的に補完候補を表示
- **カスタマイズ可能**: 補完ロジック、UI、トリガー条件を設定可能

### Target Use Cases

- **フォーム入力支援**: 住所、メール、商品名の自動補完
- **コンテンツ作成**: ブログ記事、メール文面の下書き支援
- **データ入力**: 構造化データの効率的な入力
- **検索改善**: より適切な検索クエリの提案

### Architecture Design

#### Component Structure

```
LLMInputProvider (Context Provider)
├── LLMInput (メインコンポーネント)
│   ├── InputField (入力フィールド)
│   └── SuggestionList (補完候補表示)
└── LLMService (プロバイダ抽象化層)
    ├── OpenAIProvider
    ├── AnthropicProvider
    └── CustomProvider
```

#### Data Flow

1. **入力処理**: `onChange` → デバウンシング → API呼び出し
2. **状態管理**: `useState/useReducer`で入力値、補完候補、ローディング状態を管理
3. **プロバイダパターン**: 異なるLLMサービスを統一インターフェースで扱う
4. **キャッシュ層**: 同じクエリの重複呼び出しを防ぐ

#### API Design

```typescript
// 基本使用例
<LLMInput
  value={value}
  onChange={setValue}
  provider="openai"
  apiKey={apiKey}
  completionConfig={{
    model: "gpt-4",
    maxTokens: 100,
    temperature: 0.7
  }}
  debounceMs={300}
  minInputLength={3}
  placeholder="Enter text..."
/>

// プロバイダ設定
<LLMInputProvider config={{
  providers: {
    openai: { apiKey: "...", model: "gpt-4" },
    anthropic: { apiKey: "...", model: "claude-3" }
  }
}}>
  <LLMInput provider="openai" />
</LLMInputProvider>
```

### Performance Optimizations

- **デバウンシング**: AbortController併用でリクエスト制御
- **LRUキャッシュ**: 同一クエリの結果をキャッシュ
- **遅延ローディング**: プロバイダ別のコード分割
- **バンドルサイズ最適化**: Tree-shaking対応

### Security Considerations

- **APIキー管理**: 環境変数またはサーバーサイドプロキシ経由
- **入力検証**: XSS対策、文字数制限
- **レート制限**: トークンバケット方式でAPI呼び出し制御
- **プライバシー**: 入力データの暗号化、ログ出力制限

### Development Guidelines

1. **拡張性**: 新しいLLMプロバイダを簡単に追加可能な設計
2. **カスタマイズ性**: 補完ロジック、UI、トリガー条件の設定機能
3. **パフォーマンス**: デバウンシング、キャッシュ、遅延ローディングの実装
4. **セキュリティ**: APIキー管理、入力検証、レート制限の徹底

## Storybook Configuration

### Setup Requirements

```bash
# Install Storybook
pnpm dlx storybook@latest init

# Additional dependencies for React + TypeScript + Vite
pnpm add -D @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-docs
```

### Story Structure

```
src/
├── components/
│   ├── LLMInput/
│   │   ├── LLMInput.tsx
│   │   ├── LLMInput.stories.tsx
│   │   └── LLMInput.test.tsx
│   ├── LLMInputProvider/
│   │   ├── LLMInputProvider.tsx
│   │   └── LLMInputProvider.stories.tsx
│   └── SuggestionList/
│       ├── SuggestionList.tsx
│       └── SuggestionList.stories.tsx
```

### Story Examples

```typescript
// LLMInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LLMInput } from './LLMInput';

const meta: Meta<typeof LLMInput> = {
  title: 'Components/LLMInput',
  component: LLMInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    debounceMs: 300,
    minInputLength: 3,
  },
};

export const WithMockProvider: Story = {
  args: {
    ...Default.args,
    provider: 'mock',
  },
};

export const CustomStyling: Story = {
  args: {
    ...Default.args,
    className: 'custom-llm-input',
  },
};
```

### Testing Strategy with Storybook

- **Visual Testing**: 各コンポーネントの外観とインタラクションをテスト
- **Props Validation**: 異なるpropsの組み合わせでの動作確認
- **Mock Provider**: 実際のLLM APIを使わずにUI動作をテスト
- **Accessibility**: アクセシビリティチェック
- **Responsive Design**: 様々な画面サイズでのテスト
