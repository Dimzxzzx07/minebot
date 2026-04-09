import { EventEmitter } from 'events';
import { ConnectionManager } from './ConnectionManager';
import { BotState, PacketStats, Vec3 } from '../types/StateTypes';
export declare class PacketHandler extends EventEmitter {
    private connection;
    private logger;
    private botState;
    private packetStats;
    private osintMode;
    constructor(connection: ConnectionManager, osintMode?: boolean);
    private registerHandlers;
    sendChat(message: string): void;
    sendPosition(position: Vec3, onGround?: boolean): void;
    sendLook(yaw: number, pitch: number, onGround?: boolean): void;
    sendArmAnimation(hand?: number): void;
    getAverageLatency(): number;
    getPacketStats(): PacketStats;
    getBotState(): BotState;
}
//# sourceMappingURL=PacketHandler.d.ts.map