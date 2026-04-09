import { EventEmitter } from 'events';
import { ConnectionManager } from './ConnectionManager';
import { Logger } from '../utils/Logger';
import { BotState, PacketStats, Vec3 } from '../types/StateTypes';
import { SpawnEntityPacket, SpawnPlayerPacket, ChatMessagePacket } from '../types/PacketTypes';

export class PacketHandler extends EventEmitter {
  private connection: ConnectionManager;
  private logger: Logger;
  private botState: BotState;
  private packetStats: PacketStats;
  private osintMode: boolean;

  constructor(connection: ConnectionManager, osintMode: boolean = false) {
    super();
    this.connection = connection;
    this.logger = Logger.getInstance();
    this.osintMode = osintMode;
    
    this.botState = {
      position: { x: 0, y: 64, z: 0 },
      yaw: 0,
      pitch: 0,
      health: 20,
      food: 20,
      inventory: [],
      entities: new Map(),
      players: new Map(),
      isConnected: false,
      lastPingTime: 0
    };
    
    this.packetStats = {
      sent: 0,
      received: 0,
      latency: [],
      packetTypes: new Map(),
      bytesReceived: 0,
      bytesSent: 0
    };
    
    this.registerHandlers();
  }

  private registerHandlers(): void {
    const client = this.connection.getClient();
    if (!client) return;

    client.on('position', (packet: any) => {
      this.botState.position = { x: packet.x, y: packet.y, z: packet.z };
      this.botState.yaw = packet.yaw;
      this.botState.pitch = packet.pitch;
      this.emit('position_update', this.botState.position);
    });

    client.on('health', (packet: any) => {
      this.botState.health = packet.health;
      this.botState.food = packet.food;
      this.emit('health_update', this.botState);
    });

    client.on('spawn_entity', (packet: SpawnEntityPacket) => {
      const pos = { x: packet.x / 32, y: packet.y / 32, z: packet.z / 32 };
      this.botState.entities.set(packet.entityId, {
        id: packet.entityId,
        type: 'entity',
        position: pos,
        spawnTime: Date.now()
      });
      
      if (this.osintMode) {
        this.logger.osint(`Entity spawned: ID ${packet.entityId}, Type ${packet.type} at ${pos.x}, ${pos.y}, ${pos.z}`);
      }
      
      this.emit('entity_spawn', { ...packet, position: pos });
    });

    client.on('spawn_player', (packet: SpawnPlayerPacket) => {
      const pos = { x: packet.x / 32, y: packet.y / 32, z: packet.z / 32 };
      this.botState.entities.set(packet.entityId, {
        id: packet.entityId,
        type: 'player',
        position: pos,
        spawnTime: Date.now()
      });
      
      if (this.osintMode) {
        this.logger.osint(`Player spawned: ${packet.playerUUID} at ${pos.x}, ${pos.y}, ${pos.z}`);
      }
      
      this.emit('player_spawn', { ...packet, position: pos });
    });

    client.on('chat', (packet: ChatMessagePacket) => {
      this.emit('chat', packet.message);
    });

    client.on('keep_alive', (packet: any) => {
      const latency = Date.now() - this.botState.lastPingTime;
      this.packetStats.latency.push(latency);
      
      if (this.packetStats.latency.length > 100) {
        this.packetStats.latency.shift();
      }
      
      this.emit('latency_update', this.getAverageLatency());
    });

    client.on('window_items', (packet: any) => {
      this.botState.inventory = packet.items;
      this.emit('inventory_update', packet.items);
    });

    client.on('packet', (data: any, meta: any) => {
      this.packetStats.received++;
      this.packetStats.bytesReceived += meta.size || 0;
      
      const count = this.packetStats.packetTypes.get(meta.name) || 0;
      this.packetStats.packetTypes.set(meta.name, count + 1);
      
      this.emit('packet_received', { name: meta.name, data, size: meta.size });
    });
  }

  sendChat(message: string): void {
    this.connection.writePacket('chat', { message });
    this.packetStats.sent++;
  }

  sendPosition(position: Vec3, onGround: boolean = true): void {
    this.connection.writePacket('position', {
      x: position.x,
      y: position.y,
      z: position.z,
      onGround
    });
    this.packetStats.sent++;
  }

  sendLook(yaw: number, pitch: number, onGround: boolean = true): void {
    this.connection.writePacket('look', { yaw, pitch, onGround });
    this.packetStats.sent++;
  }

  sendArmAnimation(hand: number = 0): void {
    this.connection.writePacket('arm_animation', { hand });
    this.packetStats.sent++;
  }

  getAverageLatency(): number {
    if (this.packetStats.latency.length === 0) return 0;
    const sum = this.packetStats.latency.reduce((a, b) => a + b, 0);
    return sum / this.packetStats.latency.length;
  }

  getPacketStats(): PacketStats {
    return { ...this.packetStats };
  }

  getBotState(): BotState {
    return { ...this.botState };
  }
}