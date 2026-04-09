export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    OSINT = 4
}
export declare class Logger {
    private static instance;
    private level;
    private logFile;
    static getInstance(): Logger;
    setLevel(level: LogLevel): void;
    enableFileLogging(filename: string): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    osint(message: string, data?: any): void;
}
//# sourceMappingURL=Logger.d.ts.map