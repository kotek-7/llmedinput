import { useReducer, useCallback, useRef, useMemo } from 'react';
import type { CompletionState, CompletionAction } from '../types';

// 初期状態
const initialState: CompletionState = {
  suggestion: '',
  showSuggestion: false,
  isLoading: false,
};

// Reducer関数
const completionReducer = (
  state: CompletionState,
  action: CompletionAction
): CompletionState => {
  switch (action.type) {
    case 'SUGGESTION_RECEIVED':
      return {
        ...state,
        suggestion: action.payload,
        showSuggestion: action.payload.length > 0,
      };

    case 'SUGGESTION_DISMISSED':
      return {
        ...state,
        suggestion: '',
        showSuggestion: false,
      };

    case 'LOADING_START':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOADING_END':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

// デバウンス関数
const debounce = (func: (input: string) => Promise<void>, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (input: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(input), delay);
  };
};

// カスタムフック：補完機能
export const useCompletion = (getSuggestion: (input: string) => Promise<string>) => {
  const [state, dispatch] = useReducer(completionReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const getSuggestionRef = useRef(getSuggestion);

  // getSuggestion関数の参照を更新
  getSuggestionRef.current = getSuggestion;

  // 補完候補取得関数
  const fetchSuggestion = useCallback(async (input: string) => {
    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (input.length < 3) {
      dispatch({ type: 'SUGGESTION_DISMISSED' });
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      dispatch({ type: 'LOADING_START' });
      const result = await getSuggestionRef.current(input);

      if (!controller.signal.aborted && result) {
        dispatch({ type: 'SUGGESTION_RECEIVED', payload: result });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Suggestion fetch error:', error);
        dispatch({ type: 'SUGGESTION_DISMISSED' });
      }
    } finally {
      if (!controller.signal.aborted) {
        dispatch({ type: 'LOADING_END' });
      }
    }
  }, []); // 依存関係を空にして安定化

  // デバウンス付きAPI呼び出し
  const debouncedFetch = useMemo(() => {
    try {
      return debounce(fetchSuggestion, 300);
    } catch (error) {
      console.error('Error creating debounced fetch:', error);
      return fetchSuggestion;
    }
  }, [fetchSuggestion]);

  return { state, dispatch, debouncedFetch };
};