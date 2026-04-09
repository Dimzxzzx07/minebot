import { EventEmitter } from 'events';
import { BotOptions } from '../types/BotOptions';
export declare class ConnectionManager extends EventEmitter {
    private client;
    private options;
    private logger;
    private reconnectAttempts;
    private maxReconnectAttempts;
    constructor(options: BotOptions);
    connect(): Promise<void>;
    private handleReconnect;
    disconnect(): void;
    getClient(): any;
    isConnected(): boolean;
    writePacket(name: string, data: any): void;
}
//# sourceMappingURL=ConnectionManager.d.ts.map