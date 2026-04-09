import { createBot, LogLevel, setLogLevel } from '../src';

async function main() {
  setLogLevel(LogLevel.OSINT);
  
  const bot = await createBot({
    target: 'play.example.com',
    port: 25565,
    version: '1.20.4',
    timeout: 5000,
    auth: {
      type: 'offline',
      username: 'OSINT_Scanner',
      uuid: null
    },
    behavior: {
      autoReconnect: true,
      reconnectDelay: 3000,
      antiAFK: {
        enabled: true,
        type: 'rotate',
        interval: 15000
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
    osintMode: true,
    stressMode: false
  });
  
  console.log('OSINT Mode Bot Started');
  console.log('Monitoring player movements and server information...');
  
  const playerTracker = bot.getPlayerTracker();
  if (playerTracker) {
    playerTracker.addToWatchlist('AdminName');
    playerTracker.addToWatchlist('TargetPlayer');
    
    playerTracker.on('watchlist_player_seen', (player) => {
      console.log(`[ALERT] Watchlist player detected: ${player.username}`);
      console.log(`Position: ${player.position?.toString()}`);
    });
    
    setInterval(() => {
      const count = playerTracker.getPlayerCount();
      console.log(`[INFO] Current players online: ${count}`);
    }, 30000);
  }
  
  const sniffer = bot.getPacketSniffer();
  if (sniffer) {
    sniffer.enableFileLogging('packet_log.json');
    
    sniffer.on('packet_captured', (packet) => {
      if (packet.name === 'spawn_player') {
        console.log(`[OSINT] New player joined at position:`, packet.data);
      }
    });
  }
  
  setInterval(() => {
    const stats = bot.getPacketStats();
    const avgLatency = stats.latency.reduce((a, b) => a + b, 0) / stats.latency.length;
    console.log(`[PERFORMANCE] Avg Latency: ${Math.round(avgLatency)}ms, TPS: ${(1000 / avgLatency).toFixed(1)}`);
  }, 10000);
}

main().catch(console.error);