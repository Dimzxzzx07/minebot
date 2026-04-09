import { EventEmitter } from 'events';
import { BotOptions } from '../types/BotOptions';
import { BotState, PacketStats, Vec3 } from '../types/StateTypes';
import { ConnectionManager } from './ConnectionManager';
import { PacketHandler } from './PacketHandler';
import { AntiAFK } from '../behaviors/AntiAFK';
import { ChatResponder } from '../behaviors/ChatResponder';
import { PacketSniffer } from '../modules/PacketSniffer';
import { PlayerTracker } from '../modules/PlayerTracker';
import { Logger } from '../utils/Logger';
import { Vector3 } from '../utils/Vec3';

export class BotClient extends EventEmitter {
  private options: BotOptions;
  private connection: ConnectionManager;
  private packetHandler: PacketHandler;
  private antiAFK?: AntiAFK;
  private chatResponder?: ChatResponder;
  private packetSniffer?: PacketSniffer;
  private playerTracker?: PlayerTracker;
  private logger: Logger;

  constructor(options: BotOptions) {
    super();
    this.options = options;
    this.logger = Logger.getInstance();
    
    this.connection = new ConnectionManager(options);
    this.packetHandler = new PacketHandler(this.connection, options.osintMode);
    
    this.setupEventHandlers();
    this.initializeModules();
  }

  private setupEventHandlers(): void {
    this.connection.on('connected', () => {
      this.logger.info('Bot connected successfully');
      this.emit('ready');
    });
    
    this.connection.on('disconnected', (reason) => {
      this.logger.warn(`Bot disconnected: ${reason}`);
      this.emit('disconnect', reason);
    });
    
    this.connection.on('error', (err) => {
      this.logger.error(`Connection error: ${err.message}`);
      this.emit('error', err);
    });
    
    this.packetHandler.on('chat', (message) => {
      this.emit('chat', message);
    });
    
    this.packetHandler.on('position_update', (position) => {
      this.emit('position', position);
    });
  }

  private initializeModules(): void {
    if (this.options.behavior.antiAFK.enabled) {
      this.antiAFK = new AntiAFK(this.packetHandler, this.options.behavior.antiAFK);
      this.antiAFK.start();
    }
    
    if (this.options.behavior.chatResponse.enabled) {
      this.chatResponder = new ChatResponder(this.packetHandler, this.options.behavior.chatResponse);
    }
    
    if (this.options.osintMode) {
      this.packetSniffer = new PacketSniffer(this.packetHandler);
      this.packetSniffer.startSniffing();
      
      this.playerTracker = new PlayerTracker(this.packetHandler);
    }
  }

  async connect(): Promise<void> {
    await this.connection.connect();
  }

  disconnect(): void {
    if (this.antiAFK) this.antiAFK.stop();
    this.connection.disconnect();
  }

  isConnected(): boolean {
    return this.connection.isConnected();
  }

  sendChat(message: string): void {
    this.packetHandler.sendChat(message);
  }

  moveTo(x: number, y: number, z: number): void {
    this.packetHandler.sendPosition({ x, y, z });
  }

  lookAt(yaw: number, pitch: number): void {
    this.packetHandler.sendLook(yaw, pitch);
  }

  swingArm(): void {
    this.packetHandler.sendArmAnimation(0);
  }

  getPosition(): Vec3 {
    return this.packetHandler.getBotState().position;
  }

  getHealth(): number {
    return this.packetHandler.getBotState().health;
  }

  getPacketStats(): PacketStats {
    return this.packetHandler.getPacketStats();
  }

  getBotState(): BotState {
    return this.packetHandler.getBotState();
  }

  sendKeepAlive(): void {
    this.connection.writePacket('keep_alive', { keepAliveId: Date.now() });
  }

  getPlayerTracker(): PlayerTracker | undefined {
    return this.playerTracker;
  }

  getPacketSniffer(): PacketSniffer | undefined {
    return this.packetSniffer;
  }
}