export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OSINT = 4
}

export class Logger {
  private static instance: Logger;
  private level: LogLevel = LogLevel.INFO;
  private logFile: string | null = null;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  enableFileLogging(filename: string): void {
    this.logFile = filename;
  }

  debug(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`\x1b[36mdebug\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`\x1b[32minfo\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.log(`\x1b[33mwarn\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`\x1b[31merror]\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  osint(message: string, data?: any): void {
    if (this.level <= LogLevel.OSINT) {
      console.log(`\x1b[35mosin\x1b[0m ${new Date().toISOString()} - ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }
}