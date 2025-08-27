/**
 * Centralized logging utility
 * Provides consistent logging patterns across the application
 */

/**
 * Log levels for different types of messages
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log entry interface
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
}

/**
 * Centralized logger class
 */
class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableStorage: false,
      maxStorageEntries: 1000,
      ...config,
    };

    // Set development defaults
    if (process.env.NODE_ENV === 'development') {
      this.config.level = LogLevel.DEBUG;
      this.config.enableStorage = true;
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | Record<string, any>) {
    const context = error instanceof Error ? { error: error.message } : error;
    const stack = error instanceof Error ? error.stack : undefined;
    this.log(LogLevel.ERROR, message, context, stack);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, stack?: string) {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      stack,
    };

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Storage logging
    if (this.config.enableStorage) {
      this.logToStorage(entry);
    }
  }

  /**
   * Log to console with appropriate styling
   */
  private logToConsole(entry: LogEntry) {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] ${LogLevel[entry.level]}:`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`%c${prefix}`, 'color: #6B7280', entry.message, entry.context);
        break;
      case LogLevel.INFO:
        console.info(`%c${prefix}`, 'color: #3B82F6', entry.message, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(`%c${prefix}`, 'color: #F59E0B', entry.message, entry.context);
        break;
      case LogLevel.ERROR:
        console.error(`%c${prefix}`, 'color: #EF4444', entry.message, entry.context);
        if (entry.stack) {
          console.error(entry.stack);
        }
        break;
    }
  }

  /**
   * Log to local storage
   */
  private logToStorage(entry: LogEntry) {
    this.logs.push(entry);

    // Maintain max entries limit
    if (this.logs.length > this.config.maxStorageEntries) {
      this.logs = this.logs.slice(-this.config.maxStorageEntries);
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('app_logs', JSON.stringify(this.logs.slice(-100))); // Keep last 100 logs
    } catch (error) {
      // Handle localStorage quota exceeded
      console.warn('Could not save logs to localStorage:', error);
    }
  }

  /**
   * Get stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear stored logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('app_logs');
  }

  /**
   * Export logs as downloadable file
   */
  exportLogs(): string {
    const logText = this.logs
      .map(entry => {
        const timestamp = entry.timestamp.toISOString();
        const level = LogLevel[entry.level];
        const context = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
        const stack = entry.stack ? `\nStack: ${entry.stack}` : '';
        return `[${timestamp}] ${level}: ${entry.message}${context}${stack}`;
      })
      .join('\n');

    return logText;
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    const logText = this.exportLogs();
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `app-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Performance logging utilities
 */
export const PerformanceLogger = {
  /**
   * Start timing an operation
   */
  startTimer: (label: string) => {
    performance.mark(`${label}-start`);
    logger.debug(`Started timer: ${label}`);
  },

  /**
   * End timing an operation
   */
  endTimer: (label: string) => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    const duration = Math.round(measure.duration * 100) / 100;
    
    logger.info(`Timer ${label}: ${duration}ms`);
    
    // Clean up marks
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  },

  /**
   * Time a function execution
   */
  timeFunction: async <T>(label: string, fn: () => T | Promise<T>): Promise<T> => {
    PerformanceLogger.startTimer(label);
    try {
      const result = await fn();
      PerformanceLogger.endTimer(label);
      return result;
    } catch (error) {
      PerformanceLogger.endTimer(label);
      logger.error(`Function ${label} failed`, error);
      throw error;
    }
  },
};

/**
 * API logging utilities
 */
export const ApiLogger = {
  /**
   * Log API request
   */
  logRequest: (method: string, url: string, data?: any) => {
    logger.info(`API Request: ${method} ${url}`, { method, url, data });
  },

  /**
   * Log API response
   */
  logResponse: (method: string, url: string, status: number, data?: any) => {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API Response: ${method} ${url} - ${status}`;
    
    if (level === LogLevel.ERROR) {
      logger.error(message, { method, url, status, data });
    } else {
      logger.info(message, { method, url, status, data });
    }
  },

  /**
   * Log API error
   */
  logError: (method: string, url: string, error: Error) => {
    logger.error(`API Error: ${method} ${url}`, {
      method,
      url,
      error: error.message,
      stack: error.stack,
    });
  },
};