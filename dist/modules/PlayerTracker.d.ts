import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
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
export declare class PlayerTracker extends EventEmitter {
    private packetHandler;
    private logger;
    private trackedPlayers;
    private watchlist;
    constructor(packetHandler: PacketHandler);
    private registerListeners;
    private updatePlayer;
    addToWatchlist(identifier: string): void;
    removeFromWatchlist(identifier: string): void;
    getPlayer(uuid: string): TrackedPlayer | undefined;
    getAllPlayers(): TrackedPlayer[];
    getOnlinePlayers(): TrackedPlayer[];
    getPlayerCount(): number;
}
export {};
//# sourceMappingURL=PlayerTracker.d.ts.map