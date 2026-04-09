import { createBot, LogLevel, setLogLevel } from '../src';

async function main() {
  setLogLevel(LogLevel.DEBUG);
  
  const bot = await createBot({
    target: 'localhost',
    port: 25565,
    version: '1.20.4',
    timeout: 5000,
    auth: {
      type: 'offline',
      username: 'MyAwesomeBot',
      uuid: null
    },
    behavior: {
      autoReconnect: true,
      reconnectDelay: 3000,
      antiAFK: {
        enabled: true,
        type: 'swing',
        interval: 10000
      },
      chatResponse: {
        enabled: true,
        prefix: '!',
        allowlist: ['dimzxzzx07']
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
    debug: true,
    osintMode: true,
    stressMode: false
  });

  bot.on('ready', () => {
    console.log('Bot is ready!');
    bot.sendChat('Hello everyone! I am a custom bot!');
  });
  
  bot.on('chat', (message: string) => {
    console.log(`Received chat: ${message}`);
  });
  
  bot.on('position', (position) => {
    console.log(`Bot moved to: ${position.toString()}`);
  });
  
  bot.on('error', (error) => {
    console.error('Bot error:', error);
  });
  
  bot.on('disconnect', (reason) => {
    console.log(`Bot disconnected: ${reason}`);
  });
  
  setTimeout(() => {
    if (bot.isConnected()) {
      const pos = bot.getPosition();
      bot.moveTo(pos.x + 5, pos.y, pos.z);
      console.log('Moving forward!');
    }
  }, 30000);
}

main().catch(console.error);