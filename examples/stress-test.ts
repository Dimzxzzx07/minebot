import { StressTester } from '../src/behaviors/StressTester';
import { BotOptions } from '../src';

async function main() {
  const stressTester = new StressTester();
  
  const baseOptions: BotOptions = {
    target: 'localhost',
    port: 25565,
    version: '1.20.4',
    timeout: 5000,
    auth: {
      type: 'offline',
      username: 'StressBot',
      uuid: null
    },
    behavior: {
      autoReconnect: false,
      reconnectDelay: 3000,
      antiAFK: {
        enabled: false,
        type: 'swing',
        interval: 10000
      },
      chatResponse: {
        enabled: false,
        prefix: '!',
        allowlist: []
      }
    },
    proxy: {
      enabled: false,
      host: null,
      port: null,
      type: 'socks5'
    },
    performance: {
      compressionThreshold: 256,
      streamMode: 'low-latency',
      maxBatchPackets: 50
    },
    debug: false,
    osintMode: false,
    stressMode: true
  };
  
  console.log('Starting stress test with 50 bots...');
  
  const bots = await stressTester.launchBots(50, baseOptions);
  
  setInterval(() => {
    const active = stressTester.getActiveBotCount();
    const packetsSent = stressTester.getTotalPacketsSent();
    const packetsReceived = stressTester.getTotalPacketsReceived();
    
    console.log(`[Stress Test] Active bots: ${active}, Packets sent: ${packetsSent}, Received: ${packetsReceived}`);
  }, 5000);
  
  setTimeout(() => {
    console.log('Stopping stress test...');
    stressTester.stopStressTest();
    process.exit(0);
  }, 60000);
}

main().catch(console.error);