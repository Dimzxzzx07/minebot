import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
export declare class PacketSniffer extends EventEmitter {
    private packetHandler;
    private logger;
    private isSniffing;
    private packetLog;
    private filterTypes;
    private logFile;
    constructor(packetHandler: PacketHandler);
    private registerPacketListener;
    private processPacket;
    private sanitizeData;
    startSniffing(filter?: string[]): void;
    stopSniffing(): void;
    getPacketLog(): any[];
    clearLog(): void;
    enableFileLogging(filename: string): void;
    saveToFile(): void;
    getPacketStats(): Map<string, number>;
}
//# sourceMappingURL=PacketSniffer.d.ts.map