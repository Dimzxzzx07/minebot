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
exports.ConnectionManager = void 0;
const events_1 = require("events");
const Logger_1 = require("../utils/Logger");
let mc;
const loadMcProtocol = async () => {
    if (!mc) {
        mc = await Promise.resolve().then(() => __importStar(require('minecraft-protocol')));
    }
    return mc;
};
class ConnectionManager extends events_1.EventEmitter {
    client = null;
    options;
    logger;
    reconnectAttempts = 0;
    maxReconnectAttempts = 10;
    constructor(options) {
        super();
        this.options = options;
        this.logger = Logger_1.Logger.getInstance();
    }
    async connect() {
        const mcProtocol = await loadMcProtocol();
        return new Promise((resolve, reject) => {
            const mcOptions = {
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
            this.client.once('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
            this.client.on('end', (reason) => {
                this.logger.warn(`Disconnected: ${reason}`);
                this.emit('disconnected', reason);
                if (this.options.behavior.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.handleReconnect();
                }
            });
            this.client.on('error', (err) => {
                this.logger.error('Client error:', err.message);
                this.emit('error', err);
            });
        });
    }
    handleReconnect() {
        this.reconnectAttempts++;
        const delay = this.options.behavior.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
        this.logger.info(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => {
            this.connect().catch(err => {
                this.logger.error(`Reconnect failed: ${err.message}`);
            });
        }, delay);
    }
    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
        }
    }
    getClient() {
        return this.client;
    }
    isConnected() {
        return this.client !== null && this.client._connected;
    }
    writePacket(name, data) {
        if (this.isConnected()) {
            this.client.write(name, data);
        }
    }
}
exports.ConnectionManager = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map