"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyManager = void 0;
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
class ProxyManager {
    proxyConfig;
    constructor(config) {
        this.proxyConfig = config;
    }
    getAgent() {
        if (!this.proxyConfig.enabled)
            return null;
        const { type, host, port } = this.proxyConfig;
        const proxyUrl = `${type}://${host}:${port}`;
        switch (type) {
            case 'socks4':
            case 'socks5':
                return new SocksProxyAgent(proxyUrl);
            case 'http':
                return new HttpsProxyAgent(proxyUrl);
            default:
                throw new Error(`Unsupported proxy type: ${type}`);
        }
    }
    rotateProxy(proxies) {
        const randomIndex = Math.floor(Math.random() * proxies.length);
        this.proxyConfig = { ...this.proxyConfig, ...proxies[randomIndex] };
    }
}
exports.ProxyManager = ProxyManager;
//# sourceMappingURL=ProxyManager.js.map