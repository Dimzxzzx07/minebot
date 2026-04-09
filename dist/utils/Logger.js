"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["OSINT"] = 4] = "OSINT";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    static instance;
    level = LogLevel.INFO;
    logFile = null;
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setLevel(level) {
        this.level = level;
    }
    enableFileLogging(filename) {
        this.logFile = filename;
    }
    debug(message, ...args) {
        if (this.level <= LogLevel.DEBUG) {
            console.log(`\x1b[36mdebug\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
    info(message, ...args) {
        if (this.level <= LogLevel.INFO) {
            console.log(`\x1b[32minfo\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
    warn(message, ...args) {
        if (this.level <= LogLevel.WARN) {
            console.log(`\x1b[33mwarn\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
    error(message, ...args) {
        if (this.level <= LogLevel.ERROR) {
            console.error(`\x1b[31merror]\x1b[0m ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
    osint(message, data) {
        if (this.level <= LogLevel.OSINT) {
            console.log(`\x1b[35mosin\x1b[0m ${new Date().toISOString()} - ${message}`);
            if (data) {
                console.log(JSON.stringify(data, null, 2));
            }
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map