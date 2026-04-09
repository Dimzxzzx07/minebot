"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketSniffer = void 0;
const events_1 = require("events");
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs"));
class PacketSniffer extends events_1.EventEmitter {
    packetHandler;
    logger;
    isSniffing = false;
    packetLog = [];
    filterTypes = new Set();
    logFile = null;
    constructor(packetHandler) {
        super();
        this.packetHandler = packetHandler;
        this.logger = Logger_1.Logger.getInstance();
        this.registerPacketListener();
    }
    registerPacketListener() {
        this.packetHandler.on('packet_received', (packet) => {
            if (!this.isSniffing)
                return;
            if (this.filterTypes.size === 0 || this.filterTypes.has(packet.name)) {
                this.processPacket(packet);
            }
        });
    }
    processPacket(packet) {
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
    sanitizeData(packetName, data) {
        const sanitized = { ...data };
        if (packetName === 'chat_message') {
            return sanitized;
        }
        return sanitized;
    }
    startSniffing(filter) {
        this.isSniffing = true;
        if (filter) {
            this.filterTypes = new Set(filter);
        }
        this.logger.info(`Packet sniffing started${filter ? ` with filter: ${filter.join(', ')}` : ''}`);
    }
    stopSniffing() {
        this.isSniffing = false;
        this.logger.info('Packet sniffing stopped');
    }
    getPacketLog() {
        return [...this.packetLog];
    }
    clearLog() {
        this.packetLog = [];
    }
    enableFileLogging(filename) {
        this.logFile = filename;
    }
    saveToFile() {
        if (!this.logFile)
            return;
        const data = JSON.stringify(this.packetLog, null, 2);
        fs.writeFileSync(this.logFile, data);
        this.logger.info(`Saved ${this.packetLog.length} packets to ${this.logFile}`);
    }
    getPacketStats() {
        const stats = new Map();
        for (const packet of this.packetLog) {
            const count = stats.get(packet.name) || 0;
            stats.set(packet.name, count + 1);
        }
        return stats;
    }
}
exports.PacketSniffer = PacketSniffer;
//# sourceMappingURL=PacketSniffer.js.map