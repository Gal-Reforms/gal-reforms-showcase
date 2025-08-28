/**
 * Custom hook for managing localStorage with React state synchronization
 * Provides type-safe localStorage operations with automatic serialization
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

/**
 * Options for useLocalStorage hook
 */
interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Hook for managing localStorage with React state
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
) {
  const {
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Get initial value from localStorage
  const getStoredValue = useCallback((): T | undefined => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return deserialize(item);
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}"`, error);
      return defaultValue;
    }
  }, [key, defaultValue, deserialize]);

  const [storedValue, setStoredValue] = useState<T | undefined>(getStoredValue);

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((val: T | undefined) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        if (valueToStore === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, serialize(valueToStore));
        }
        
        logger.debug(`Updated localStorage key "${key}"`, { value: valueToStore });
      } catch (error) {
        logger.error(`Error setting localStorage key "${key}"`, error);
      }
    },
    [key, storedValue, serialize]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(undefined);
      logger.debug(`Removed localStorage key "${key}"`);
    } catch (error) {
      logger.error(`Error removing localStorage key "${key}"`, error);
    }
  }, [key]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue);
          setStoredValue(newValue);
          logger.debug(`localStorage key "${key}" changed externally`, { newValue });
        } catch (error) {
          logger.error(`Error parsing external localStorage change for key "${key}"`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(undefined);
        logger.debug(`localStorage key "${key}" removed externally`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * Hook for managing user preferences in localStorage
 */
export function useUserPreferences<T extends Record<string, any>>(
  defaultPreferences: T
) {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    'user_preferences',
    { defaultValue: defaultPreferences }
  );

  const updatePreference = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPreferences(prev => ({
        ...defaultPreferences,
        ...prev,
        [key]: value,
      }));
    },
    [setPreferences, defaultPreferences]
  );

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences, defaultPreferences]);

  return {
    preferences: { ...defaultPreferences, ...preferences },
    updatePreference,
    resetPreferences,
    removePreferences,
  };
}

/**
 * Hook for managing form data in localStorage (useful for form persistence)
 */
export function usePersistedForm<T extends Record<string, any>>(
  formKey: string,
  initialValues: T
) {
  const [formData, setFormData, clearFormData] = useLocalStorage(
    `form_${formKey}`,
    { defaultValue: initialValues }
  );

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData(prev => ({
        ...initialValues,
        ...prev,
        [field]: value,
      }));
    },
    [setFormData, initialValues]
  );

  const updateFields = useCallback(
    (fields: Partial<T>) => {
      setFormData(prev => ({
        ...initialValues,
        ...prev,
        ...fields,
      }));
    },
    [setFormData, initialValues]
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
  }, [setFormData, initialValues]);

  return {
    formData: { ...initialValues, ...formData },
    updateField,
    updateFields,
    resetForm,
    clearFormData,
  };
}

/**
 * Hook for managing theme preferences
 */
export function useThemePreference() {
  const [theme, setTheme] = useLocalStorage('theme_preference', {
    defaultValue: 'system' as 'light' | 'dark' | 'system',
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      switch (prev) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        case 'system':
        default:
          return 'light';
      }
    });
  }, [setTheme]);

  const setLightTheme = useCallback(() => setTheme('light'), [setTheme]);
  const setDarkTheme = useCallback(() => setTheme('dark'), [setTheme]);
  const setSystemTheme = useCallback(() => setTheme('system'), [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };
}

/**
 * Hook for managing recently viewed items
 */
export function useRecentItems<T extends { id: string }>(
  key: string,
  maxItems = 10
) {
  const [recentItems, setRecentItems] = useLocalStorage<T[]>(key, {
    defaultValue: [],
  });

  const addRecentItem = useCallback(
    (item: T) => {
      setRecentItems(prev => {
        const filtered = (prev || []).filter(existing => existing.id !== item.id);
        const updated = [item, ...filtered].slice(0, maxItems);
        return updated;
      });
    },
    [setRecentItems, maxItems]
  );

  const removeRecentItem = useCallback(
    (id: string) => {
      setRecentItems(prev => (prev || []).filter(item => item.id !== id));
    },
    [setRecentItems]
  );

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
  }, [setRecentItems]);

  return {
    recentItems: recentItems || [],
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
  };
}