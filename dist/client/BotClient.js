"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
const events_1 = require("events");
const ConnectionManager_1 = require("./ConnectionManager");
const PacketHandler_1 = require("./PacketHandler");
const AntiAFK_1 = require("../behaviors/AntiAFK");
const ChatResponder_1 = require("../behaviors/ChatResponder");
const PacketSniffer_1 = require("../modules/PacketSniffer");
const PlayerTracker_1 = require("../modules/PlayerTracker");
const Logger_1 = require("../utils/Logger");
class BotClient extends events_1.EventEmitter {
    options;
    connection;
    packetHandler;
    antiAFK;
    chatResponder;
    packetSniffer;
    playerTracker;
    logger;
    constructor(options) {
        super();
        this.options = options;
        this.logger = Logger_1.Logger.getInstance();
        this.connection = new ConnectionManager_1.ConnectionManager(options);
        this.packetHandler = new PacketHandler_1.PacketHandler(this.connection, options.osintMode);
        this.setupEventHandlers();
        this.initializeModules();
    }
    setupEventHandlers() {
        this.connection.on('connected', () => {
            this.logger.info('Bot connected successfully');
            this.emit('ready');
        });
        this.connection.on('disconnected', (reason) => {
            this.logger.warn(`Bot disconnected: ${reason}`);
            this.emit('disconnect', reason);
        });
        this.connection.on('error', (err) => {
            this.logger.error(`Connection error: ${err.message}`);
            this.emit('error', err);
        });
        this.packetHandler.on('chat', (message) => {
            this.emit('chat', message);
        });
        this.packetHandler.on('position_update', (position) => {
            this.emit('position', position);
        });
    }
    initializeModules() {
        if (this.options.behavior.antiAFK.enabled) {
            this.antiAFK = new AntiAFK_1.AntiAFK(this.packetHandler, this.options.behavior.antiAFK);
            this.antiAFK.start();
        }
        if (this.options.behavior.chatResponse.enabled) {
            this.chatResponder = new ChatResponder_1.ChatResponder(this.packetHandler, this.options.behavior.chatResponse);
        }
        if (this.options.osintMode) {
            this.packetSniffer = new PacketSniffer_1.PacketSniffer(this.packetHandler);
            this.packetSniffer.startSniffing();
            this.playerTracker = new PlayerTracker_1.PlayerTracker(this.packetHandler);
        }
    }
    async connect() {
        await this.connection.connect();
    }
    disconnect() {
        if (this.antiAFK)
            this.antiAFK.stop();
        this.connection.disconnect();
    }
    isConnected() {
        return this.connection.isConnected();
    }
    sendChat(message) {
        this.packetHandler.sendChat(message);
    }
    moveTo(x, y, z) {
        this.packetHandler.sendPosition({ x, y, z });
    }
    lookAt(yaw, pitch) {
        this.packetHandler.sendLook(yaw, pitch);
    }
    swingArm() {
        this.packetHandler.sendArmAnimation(0);
    }
    getPosition() {
        return this.packetHandler.getBotState().position;
    }
    getHealth() {
        return this.packetHandler.getBotState().health;
    }
    getPacketStats() {
        return this.packetHandler.getPacketStats();
    }
    getBotState() {
        return this.packetHandler.getBotState();
    }
    sendKeepAlive() {
        this.connection.writePacket('keep_alive', { keepAliveId: Date.now() });
    }
    getPlayerTracker() {
        return this.playerTracker;
    }
    getPacketSniffer() {
        return this.packetSniffer;
    }
}
exports.BotClient = BotClient;
//# sourceMappingURL=BotClient.js.map