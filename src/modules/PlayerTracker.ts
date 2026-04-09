import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
import { Logger } from '../utils/Logger';
import { Vector3 } from '../utils/Vec3';

interface TrackedPlayer {
  username: string;
  uuid: string;
  firstSeen: number;
  lastSeen: number;
  position?: Vector3;
  ping: number;
  gameMode: number;
}

export class PlayerTracker extends EventEmitter {
  private packetHandler: PacketHandler;
  private logger: Logger;
  private trackedPlayers: Map<string, TrackedPlayer> = new Map();
  private watchlist: Set<string> = new Set();

  constructor(packetHandler: PacketHandler) {
    super();
    this.packetHandler = packetHandler;
    this.logger = Logger.getInstance();
    this.registerListeners();
  }

  private registerListeners(): void {
    this.packetHandler.on('player_spawn', (data: any) => {
      this.updatePlayer(data.playerUUID, {
        username: data.playerUUID,
        uuid: data.playerUUID,
        position: data.position,
        lastSeen: Date.now()
      });
    });
    
    this.packetHandler.on('entity_spawn', (data: any) => {
    });
  }

  private updatePlayer(uuid: string, data: Partial<TrackedPlayer>): void {
    const existing = this.trackedPlayers.get(uuid);
    
    if (existing) {
      Object.assign(existing, data);
      existing.lastSeen = Date.now();
    } else {
      this.trackedPlayers.set(uuid, {
        username: data.username || uuid,
        uuid: uuid,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        position: data.position,
        ping: data.ping || 0,
        gameMode: data.gameMode || 0
      });
    }
    
    const player = this.trackedPlayers.get(uuid)!;
    if (this.watchlist.has(player.username) || this.watchlist.has(uuid)) {
      this.emit('watchlist_player_seen', player);
      this.logger.osint(`Watchlist player detected: ${player.username}`);
    }
    
    this.emit('player_updated', player);
  }

  addToWatchlist(identifier: string): void {
    this.watchlist.add(identifier);
    this.logger.info(`Added ${identifier} to watchlist`);
  }

  removeFromWatchlist(identifier: string): void {
    this.watchlist.delete(identifier);
  }

  getPlayer(uuid: string): TrackedPlayer | undefined {
    return this.trackedPlayers.get(uuid);
  }

  getAllPlayers(): TrackedPlayer[] {
    return Array.from(this.trackedPlayers.values());
  }

  getOnlinePlayers(): TrackedPlayer[] {
    const now = Date.now();
    return this.getAllPlayers().filter(p => now - p.lastSeen < 30000);
  }

  getPlayerCount(): number {
    return this.getOnlinePlayers().length;
  }
}