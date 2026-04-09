import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
import { AntiAFKConfig } from '../types/BotOptions';
import { Logger } from '../utils/Logger';
import { Vector3 } from '../utils/Vec3';

export class AntiAFK extends EventEmitter {
  private packetHandler: PacketHandler;
  private config: AntiAFKConfig;
  private logger: Logger;
  private interval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(packetHandler: PacketHandler, config: AntiAFKConfig) {
    super();
    this.packetHandler = packetHandler;
    this.config = config;
    this.logger = Logger.getInstance();
  }

  start(): void {
    if (!this.config.enabled || this.isRunning) return;

    this.isRunning = true;
    this.logger.info(`Anti-AFK started with type: ${this.config.type}`);
    
    this.interval = setInterval(() => {
      this.performAction();
    }, this.config.interval);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    this.logger.info('Anti-AFK stopped');
  }

  private performAction(): void {
    switch (this.config.type) {
      case 'swing':
        this.packetHandler.sendArmAnimation(0);
        break;
        
      case 'rotate':
        const randomYaw = Math.random() * Math.PI * 2;
        const randomPitch = (Math.random() - 0.5) * Math.PI / 2;
        this.packetHandler.sendLook(randomYaw, randomPitch);
        break;
        
      case 'walk':
        const state = this.packetHandler.getBotState();
        const randomX = state.position.x + (Math.random() - 0.5) * 2;
        const randomZ = state.position.z + (Math.random() - 0.5) * 2;
        this.packetHandler.sendPosition(new Vector3(randomX, state.position.y, randomZ));
        break;
    }
    
    this.emit('action_performed', this.config.type);
  }

  updateConfig(newConfig: Partial<AntiAFKConfig>): void {
    const wasRunning = this.isRunning;
    
    if (wasRunning) {
      this.stop();
    }
    
    this.config = { ...this.config, ...newConfig };
    
    if (wasRunning && this.config.enabled) {
      this.start();
    }
  }
}