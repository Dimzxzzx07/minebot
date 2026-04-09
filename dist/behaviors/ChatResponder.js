"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatResponder = void 0;
const events_1 = require("events");
const Logger_1 = require("../utils/Logger");
class ChatResponder extends events_1.EventEmitter {
    packetHandler;
    config;
    logger;
    customResponses;
    constructor(packetHandler, config) {
        super();
        this.packetHandler = packetHandler;
        this.config = config;
        this.logger = Logger_1.Logger.getInstance();
        this.customResponses = new Map();
        this.setupDefaultResponses();
        this.registerChatListener();
    }
    setupDefaultResponses() {
        this.customResponses.set('hello', 'Hello there!');
        this.customResponses.set('hi', 'Hi! How are you?');
        this.customResponses.set('lag', 'Checking server performance...');
        this.customResponses.set('tps', this.getServerStatus.bind(this));
        this.customResponses.set('where', this.getPosition.bind(this));
        this.customResponses.set('ping', this.getPing.bind(this));
        this.customResponses.set('help', this.getHelp.bind(this));
    }
    registerChatListener() {
        this.packetHandler.on('chat', (message) => {
            if (!this.config.enabled)
                return;
            const isAllowed = this.config.allowlist.some(name => message.includes(name));
            const hasPrefix = message.startsWith(this.config.prefix);
            if (isAllowed || hasPrefix) {
                this.processCommand(message);
            }
        });
    }
    processCommand(message) {
        const cleanMessage = message.replace(this.config.prefix, '').toLowerCase().trim();
        for (const [keyword, response] of this.customResponses) {
            if (cleanMessage.includes(keyword)) {
                let reply;
                if (typeof response === 'function') {
                    reply = response();
                }
                else {
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
    getServerStatus() {
        const stats = this.packetHandler.getPacketStats();
        const avgLatency = this.packetHandler.getAverageLatency();
        return `Server latency: ${Math.round(avgLatency)}ms | Packets: ${stats.received}`;
    }
    getPosition() {
        const state = this.packetHandler.getBotState();
        return `I'm at X:${Math.floor(state.position.x)} Y:${Math.floor(state.position.y)} Z:${Math.floor(state.position.z)}`;
    }
    getPing() {
        const latency = this.packetHandler.getAverageLatency();
        return `My ping is ${Math.round(latency)}ms`;
    }
    getHelp() {
        return 'Available commands: hello, hi, lag, tps, where, ping, help';
    }
    addResponse(keyword, response) {
        this.customResponses.set(keyword.toLowerCase(), response);
    }
    removeResponse(keyword) {
        this.customResponses.delete(keyword.toLowerCase());
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
exports.ChatResponder = ChatResponder;
//# sourceMappingURL=ChatResponder.js.map