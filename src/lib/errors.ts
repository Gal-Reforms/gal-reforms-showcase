/**
 * Centralized error handling utilities
 * Provides consistent error handling patterns across the application
 */

import { toast } from "@/hooks/use-toast";

/**
 * Standard error types used throughout the application
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.context = context;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error handling utility functions
 */
export const ErrorHandler = {
  /**
   * Handles errors with appropriate user feedback
   */
  handle: (error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    console.error('Error occurred:', error);
    
    let userMessage = fallbackMessage;
    let errorType = ErrorType.UNKNOWN;
    
    if (error instanceof AppError) {
      userMessage = error.message;
      errorType = error.type;
    } else if (error instanceof Error) {
      userMessage = error.message;
      
      // Classify common error patterns
      if (error.message.includes('fetch')) {
        errorType = ErrorType.NETWORK;
        userMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        errorType = ErrorType.AUTHENTICATION;
        userMessage = 'Please log in to continue.';
      } else if (error.message.includes('forbidden') || error.message.includes('Forbidden')) {
        errorType = ErrorType.AUTHORIZATION;
        userMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('not found') || error.message.includes('Not found')) {
        errorType = ErrorType.NOT_FOUND;
        userMessage = 'The requested resource was not found.';
      }
    }

    // Show appropriate toast notification
    toast({
      title: 'Error',
      description: userMessage,
      variant: 'destructive',
    });

    // In development, log additional context
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 Error Details');
      console.log('Type:', errorType);
      console.log('Message:', userMessage);
      console.log('Original error:', error);
      console.groupEnd();
    }

    return { error, type: errorType, message: userMessage };
  },

  /**
   * Wraps async functions with error handling
   */
  wrap: <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        ErrorHandler.handle(error);
        throw error;
      }
    }) as T;
  },

  /**
   * Creates a network error with retry information
   */
  createNetworkError: (message: string, retryAfter?: number) => {
    return new AppError(message, ErrorType.NETWORK, { retryAfter });
  },

  /**
   * Creates a validation error with field information
   */
  createValidationError: (message: string, field?: string) => {
    return new AppError(message, ErrorType.VALIDATION, { field });
  },

  /**
   * Safely parses error responses from APIs
   */
  parseApiError: (error: any) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
};

/**
 * Utility for handling form validation errors
 */
export const ValidationErrorHandler = {
  /**
   * Formats validation errors for display
   */
  formatErrors: (errors: Record<string, string[]>) => {
    return Object.entries(errors).map(([field, messages]) => ({
      field,
      message: messages.join(', ')
    }));
  },

  /**
   * Shows validation errors as toast notifications
   */
  showErrors: (errors: Record<string, string[]>) => {
    const formattedErrors = ValidationErrorHandler.formatErrors(errors);
    
    formattedErrors.forEach(({ field, message }) => {
      toast({
        title: `Validation Error: ${field}`,
        description: message,
        variant: 'destructive',
      });
    });
  }
};

/**
 * Retry utility for failed operations
 */
export const RetryHandler = {
  /**
   * Retries an async operation with exponential backoff
   */
  withRetry: async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> => {
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
      }
    }
    
    throw lastError;
  }
};