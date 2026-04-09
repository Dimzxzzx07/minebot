const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');

export class ProxyManager {
  private proxyConfig: any;

  constructor(config: any) {
    this.proxyConfig = config;
  }

  getAgent(): any {
    if (!this.proxyConfig.enabled) return null;

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

  rotateProxy(proxies: any[]): void {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    this.proxyConfig = { ...this.proxyConfig, ...proxies[randomIndex] };
  }
}