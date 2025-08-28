/**
 * Validation utilities and schemas
 * Provides consistent validation patterns across the application
 */

import React from 'react';
import { AppError, ErrorType } from './errors';

/**
 * Basic validation schema interface
 */
export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

/**
 * Validation rule type
 */
export type ValidationRule = {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
};

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Main validation class
 */
export class Validator {
  /**
   * Validates data against a schema
   */
  static validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(schema)) {
      const fieldErrors = this.validateField(data[field], rules, field);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  /**
   * Validates a single field against its rules
   */
  private static validateField(value: any, rules: ValidationRule[], fieldName: string): string[] {
    const errors: string[] = [];

    for (const rule of rules) {
      const error = this.validateRule(value, rule, fieldName);
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  /**
   * Validates a single rule
   */
  private static validateRule(value: any, rule: ValidationRule, fieldName: string): string | null {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;

      case 'email':
        if (value && !this.isValidEmail(value)) {
          return rule.message;
        }
        break;

      case 'phone':
        if (value && !this.isValidPhone(value)) {
          return rule.message;
        }
        break;

      case 'minLength':
        if (value && value.length < rule.value) {
          return rule.message;
        }
        break;

      case 'maxLength':
        if (value && value.length > rule.value) {
          return rule.message;
        }
        break;

      case 'pattern':
        if (value && !rule.value.test(value)) {
          return rule.message;
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          return rule.message;
        }
        break;
    }

    return null;
  }

  /**
   * Email validation regex
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation (Spanish format)
   */
  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
}

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  /**
   * Contact form validation schema
   */
  contactForm: {
    name: [
      { type: 'required' as const, message: 'Name is required' },
      { type: 'minLength' as const, value: 2, message: 'Name must be at least 2 characters' },
      { type: 'maxLength' as const, value: 50, message: 'Name cannot exceed 50 characters' }
    ],
    email: [
      { type: 'required' as const, message: 'Email is required' },
      { type: 'email' as const, message: 'Please enter a valid email address' }
    ],
    phone: [
      { type: 'phone' as const, message: 'Please enter a valid Spanish phone number' }
    ],
    subject: [
      { type: 'required' as const, message: 'Subject is required' },
      { type: 'minLength' as const, value: 5, message: 'Subject must be at least 5 characters' },
      { type: 'maxLength' as const, value: 100, message: 'Subject cannot exceed 100 characters' }
    ],
    message: [
      { type: 'required' as const, message: 'Message is required' },
      { type: 'minLength' as const, value: 10, message: 'Message must be at least 10 characters' },
      { type: 'maxLength' as const, value: 1000, message: 'Message cannot exceed 1000 characters' }
    ]
  },

  /**
   * Project form validation schema
   */
  projectForm: {
    title: [
      { type: 'required' as const, message: 'Project title is required' },
      { type: 'minLength' as const, value: 3, message: 'Title must be at least 3 characters' },
      { type: 'maxLength' as const, value: 100, message: 'Title cannot exceed 100 characters' }
    ],
    category: [
      { type: 'required' as const, message: 'Category is required' }
    ],
    description: [
      { type: 'maxLength' as const, value: 2000, message: 'Description cannot exceed 2000 characters' }
    ],
    location: [
      { type: 'maxLength' as const, value: 100, message: 'Location cannot exceed 100 characters' }
    ],
    area_sqm: [
      {
        type: 'custom' as const,
        message: 'Area must be a positive number',
        validator: (value: any) => !value || (Number(value) > 0)
      }
    ]
  },

  /**
   * Authentication validation schema
   */
  auth: {
    email: [
      { type: 'required' as const, message: 'Email is required' },
      { type: 'email' as const, message: 'Please enter a valid email address' }
    ],
    password: [
      { type: 'required' as const, message: 'Password is required' },
      { type: 'minLength' as const, value: 8, message: 'Password must be at least 8 characters' }
    ]
  }
};

/**
 * Validation hooks for React components
 */
export function useValidation(schema: ValidationSchema) {
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const validate = React.useCallback((data: Record<string, any>) => {
    const result = Validator.validate(data, schema);
    setErrors(result.errors);
    return result;
  }, [schema]);

  const clearErrors = React.useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = React.useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const hasError = React.useCallback((field: string) => {
    return errors[field] && errors[field].length > 0;
  }, [errors]);

  const getError = React.useCallback((field: string) => {
    return errors[field]?.[0] || '';
  }, [errors]);

  return {
    errors,
    validate,
    clearErrors,
    clearFieldError,
    hasError,
    getError
  };
}

/**
 * Sanitization utilities
 */
export const Sanitizer = {
  /**
   * Sanitizes HTML input to prevent XSS
   */
  sanitizeHtml: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Sanitizes user input for display
   */
  sanitizeText: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },

  /**
   * Sanitizes phone number
   */
  sanitizePhone: (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  },

  /**
   * Sanitizes email
   */
  sanitizeEmail: (email: string): string => {
    return email.toLowerCase().trim();
  }
};