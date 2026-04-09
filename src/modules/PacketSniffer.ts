import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';

export class PacketSniffer extends EventEmitter {
  private packetHandler: PacketHandler;
  private logger: Logger;
  private isSniffing: boolean = false;
  private packetLog: any[] = [];
  private filterTypes: Set<string> = new Set();
  private logFile: string | null = null;

  constructor(packetHandler: PacketHandler) {
    super();
    this.packetHandler = packetHandler;
    this.logger = Logger.getInstance();
    this.registerPacketListener();
  }

  private registerPacketListener(): void {
    this.packetHandler.on('packet_received', (packet: any) => {
      if (!this.isSniffing) return;
      
      if (this.filterTypes.size === 0 || this.filterTypes.has(packet.name)) {
        this.processPacket(packet);
      }
    });
  }

  private processPacket(packet: any): void {
    const packetData = {
      name: packet.name,
      timestamp: Date.now(),
      data: this.sanitizeData(packet.name, packet.data),
      size: packet.size
    };
    
    this.packetLog.push(packetData);
    if (packet.name === 'spawn_player' || packet.name === 'spawn_entity') {
      this.logger.osint(`packet ${packet.name}`, packet.data);
    }
    
    this.emit('packet_captured', packetData);
    if (this.logFile && this.packetLog.length % 100 === 0) {
      this.saveToFile();
    }
  }

  private sanitizeData(packetName: string, data: any): any {
    const sanitized = { ...data };
    
    if (packetName === 'chat_message') {
      return sanitized;
    }
    
    return sanitized;
  }

  startSniffing(filter?: string[]): void {
    this.isSniffing = true;
    if (filter) {
      this.filterTypes = new Set(filter);
    }
    this.logger.info(`Packet sniffing started${filter ? ` with filter: ${filter.join(', ')}` : ''}`);
  }

  stopSniffing(): void {
    this.isSniffing = false;
    this.logger.info('Packet sniffing stopped');
  }

  getPacketLog(): any[] {
    return [...this.packetLog];
  }

  clearLog(): void {
    this.packetLog = [];
  }

  enableFileLogging(filename: string): void {
    this.logFile = filename;
  }

  saveToFile(): void {
    if (!this.logFile) return;
    
    const data = JSON.stringify(this.packetLog, null, 2);
    fs.writeFileSync(this.logFile, data);
    this.logger.info(`Saved ${this.packetLog.length} packets to ${this.logFile}`);
  }

  getPacketStats(): Map<string, number> {
    const stats = new Map<string, number>();
    
    for (const packet of this.packetLog) {
      const count = stats.get(packet.name) || 0;
      stats.set(packet.name, count + 1);
    }
    
    return stats;
  }
}