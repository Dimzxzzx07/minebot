"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiAFK = void 0;
const events_1 = require("events");
const Logger_1 = require("../utils/Logger");
const Vec3_1 = require("../utils/Vec3");
class AntiAFK extends events_1.EventEmitter {
    packetHandler;
    config;
    logger;
    interval = null;
    isRunning = false;
    constructor(packetHandler, config) {
        super();
        this.packetHandler = packetHandler;
        this.config = config;
        this.logger = Logger_1.Logger.getInstance();
    }
    start() {
        if (!this.config.enabled || this.isRunning)
            return;
        this.isRunning = true;
        this.logger.info(`Anti-AFK started with type: ${this.config.type}`);
        this.interval = setInterval(() => {
            this.performAction();
        }, this.config.interval);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        this.logger.info('Anti-AFK stopped');
    }
    performAction() {
        switch (this.config.type) {
            case 'swing':
                this.packetHandler.sendArmAnimation(0);
                break;
            case 'rotate':
                const randomYaw = Math.random() * Math.PI * 2;
                const randomPitch = (Math.random() - 0.5) * Math.PI / 2;
                this.packetHandler.sendLook(randomYaw, randomPitch);
                break;
            case 'walk':
                const state = this.packetHandler.getBotState();
                const randomX = state.position.x + (Math.random() - 0.5) * 2;
                const randomZ = state.position.z + (Math.random() - 0.5) * 2;
                this.packetHandler.sendPosition(new Vec3_1.Vector3(randomX, state.position.y, randomZ));
                break;
        }
        this.emit('action_performed', this.config.type);
    }
    updateConfig(newConfig) {
        const wasRunning = this.isRunning;
        if (wasRunning) {
            this.stop();
        }
        this.config = { ...this.config, ...newConfig };
        if (wasRunning && this.config.enabled) {
            this.start();
        }
    }
}
exports.AntiAFK = AntiAFK;
//# sourceMappingURL=AntiAFK.js.map