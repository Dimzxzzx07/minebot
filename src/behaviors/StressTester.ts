import { EventEmitter } from 'events';
import { BotClient } from '../client/BotClient';
import { BotOptions, AntiAFKConfig } from '../types/BotOptions';
import { Logger } from '../utils/Logger';

export class StressTester extends EventEmitter {
  private bots: BotClient[] = [];
  private logger: Logger;
  private isRunning: boolean = false;
  private keepAliveInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.logger = Logger.getInstance();
  }

  async launchBots(count: number, baseOptions: BotOptions): Promise<BotClient[]> {
    this.logger.info(`Launching ${count} bots for stress test`);
    
    const promises = [];
    
    for (let i = 0; i < count; i++) {
      const antiAFKConfig: AntiAFKConfig = {
        enabled: false,
        type: 'swing',
        interval: 10000
      };
      
      const botOptions: BotOptions = {
        ...baseOptions,
        auth: {
          ...baseOptions.auth,
          username: `${baseOptions.auth.username}_${i}`
        },
        stressMode: true,
        behavior: {
          ...baseOptions.behavior,
          antiAFK: antiAFKConfig
        }
      };
      
      const bot = new BotClient(botOptions);
      this.bots.push(bot);
      promises.push(bot.connect());
      await this.sleep(100);
    }
    
    try {
      await Promise.all(promises);
      this.logger.info(`Successfully launched ${this.bots.filter(b => b.isConnected()).length} bots`);
      this.startKeepAliveFlood();
      return this.bots;
    } catch (error) {
      this.logger.error(`Failed to launch all bots: ${error}`);
      return this.bots;
    }
  }

  private startKeepAliveFlood(): void {
    if (this.keepAliveInterval) return;
    
    this.keepAliveInterval = setInterval(() => {
      this.bots.forEach(bot => {
        if (bot.isConnected()) {
          bot.sendKeepAlive();
        }
      });
    }, 1000);
  }

  stopStressTest(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    
    this.bots.forEach(bot => bot.disconnect());
    this.bots = [];
    this.isRunning = false;
    this.logger.info('Stress test stopped');
  }

  getActiveBotCount(): number {
    return this.bots.filter(b => b.isConnected()).length;
  }

  getTotalPacketsSent(): number {
    return this.bots.reduce((total, bot) => total + bot.getPacketStats().sent, 0);
  }

  getTotalPacketsReceived(): number {
    return this.bots.reduce((total, bot) => total + bot.getPacketStats().received, 0);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}