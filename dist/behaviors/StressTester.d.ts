import { EventEmitter } from 'events';
import { BotClient } from '../client/BotClient';
import { BotOptions } from '../types/BotOptions';
export declare class StressTester extends EventEmitter {
    private bots;
    private logger;
    private isRunning;
    private keepAliveInterval;
    constructor();
    launchBots(count: number, baseOptions: BotOptions): Promise<BotClient[]>;
    private startKeepAliveFlood;
    stopStressTest(): void;
    getActiveBotCount(): number;
    getTotalPacketsSent(): number;
    getTotalPacketsReceived(): number;
    private sleep;
}
//# sourceMappingURL=StressTester.d.ts.map