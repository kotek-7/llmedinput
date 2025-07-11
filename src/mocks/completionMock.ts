/**
 * LLM補完機能のモック実装
 * 実際のLLM APIの代替として使用
 */

interface MockSuggestions {
  [key: string]: string;
}

// モック補完候補データ
const mockSuggestions: MockSuggestions = {
  'Hello w': 'orld with AI assistance',
  'How to': ' implement LLM completion',
  React: ' components with TypeScript',
  TypeScript: ' is a powerful language',
  AI: ' will help you write better code',
  Machine: ' learning is the future',
  multiline: ' text example\nwith multiple lines\nof content',
  JavaScript: ' is a versatile programming language',
  Python: ' is great for data science',
  Node: '.js for server-side development',
  CSS: ' for styling web applications',
  HTML: ' markup for web structure',
  API: ' integration with modern frameworks',
  Database: ' design and optimization',
  Git: ' version control best practices',
  Docker: ' containerization for deployment',
};

/**
 * モック補完機能の実装
 * @param input - ユーザーの入力文字列
 * @returns Promise<string> - 補完候補文字列
 */
export const mockGetSuggestion = async (input: string): Promise<string> => {
  // 最小文字数チェック
  if (input.length < 3) {
    return '';
  }

  // モック遅延（実際のAPI呼び出しをシミュレート）
  await new Promise(resolve => setTimeout(resolve, 300));

  // 部分マッチを探す（大文字小文字を無視）
  for (const [key, value] of Object.entries(mockSuggestions)) {
    if (input.toLowerCase().startsWith(key.toLowerCase())) {
      return value;
    }
  }

  // デフォルトの補完（マッチするものがない場合）
  return ' with AI assistance';
};

/**
 * モック設定用のユーティリティ関数
 */
export const mockConfig = {
  /**
   * 遅延時間を設定（ミリ秒）
   */
  delay: 300,

  /**
   * 最小入力文字数を設定
   */
  minInputLength: 3,

  /**
   * 新しい補完候補を追加
   * @param key - トリガーとなる入力文字列
   * @param value - 補完候補文字列
   */
  addSuggestion: (key: string, value: string) => {
    mockSuggestions[key] = value;
  },

  /**
   * 補完候補を削除
   * @param key - 削除する入力文字列
   */
  removeSuggestion: (key: string) => {
    delete mockSuggestions[key];
  },

  /**
   * 全ての補完候補を取得
   */
  getAllSuggestions: () => ({ ...mockSuggestions }),

  /**
   * 補完候補をリセット
   */
  resetSuggestions: () => {
    Object.keys(mockSuggestions).forEach(key => {
      delete mockSuggestions[key];
    });
  },
};

/**
 * カスタマイズ可能なモック補完関数を作成
 * @param options - 設定オプション
 * @returns カスタマイズされた補完関数
 */
export const createMockSuggestion = (options: {
  delay?: number;
  minInputLength?: number;
  suggestions?: MockSuggestions;
  fallback?: string;
}) => {
  const {
    delay = 300,
    minInputLength = 3,
    suggestions = mockSuggestions,
    fallback = ' with AI assistance',
  } = options;

  return async (input: string): Promise<string> => {
    if (input.length < minInputLength) {
      return '';
    }

    // カスタム遅延
    await new Promise(resolve => setTimeout(resolve, delay));

    // カスタム補完候補から検索
    for (const [key, value] of Object.entries(suggestions)) {
      if (input.toLowerCase().startsWith(key.toLowerCase())) {
        return value;
      }
    }

    return fallback;
  };
};
