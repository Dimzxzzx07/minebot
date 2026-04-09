import { EventEmitter } from 'events';
import { BotOptions } from '../types/BotOptions';
import { Logger } from '../utils/Logger';

let mc: any;
const loadMcProtocol = async () => {
  if (!mc) {
    mc = await import('minecraft-protocol');
  }
  return mc;
};

export class ConnectionManager extends EventEmitter {
  private client: any = null;
  private options: BotOptions;
  private logger: Logger;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;

  constructor(options: BotOptions) {
    super();
    this.options = options;
    this.logger = Logger.getInstance();
  }

  async connect(): Promise<void> {
    const mcProtocol = await loadMcProtocol();
    
    return new Promise((resolve, reject) => {
      const mcOptions: any = {
        host: this.options.target,
        port: this.options.port,
        username: this.options.auth.username,
        version: this.options.version,
        auth: this.options.auth.type === 'microsoft' ? 'microsoft' : 'offline'
      };

      if (this.options.auth.uuid) {
        mcOptions.uuid = this.options.auth.uuid;
      }

      this.logger.info(`Connecting to ${this.options.target}:${this.options.port} as ${this.options.auth.username}`);

      this.client = mcProtocol.createClient(mcOptions);

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, this.options.timeout);

      this.client.once('login', () => {
        clearTimeout(timeout);
        this.reconnectAttempts = 0;
        this.logger.info('Successfully connected to server');
        this.emit('connected');
        resolve();
      });

      this.client.once('error', (err: Error) => {
        clearTimeout(timeout);
        reject(err);
      });

      this.client.on('end', (reason: string) => {
        this.logger.warn(`Disconnected: ${reason}`);
        this.emit('disconnected', reason);
        
        if (this.options.behavior.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.handleReconnect();
        }
      });

      this.client.on('error', (err: Error) => {
        this.logger.error('Client error:', err.message);
        this.emit('error', err);
      });
    });
  }

  private handleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.options.behavior.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    this.logger.info(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(err => {
        this.logger.error(`Reconnect failed: ${err.message}`);
      });
    }, delay);
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  getClient(): any {
    return this.client;
  }

  isConnected(): boolean {
    return this.client !== null && this.client._connected;
  }

  writePacket(name: string, data: any): void {
    if (this.isConnected()) {
      this.client.write(name, data);
    }
  }
}