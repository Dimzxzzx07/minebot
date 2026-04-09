import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
import { AntiAFKConfig } from '../types/BotOptions';
export declare class AntiAFK extends EventEmitter {
    private packetHandler;
    private config;
    private logger;
    private interval;
    private isRunning;
    constructor(packetHandler: PacketHandler, config: AntiAFKConfig);
    start(): void;
    stop(): void;
    private performAction;
    updateConfig(newConfig: Partial<AntiAFKConfig>): void;
}
//# sourceMappingURL=AntiAFK.d.ts.map