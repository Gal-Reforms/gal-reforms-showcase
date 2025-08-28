/**
 * Custom hook for handling async operations with loading, error, and success states
 * Provides a clean interface for managing async operations in React components
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ErrorHandler, AppError } from '@/lib/errors';

/**
 * State interface for async operations
 */
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Options for useAsync hook
 */
interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

/**
 * Custom hook for handling async operations
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { onSuccess, onError, immediate = false } = options;
  const mountedRef = useRef(true);

  // Track if component is mounted to prevent state updates after unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Execute the async function
   */
  const execute = useCallback(
    async (...args: any[]) => {
      if (!mountedRef.current) return;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFunction(...args);
        
        if (!mountedRef.current) return;

        setState({
          data: result,
          loading: false,
          error: null,
        });

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (error) {
        if (!mountedRef.current) return;

        const errorInstance = error instanceof Error ? error : new Error(String(error));
        
        setState({
          data: null,
          loading: false,
          error: errorInstance,
        });

        if (onError) {
          onError(errorInstance);
        } else {
          ErrorHandler.handle(errorInstance);
        }

        throw errorInstance;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  /**
   * Reset the state
   */
  const reset = useCallback(() => {
    if (!mountedRef.current) return;
    
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Execute immediately if requested
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling API calls with retry logic
 */
export function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions & { retries?: number; retryDelay?: number } = {}
) {
  const { retries = 2, retryDelay = 1000, ...asyncOptions } = options;

  const wrappedFunction = useCallback(
    async (...args: any[]) => {
      let lastError: Error;
      
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await apiFunction(...args);
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
            console.log(`Retrying API call (attempt ${attempt + 2}/${retries + 1})`);
          }
        }
      }
      
      throw lastError!;
    },
    [apiFunction, retries, retryDelay]
  );

  return useAsync(wrappedFunction, asyncOptions);
}

/**
 * Hook for handling form submissions
 */
export function useFormSubmit<T = any>(
  submitFunction: (data: any) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const asyncState = useAsync(submitFunction, options);

  const submit = useCallback(
    async (data: any) => {
      try {
        return await asyncState.execute(data);
      } catch (error) {
        // Error is already handled by useAsync
        return null;
      }
    },
    [asyncState.execute]
  );

  return {
    ...asyncState,
    submit,
  };
}

/**
 * Hook for managing multiple async operations
 */
export function useAsyncQueue() {
  const [queue, setQueue] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, Error>>({});
  
  const addToQueue = useCallback((id: string) => {
    setQueue(prev => [...prev, id]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item !== id));
  }, []);

  const setResult = useCallback((id: string, result: any) => {
    setResults(prev => ({ ...prev, [id]: result }));
    removeFromQueue(id);
  }, [removeFromQueue]);

  const setError = useCallback((id: string, error: Error) => {
    setErrors(prev => ({ ...prev, [id]: error }));
    removeFromQueue(id);
  }, [removeFromQueue]);

  const execute = useCallback(
    async <T>(id: string, asyncFunction: () => Promise<T>) => {
      addToQueue(id);
      
      try {
        const result = await asyncFunction();
        setResult(id, result);
        return result;
      } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error(String(error));
        setError(id, errorInstance);
        throw errorInstance;
      }
    },
    [addToQueue, setResult, setError]
  );

  const clear = useCallback(() => {
    setQueue([]);
    setResults({});
    setErrors({});
  }, []);

  return {
    queue,
    results,
    errors,
    isLoading: queue.length > 0,
    execute,
    clear,
  };
}