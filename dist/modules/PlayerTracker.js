"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerTracker = void 0;
const events_1 = require("events");
const Logger_1 = require("../utils/Logger");
class PlayerTracker extends events_1.EventEmitter {
    packetHandler;
    logger;
    trackedPlayers = new Map();
    watchlist = new Set();
    constructor(packetHandler) {
        super();
        this.packetHandler = packetHandler;
        this.logger = Logger_1.Logger.getInstance();
        this.registerListeners();
    }
    registerListeners() {
        this.packetHandler.on('player_spawn', (data) => {
            this.updatePlayer(data.playerUUID, {
                username: data.playerUUID,
                uuid: data.playerUUID,
                position: data.position,
                lastSeen: Date.now()
            });
        });
        this.packetHandler.on('entity_spawn', (data) => {
        });
    }
    updatePlayer(uuid, data) {
        const existing = this.trackedPlayers.get(uuid);
        if (existing) {
            Object.assign(existing, data);
            existing.lastSeen = Date.now();
        }
        else {
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
        const player = this.trackedPlayers.get(uuid);
        if (this.watchlist.has(player.username) || this.watchlist.has(uuid)) {
            this.emit('watchlist_player_seen', player);
            this.logger.osint(`Watchlist player detected: ${player.username}`);
        }
        this.emit('player_updated', player);
    }
    addToWatchlist(identifier) {
        this.watchlist.add(identifier);
        this.logger.info(`Added ${identifier} to watchlist`);
    }
    removeFromWatchlist(identifier) {
        this.watchlist.delete(identifier);
    }
    getPlayer(uuid) {
        return this.trackedPlayers.get(uuid);
    }
    getAllPlayers() {
        return Array.from(this.trackedPlayers.values());
    }
    getOnlinePlayers() {
        const now = Date.now();
        return this.getAllPlayers().filter(p => now - p.lastSeen < 30000);
    }
    getPlayerCount() {
        return this.getOnlinePlayers().length;
    }
}
exports.PlayerTracker = PlayerTracker;
//# sourceMappingURL=PlayerTracker.js.map