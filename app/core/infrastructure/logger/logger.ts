/**
 * Logger para el frontend
 * Proporciona logs con niveles y colores en consola
 */

type LogLevel = 'info' | 'success' | 'warning' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(level: LogLevel, message: string, data?: unknown): void {
    const styles: Record<LogLevel, string> = {
      info: 'color: #0284c7; font-weight: bold;',
      success: 'color: #16a34a; font-weight: bold;',
      warning: 'color: #ca8a04; font-weight: bold;',
      error: 'color: #dc2626; font-weight: bold;',
    };

    const prefix = `[${this.getTimestamp()}] [${level.toUpperCase()}]`;

    if (data) {
      console.log(`%c${prefix} ${message}`, styles[level], data);
    } else {
      console.log(`%c${prefix} ${message}`, styles[level]);
    }
  }

  static info(message: string, data?: unknown): void {
    this.formatMessage('info', message, data);
  }

  static success(message: string, data?: unknown): void {
    this.formatMessage('success', message, data);
  }

  static warning(message: string, data?: unknown): void {
    this.formatMessage('warning', message, data);
  }

  static error(message: string, data?: unknown): void {
    this.formatMessage('error', message, data);
  }

  private static logs: LogEntry[] = [];
  private static maxLogs = 100;

  static addLog(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: this.getTimestamp(),
      data,
    };
    
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger;
