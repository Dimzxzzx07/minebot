import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
import { ChatResponseConfig } from '../types/BotOptions';
import { Logger } from '../utils/Logger';

export class ChatResponder extends EventEmitter {
  private packetHandler: PacketHandler;
  private config: ChatResponseConfig;
  private logger: Logger;
  private customResponses: Map<string, string | (() => string)>;

  constructor(packetHandler: PacketHandler, config: ChatResponseConfig) {
    super();
    this.packetHandler = packetHandler;
    this.config = config;
    this.logger = Logger.getInstance();
    this.customResponses = new Map();
    
    this.setupDefaultResponses();
    this.registerChatListener();
  }

  private setupDefaultResponses(): void {
    this.customResponses.set('hello', 'Hello there!');
    this.customResponses.set('hi', 'Hi! How are you?');
    this.customResponses.set('lag', 'Checking server performance...');
    this.customResponses.set('tps', this.getServerStatus.bind(this));
    this.customResponses.set('where', this.getPosition.bind(this));
    this.customResponses.set('ping', this.getPing.bind(this));
    this.customResponses.set('help', this.getHelp.bind(this));
  }

  private registerChatListener(): void {
    this.packetHandler.on('chat', (message: string) => {
      if (!this.config.enabled) return;
      const isAllowed = this.config.allowlist.some(name => message.includes(name));
      const hasPrefix = message.startsWith(this.config.prefix);
      
      if (isAllowed || hasPrefix) {
        this.processCommand(message);
      }
    });
  }

  private processCommand(message: string): void {
    const cleanMessage = message.replace(this.config.prefix, '').toLowerCase().trim();
    
    for (const [keyword, response] of this.customResponses) {
      if (cleanMessage.includes(keyword)) {
        let reply: string;
        
        if (typeof response === 'function') {
          reply = response();
        } else {
          reply = response;
        }
        
        setTimeout(() => {
          this.packetHandler.sendChat(reply);
          this.emit('command_executed', { keyword, response: reply });
        }, 500);
        
        break;
      }
    }
  }

  private getServerStatus(): string {
    const stats = this.packetHandler.getPacketStats();
    const avgLatency = this.packetHandler.getAverageLatency();
    return `Server latency: ${Math.round(avgLatency)}ms | Packets: ${stats.received}`;
  }

  private getPosition(): string {
    const state = this.packetHandler.getBotState();
    return `I'm at X:${Math.floor(state.position.x)} Y:${Math.floor(state.position.y)} Z:${Math.floor(state.position.z)}`;
  }

  private getPing(): string {
    const latency = this.packetHandler.getAverageLatency();
    return `My ping is ${Math.round(latency)}ms`;
  }

  private getHelp(): string {
    return 'Available commands: hello, hi, lag, tps, where, ping, help';
  }

  addResponse(keyword: string, response: string | (() => string)): void {
    this.customResponses.set(keyword.toLowerCase(), response);
  }

  removeResponse(keyword: string): void {
    this.customResponses.delete(keyword.toLowerCase());
  }

  updateConfig(newConfig: Partial<ChatResponseConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}