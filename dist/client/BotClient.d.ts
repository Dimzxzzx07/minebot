import { EventEmitter } from 'events';
import { BotOptions } from '../types/BotOptions';
import { BotState, PacketStats, Vec3 } from '../types/StateTypes';
import { PacketSniffer } from '../modules/PacketSniffer';
import { PlayerTracker } from '../modules/PlayerTracker';
export declare class BotClient extends EventEmitter {
    private options;
    private connection;
    private packetHandler;
    private antiAFK?;
    private chatResponder?;
    private packetSniffer?;
    private playerTracker?;
    private logger;
    constructor(options: BotOptions);
    private setupEventHandlers;
    private initializeModules;
    connect(): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    sendChat(message: string): void;
    moveTo(x: number, y: number, z: number): void;
    lookAt(yaw: number, pitch: number): void;
    swingArm(): void;
    getPosition(): Vec3;
    getHealth(): number;
    getPacketStats(): PacketStats;
    getBotState(): BotState;
    sendKeepAlive(): void;
    getPlayerTracker(): PlayerTracker | undefined;
    getPacketSniffer(): PacketSniffer | undefined;
}
//# sourceMappingURL=BotClient.d.ts.map