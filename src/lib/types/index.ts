// LLMInput Library Types

export interface LLMInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (completedText: string) => void;
  placeholder?: string;
  getSuggestion: (input: string) => Promise<string>;
  className?: string;
}

export interface CompletionState {
  suggestion: string;
  showSuggestion: boolean;
  isLoading: boolean;
}

export type CompletionAction =
  | { type: 'SUGGESTION_RECEIVED'; payload: string }
  | { type: 'SUGGESTION_DISMISSED' }
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' };

export interface MockSuggestions {
  [key: string]: string;
}

export interface CompletionOptions {
  delay?: number;
  minInputLength?: number;
  suggestions?: MockSuggestions;
  fallback?: string;
}