"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StressTester = void 0;
const events_1 = require("events");
const BotClient_1 = require("../client/BotClient");
const Logger_1 = require("../utils/Logger");
class StressTester extends events_1.EventEmitter {
    bots = [];
    logger;
    isRunning = false;
    keepAliveInterval = null;
    constructor() {
        super();
        this.logger = Logger_1.Logger.getInstance();
    }
    async launchBots(count, baseOptions) {
        this.logger.info(`Launching ${count} bots for stress test`);
        const promises = [];
        for (let i = 0; i < count; i++) {
            const antiAFKConfig = {
                enabled: false,
                type: 'swing',
                interval: 10000
            };
            const botOptions = {
                ...baseOptions,
                auth: {
                    ...baseOptions.auth,
                    username: `${baseOptions.auth.username}_${i}`
                },
                stressMode: true,
                behavior: {
                    ...baseOptions.behavior,
                    antiAFK: antiAFKConfig
                }
            };
            const bot = new BotClient_1.BotClient(botOptions);
            this.bots.push(bot);
            promises.push(bot.connect());
            await this.sleep(100);
        }
        try {
            await Promise.all(promises);
            this.logger.info(`Successfully launched ${this.bots.filter(b => b.isConnected()).length} bots`);
            this.startKeepAliveFlood();
            return this.bots;
        }
        catch (error) {
            this.logger.error(`Failed to launch all bots: ${error}`);
            return this.bots;
        }
    }
    startKeepAliveFlood() {
        if (this.keepAliveInterval)
            return;
        this.keepAliveInterval = setInterval(() => {
            this.bots.forEach(bot => {
                if (bot.isConnected()) {
                    bot.sendKeepAlive();
                }
            });
        }, 1000);
    }
    stopStressTest() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
        this.bots.forEach(bot => bot.disconnect());
        this.bots = [];
        this.isRunning = false;
        this.logger.info('Stress test stopped');
    }
    getActiveBotCount() {
        return this.bots.filter(b => b.isConnected()).length;
    }
    getTotalPacketsSent() {
        return this.bots.reduce((total, bot) => total + bot.getPacketStats().sent, 0);
    }
    getTotalPacketsReceived() {
        return this.bots.reduce((total, bot) => total + bot.getPacketStats().received, 0);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.StressTester = StressTester;
//# sourceMappingURL=StressTester.js.map