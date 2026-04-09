import { BotClient } from './client/BotClient';
import { BotOptions } from './types/BotOptions';
import { LogLevel } from './utils/Logger';
export { BotClient };
export * from './types/BotOptions';
export * from './types/StateTypes';
export * from './behaviors/AntiAFK';
export * from './behaviors/ChatResponder';
export * from './behaviors/StressTester';
export * from './modules/PacketSniffer';
export * from './modules/PlayerTracker';
export * from './utils/Logger';
export declare function createBot(options: BotOptions): Promise<BotClient>;
export declare function setLogLevel(level: LogLevel): void;
declare const _default: {
    BotClient: typeof BotClient;
    createBot: typeof createBot;
    setLogLevel: typeof setLogLevel;
    LogLevel: typeof LogLevel;
};
export default _default;
//# sourceMappingURL=index.d.ts.map