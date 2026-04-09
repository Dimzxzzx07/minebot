#!/usr/bin/env node

import { Command } from 'commander';
import { createBot, setLogLevel, LogLevel } from './index';
import { BotOptions } from './types/BotOptions';
import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  dim: '\x1b[2m'
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function helper(messages: string[], delayMs: number) {
  if (!Array.isArray(messages)) {
    return Promise.resolve();
  }
  return new Promise<void>(resolve => {
    messages.forEach((line, index) => {
      setTimeout(() => {
        console.log(line);
        if (index === messages.length - 1) {
          resolve();
        }
      }, index * delayMs);
    });
  });
}

const bannerLines = `
${colors.cyan}${colors.bright}
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣀⠀⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⢀⣤⠚⠉⣨⣽⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⣤⣤⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣠⣶⠖⠋⣉⣩⣿⣿⡉⠀⠀⠀⠀⣾⣅⡀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⢀⡼⡿⢷⡲⢤⣉⢙⣳⠦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣠⣾⣿⣿⣧⣶⣋⣡⡟⣸⡇⠙⠶⣄⡀⠀⣻⣿⢻⣶⣿⣿⣿⣿⣿⣿⣻⣯⢿⣟⢀⣠⠾⢻⣄⣤⣤⡻⣴⣮⣙⢿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣴⡿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⣈⠙⡒⠚⠳⡘⠛⠛⠿⢿⡿⠿⠛⠻⢿⠄⠀⣉⠁⣴⣿⣿⣿⣿⣿⣟⣿⣿⣶⣿⡟⠛⠛⠻⣧⡀⠀⠀⠀⠀⠀⠀
⡼⠋⠀⠀⠀⠉⠉⠉⠻⠿⠿⢿⣿⣿⣿⣿⡿⣿⠏⠁⠀⣿⣤⣠⡴⡾⢷⣤⣤⣤⣾⡃⠀⠉⠛⠻⣿⣿⣿⡿⠛⠉⠙⠁⠀⠀⠀⠀⠀⠀⠈⠓⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⠟⠁⠀⠀⠀⠺⡟⢻⣦⡍⠁⢀⠘⣷⡄⠛⠿⢿⠋⠀⠀⠀⠀⠙⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⢨⡈⠉⣷⣶⣭⣿⣿⣾⠀⢰⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡄⠈⠻⠛⠟⠛⠈⢀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠻⣿⣾⣻⣿⣿⣿⣿⣟⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠚⠿⢿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
${colors.reset}
${colors.green}${colors.bright}MineBot Advanced - Minecraft Bot Framework${colors.reset}
${colors.cyan}Version 2.0.0 - Anti Bot & Firewall Bypass${colors.reset}
`.trim().split('\n');

const helpLines = `
${colors.yellow}USAGE:${colors.reset}
  ${colors.cyan}mc-bot${colors.reset} [command] [options]

${colors.yellow}COMMANDS:${colors.reset}
  ${colors.green}start${colors.reset}      Start a basic Minecraft bot
  ${colors.green}osint${colors.reset}       Run OSINT mode
  ${colors.green}stress${colors.reset}      Launch multiple bots for stress testing
  ${colors.green}spam${colors.reset}        Spam multiple bots with anti-bypass
  ${colors.green}config${colors.reset}      Run bot using JSON config file

${colors.yellow}SPAM MODE OPTIONS:${colors.reset}
  ${colors.green}--random-delay${colors.reset}     Use random delay
  ${colors.green}--delay-min${colors.reset} <ms>   Minimum random delay
  ${colors.green}--delay-max${colors.reset} <ms>   Maximum random delay
  ${colors.green}--random-name${colors.reset}      Use random usernames
  ${colors.green}--human-like${colors.reset}       Enable human-like behavior
  ${colors.green}--slow-mode${colors.reset}        Enable slow mode
  ${colors.green}--stealth-mode${colors.reset}     Enable stealth mode
  ${colors.green}--keep-alive${colors.reset}       Keep bots alive
  ${colors.green}--auto-chat${colors.reset} <msg>  Auto send chat message

${colors.yellow}EXAMPLES:${colors.reset}
  ${colors.cyan}mc-bot spam -t play.server.com -p 25565 -c 5 --random-delay --random-name${colors.reset}
  ${colors.cyan}mc-bot spam -t play.server.com -p 25565 -c 3 --stealth-mode --keep-alive${colors.reset}
  ${colors.cyan}mc-bot spam -t play.server.com -p 25565 -c 10 --human-like --auto-chat Hello${colors.reset}

${colors.yellow}OPTIONS:${colors.reset}
  ${colors.green}-t, --target${colors.reset} <host>      Server target
  ${colors.green}-p, --port${colors.reset} <port>        Server port
  ${colors.green}-c, --count${colors.reset} <number>     Number of bots
  ${colors.green}-u, --username${colors.reset} <name>    Username prefix
  ${colors.green}-d, --delay${colors.reset} <ms>         Delay between bots
  ${colors.green}--debug${colors.reset}                  Enable debug mode
  ${colors.green}-h, --help${colors.reset}               Display help
`.trim().split('\n');

const program = new Command();

program
  .name('mc-bot')
  .description('Minecraft Bot with Anti-Bot Bypass')
  .version('2.0.0')
  .helpOption('-h, --help');

program
  .command('start')
  .description('Start a basic Minecraft bot')
  .option('-t, --target <host>', 'Server IP/Host', 'localhost')
  .option('-p, --port <port>', 'Server port', '25565')
  .option('-v, --version <version>', 'Minecraft version', '1.20.4')
  .option('-u, --username <name>', 'Bot username', 'MyMineBot')
  .option('--anti-afk', 'Enable anti-AFK', false)
  .option('--debug', 'Enable debug mode', false)
  .action(async (options) => {
    await runBot({
      target: options.target,
      port: options.port,
      version: options.version,
      username: options.username,
      antiAfk: options.antiAfk,
      debug: options.debug
    });
  });

program
  .command('osint')
  .description('Run bot in OSINT mode')
  .option('-t, --target <host>', 'Server IP/Host', 'localhost')
  .option('-p, --port <port>', 'Server port', '25565')
  .option('-u, --username <name>', 'Bot username', 'OSINT_Scanner')
  .option('-w, --watchlist <players>', 'Comma-separated players to watch')
  .option('--log-file <file>', 'Save packet log to file', 'packets.json')
  .action(async (options) => {
    await runOSINTMode({
      target: options.target,
      port: options.port,
      username: options.username,
      watchlist: options.watchlist,
      logFile: options.logFile
    });
  });

program
  .command('stress')
  .description('Launch multiple bots for stress testing')
  .option('-t, --target <host>', 'Server IP/Host', 'localhost')
  .option('-p, --port <port>', 'Server port', '25565')
  .option('-c, --count <number>', 'Number of bots', '50')
  .option('-u, --username <prefix>', 'Username prefix', 'StressBot')
  .option('-d, --duration <seconds>', 'Test duration in seconds', '60')
  .option('--delay <ms>', 'Delay between connections in ms', '100')
  .action(async (options) => {
    await runStressTest({
      target: options.target,
      port: options.port,
      count: options.count,
      username: options.username,
      duration: options.duration,
      delay: options.delay
    });
  });

program
  .command('spam')
  .description('Spam multiple bots with anti-bot bypass')
  .option('-t, --target <host>', 'Server IP/Host', 'localhost')
  .option('-p, --port <port>', 'Server port', '25565')
  .option('-c, --count <number>', 'Number of bots to spam', '10')
  .option('-u, --username <prefix>', 'Username prefix', 'SpamBot')
  .option('-d, --delay <ms>', 'Delay between each bot in ms', '500')
  .option('--random-delay', 'Use random delay', false)
  .option('--delay-min <ms>', 'Minimum random delay', '5000')
  .option('--delay-max <ms>', 'Maximum random delay', '15000')
  .option('--random-name', 'Use random usernames', false)
  .option('--human-like', 'Enable human-like behavior', false)
  .option('--slow-mode', 'Enable slow mode', false)
  .option('--stealth-mode', 'Enable stealth mode', false)
  .option('--keep-alive', 'Keep bots alive after join', false)
  .option('--auto-chat <message>', 'Auto send chat message after join')
  .option('--debug', 'Enable debug mode', false)
  .action(async (options) => {
    await runSpamBots({
      target: options.target,
      port: options.port,
      count: options.count,
      username: options.username,
      delay: options.delay,
      randomDelay: options.randomDelay,
      delayMin: options.delayMin,
      delayMax: options.delayMax,
      randomName: options.randomName,
      humanLike: options.humanLike,
      slowMode: options.slowMode,
      stealthMode: options.stealthMode,
      keepAlive: options.keepAlive,
      autoChat: options.autoChat,
      debug: options.debug
    });
  });

program
  .command('config')
  .description('Run bot using JSON config file')
  .option('-f, --file <path>', 'Path to config JSON file', 'bot-config.json')
  .action(async (options) => {
    await runConfigFile(options.file);
  });

async function showMenu() {
  console.clear();
  await helper(bannerLines, 25);
  await delay(150);
  await helper(helpLines, 15);
}

if (process.argv.length === 2) {
  showMenu();
  process.exit(0);
}

program.parse();

async function runSpamBots(config: {
  target: string;
  port: string;
  count: string;
  username: string;
  delay: string;
  randomDelay: boolean;
  delayMin: string;
  delayMax: string;
  randomName: boolean;
  humanLike: boolean;
  slowMode: boolean;
  stealthMode: boolean;
  keepAlive: boolean;
  autoChat?: string;
  debug: boolean;
}) {
  console.log(`\n${colors.green}${colors.bright}[SPAM BOTS MODE]${colors.reset}`);
  console.log(`${colors.cyan}Target:${colors.reset} ${config.target}:${config.port}`);
  console.log(`${colors.cyan}Total Bots:${colors.reset} ${config.count}`);
  
  if (config.randomName) {
    console.log(`${colors.cyan}Username:${colors.reset} Random`);
  } else {
    console.log(`${colors.cyan}Username Prefix:${colors.reset} ${config.username}`);
  }
  
  if (config.randomDelay) {
    console.log(`${colors.cyan}Delay:${colors.reset} Random ${config.delayMin}-${config.delayMax}ms`);
  } else {
    console.log(`${colors.cyan}Delay:${colors.reset} ${config.delay}ms`);
  }
  
  console.log(`${colors.cyan}Keep Alive:${colors.reset} ${config.keepAlive}`);
  console.log(`${colors.cyan}Human Like:${colors.reset} ${config.humanLike}`);
  console.log(`${colors.cyan}Slow Mode:${colors.reset} ${config.slowMode}`);
  console.log(`${colors.cyan}Stealth Mode:${colors.reset} ${config.stealthMode}`);
  if (config.autoChat) console.log(`${colors.cyan}Auto Chat:${colors.reset} ${config.autoChat}`);
  console.log(``);

  if (config.debug) setLogLevel(LogLevel.DEBUG);

  const bots: any[] = [];
  const failedBots: string[] = [];
  const totalBots = parseInt(config.count);
  
  const randomNames = [
    'Alex', 'Steve', 'Player', 'Gamer', 'Hero', 'Warrior', 'Knight', 'Wizard',
    'Hunter', 'Ranger', 'Mage', 'Priest', 'Druid', 'Paladin', 'Rogue', 'Bard',
    'Crafter', 'Miner', 'Farmer', 'Builder', 'Explorer', 'Adventurer', 'Traveler'
  ];

  for (let i = 0; i < totalBots; i++) {
    let botName: string;
    if (config.randomName) {
      const randomIndex = Math.floor(Math.random() * randomNames.length);
      const randomNum = Math.floor(Math.random() * 999);
      botName = `${randomNames[randomIndex]}${randomNum}`;
    } else {
      botName = `${config.username}_${i + 1}`;
    }
    
    let delayMs: number;
    if (config.randomDelay) {
      const min = parseInt(config.delayMin);
      const max = parseInt(config.delayMax);
      delayMs = Math.floor(Math.random() * (max - min + 1) + min);
    } else {
      delayMs = parseInt(config.delay);
    }
    
    if (config.slowMode) {
      delayMs = delayMs * 2;
    }
    
    if (config.stealthMode && delayMs < 10000) {
      delayMs = 10000;
    }
    
    console.log(`[${i + 1}/${totalBots}] ${colors.green}Launching${colors.reset} bot: ${colors.cyan}${botName}${colors.reset} ${colors.dim}(delay: ${delayMs}ms)${colors.reset}`);

    const botOptions: BotOptions = {
      target: config.target,
      port: parseInt(config.port),
      version: '1.20.4',
      timeout: 20000,
      auth: {
        type: 'offline',
        username: botName,
        uuid: null
      },
      behavior: {
        autoReconnect: config.keepAlive,
        reconnectDelay: 8000,
        antiAFK: {
          enabled: config.keepAlive || config.humanLike,
          type: 'swing',
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
      antiDetection: {
        enabled: config.stealthMode || config.humanLike,
        randomDelayBetweenPackets: config.randomDelay,
        randomUsernameSuffix: config.randomName,
        humanLikeTyping: config.humanLike,
        randomMovement: config.humanLike,
        spoofedBrand: config.stealthMode,
        connectionJitter: config.stealthMode,
        packetSpacingMin: 50,
        packetSpacingMax: 300,
        rotateProxyOnFail: false,
        useRandomVersion: false,
        mimicRealPlayer: config.humanLike,
        slowMode: config.slowMode,
        stealthMode: config.stealthMode
      },
      debug: config.debug,
      osintMode: false,
      stressMode: false
    };
    
    try {
      const bot = await createBot(botOptions);
      bots.push(bot);
      
      bot.on('ready', () => {
        console.log(`  ${colors.green}connected${colors.reset} - ${botName}`);
        if (config.autoChat) {
          const chatDelay = config.humanLike ? Math.floor(Math.random() * 5000 + 2000) : 1000;
          setTimeout(() => {
            bot.sendChat(config.autoChat!);
          }, chatDelay);
        }
      });
      
      bot.on('error', (err: Error) => {
        if (!err.message.includes('ECONNREFUSED') && !err.message.includes('ETIMEDOUT')) {
          console.log(`  ${colors.red}error${colors.reset} - ${botName}: ${err.message}`);
        }
      });
      
      bot.on('disconnect', (reason: string) => {
        if (config.keepAlive && reason !== 'socketClosed') {
          console.log(`  ${colors.yellow}disconnected${colors.reset} - ${botName}`);
        }
      });
      
    } catch (error: any) {
      failedBots.push(botName);
      if (!error.message.includes('ECONNREFUSED') && !error.message.includes('ETIMEDOUT')) {
        console.log(`  ${colors.red}failed${colors.reset} - ${botName}: ${error.message}`);
      } else {
        console.log(`  ${colors.red}failed${colors.reset} - ${botName}`);
      }
    }
    
    if (i < totalBots - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log(`\n${colors.green}Success:${colors.reset} ${bots.length}/${totalBots} bots connected`);
  if (failedBots.length > 0) {
    console.log(`${colors.red}Failed:${colors.reset} ${failedBots.length} bots`);
  }
  console.log(``);
  
  if (config.keepAlive && bots.length > 0) {
    console.log(`${colors.yellow}Press Ctrl+C to disconnect all bots${colors.reset}\n`);
  } else if (bots.length > 0) {
    setTimeout(() => {
      console.log(`${colors.yellow}Disconnecting all bots...${colors.reset}`);
      bots.forEach(bot => bot.disconnect());
      process.exit(0);
    }, 10000);
  } else {
    process.exit(1);
  }
}

async function runBot(config: {
  target: string;
  port: string;
  version: string;
  username: string;
  antiAfk: boolean;
  debug: boolean;
}) {
  if (config.debug) setLogLevel(LogLevel.DEBUG);
  
  console.log(`\n${colors.green}${colors.bright}[BOT MODE]${colors.reset}`);
  console.log(`${colors.cyan}Target:${colors.reset} ${config.target}:${config.port}`);
  console.log(`${colors.cyan}Username:${colors.reset} ${config.username}`);
  console.log(`${colors.cyan}Anti-AFK:${colors.reset} ${config.antiAfk}`);
  console.log(``);
  
  const botOptions: BotOptions = {
    target: config.target,
    port: parseInt(config.port),
    version: config.version,
    timeout: 5000,
    auth: {
      type: 'offline',
      username: config.username,
      uuid: null
    },
    behavior: {
      autoReconnect: true,
      reconnectDelay: 3000,
      antiAFK: {
        enabled: config.antiAfk,
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
    antiDetection: {
      enabled: false,
      randomDelayBetweenPackets: false,
      randomUsernameSuffix: false,
      humanLikeTyping: false,
      randomMovement: false,
      spoofedBrand: false,
      connectionJitter: false,
      packetSpacingMin: 50,
      packetSpacingMax: 300,
      rotateProxyOnFail: false,
      useRandomVersion: false,
      mimicRealPlayer: false,
      slowMode: false,
      stealthMode: false
    },
    debug: config.debug,
    osintMode: false,
    stressMode: false
  };
  
  try {
    const bot = await createBot(botOptions);
    
    bot.on('ready', () => {
      console.log(`${colors.green}Bot is ready and connected${colors.reset}`);
      console.log(`${colors.cyan}Position:${colors.reset} ${bot.getPosition().x}, ${bot.getPosition().y}, ${bot.getPosition().z}`);
      bot.sendChat('Hello guys!');
    });
    
    bot.on('chat', (msg: string) => {
      console.log(`${colors.magenta}Chat${colors.reset} ${msg}`);
    });
    
    bot.on('error', (err: Error) => {
      console.error(`${colors.red}Error${colors.reset} ${err.message}`);
    });
    
    bot.on('disconnect', (reason: string) => {
      console.log(`${colors.yellow}Disconnected${colors.reset} ${reason}`);
    });
    
    console.log(`${colors.green}Bot running. Press Ctrl+C to stop.${colors.reset}\n`);
  } catch (error: any) {
    console.error(`${colors.red}Failed to connect${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

async function runOSINTMode(config: {
  target: string;
  port: string;
  username: string;
  watchlist?: string;
  logFile?: string;
}) {
  console.log(`\n${colors.green}${colors.bright}[OSINT MODE]${colors.reset}`);
  console.log(`${colors.cyan}Target:${colors.reset} ${config.target}:${config.port}`);
  console.log(`${colors.cyan}Username:${colors.reset} ${config.username}`);
  if (config.watchlist) console.log(`${colors.cyan}Watchlist:${colors.reset} ${config.watchlist}`);
  if (config.logFile) console.log(`${colors.cyan}Log File:${colors.reset} ${config.logFile}`);
  console.log(``);
  
  setLogLevel(LogLevel.OSINT);
  
  const botOptions: BotOptions = {
    target: config.target,
    port: parseInt(config.port),
    version: '1.20.4',
    timeout: 5000,
    auth: {
      type: 'offline',
      username: config.username,
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
    antiDetection: {
      enabled: false,
      randomDelayBetweenPackets: false,
      randomUsernameSuffix: false,
      humanLikeTyping: false,
      randomMovement: false,
      spoofedBrand: false,
      connectionJitter: false,
      packetSpacingMin: 50,
      packetSpacingMax: 300,
      rotateProxyOnFail: false,
      useRandomVersion: false,
      mimicRealPlayer: false,
      slowMode: false,
      stealthMode: false
    },
    debug: false,
    osintMode: true,
    stressMode: false
  };
  
  try {
    const bot = await createBot(botOptions);
    const playerTracker = bot.getPlayerTracker();
    const sniffer = bot.getPacketSniffer();
    
    if (config.watchlist && playerTracker) {
      const players = config.watchlist.split(',');
      players.forEach((p: string) => playerTracker.addToWatchlist(p.trim()));
      console.log(`${colors.green}Watching players${colors.reset} ${players.join(', ')}\n`);
    }
    
    if (sniffer && config.logFile) {
      sniffer.enableFileLogging(config.logFile);
      console.log(`${colors.green}Logging packets to${colors.reset} ${config.logFile}\n`);
    }
    
    playerTracker?.on('watchlist_player_seen', (player: any) => {
      console.log(`\n${colors.red}${colors.bright}WATCHLIST ALERT${colors.reset} ${player.username} is online`);
      console.log(`  ${colors.cyan}First seen${colors.reset} ${new Date(player.firstSeen).toLocaleTimeString()}`);
      if (player.position) {
        console.log(`  ${colors.cyan}Position${colors.reset} X:${player.position.x}, Y:${player.position.y}, Z:${player.position.z}`);
      }
    });
    
    setInterval(() => {
      const count = playerTracker?.getPlayerCount() || 0;
      console.log(`\n${colors.cyan}Players online${colors.reset} ${count}`);
    }, 30000);
    
    bot.on('ready', () => {
      console.log(`${colors.green}OSINT bot is ready${colors.reset}\n`);
    });
    
    console.log(`${colors.green}OSINT bot running. Press Ctrl+C to stop.${colors.reset}\n`);
  } catch (error: any) {
    console.error(`${colors.red}Failed to connect${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

async function runStressTest(config: {
  target: string;
  port: string;
  count: string;
  username: string;
  duration: string;
  delay: string;
}) {
  const { StressTester } = await import('./behaviors/StressTester');
  
  console.log(`\n${colors.red}${colors.bright}[STRESS TEST MODE]${colors.reset}`);
  console.log(`${colors.cyan}Target:${colors.reset} ${config.target}:${config.port}`);
  console.log(`${colors.cyan}Bots:${colors.reset} ${config.count}`);
  console.log(`${colors.cyan}Duration:${colors.reset} ${config.duration}s`);
  console.log(`${colors.cyan}Delay:${colors.reset} ${config.delay}ms`);
  console.log(``);
  
  const stressTester = new StressTester();
  
  const baseOptions: BotOptions = {
    target: config.target,
    port: parseInt(config.port),
    version: '1.20.4',
    timeout: 5000,
    auth: {
      type: 'offline',
      username: config.username,
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
    antiDetection: {
      enabled: false,
      randomDelayBetweenPackets: false,
      randomUsernameSuffix: false,
      humanLikeTyping: false,
      randomMovement: false,
      spoofedBrand: false,
      connectionJitter: false,
      packetSpacingMin: 50,
      packetSpacingMax: 300,
      rotateProxyOnFail: false,
      useRandomVersion: false,
      mimicRealPlayer: false,
      slowMode: false,
      stealthMode: false
    },
    debug: false,
    osintMode: false,
    stressMode: true
  };
  
  try {
    const bots = await stressTester.launchBots(parseInt(config.count), baseOptions);
    console.log(`${colors.green}Successfully launched ${bots.length} bots${colors.reset}\n`);
    
    const monitor = setInterval(() => {
      const active = stressTester.getActiveBotCount();
      const sent = stressTester.getTotalPacketsSent();
      const received = stressTester.getTotalPacketsReceived();
      console.log(`${colors.cyan}Active${colors.reset} ${active}/${config.count} ${colors.green}Sent${colors.reset} ${sent} ${colors.yellow}Received${colors.reset} ${received}`);
    }, 5000);
    
    setTimeout(() => {
      clearInterval(monitor);
      console.log(`\n${colors.red}Stopping stress test${colors.reset}`);
      stressTester.stopStressTest();
      console.log(`${colors.green}Stress test completed${colors.reset}`);
      process.exit(0);
    }, parseInt(config.duration) * 1000);
  } catch (error: any) {
    console.error(`${colors.red}Stress test failed${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

async function runConfigFile(filePath: string) {
  const configPath = path.resolve(filePath);
  
  if (!fs.existsSync(configPath)) {
    console.error(`${colors.red}Config file not found${colors.reset} ${configPath}`);
    console.log(`\n${colors.yellow}Example config.json${colors.reset}`);
    console.log(JSON.stringify({
      target: "localhost",
      port: 25565,
      username: "ConfigBot",
      antiAFK: true,
      spamMode: true,
      spamCount: 10,
      spamDelay: 3000,
      randomDelay: true,
      randomName: true,
      keepAlive: true
    }, null, 2));
    process.exit(1);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`${colors.green}Loading config from${colors.reset} ${configPath}\n`);
  
  if (config.spamMode) {
    await runSpamBots({
      target: config.target,
      port: config.port,
      count: config.spamCount || '10',
      username: config.username || 'SpamBot',
      delay: config.spamDelay || '3000',
      randomDelay: config.randomDelay || false,
      delayMin: config.delayMin || '5000',
      delayMax: config.delayMax || '15000',
      randomName: config.randomName || false,
      humanLike: config.humanLike || false,
      slowMode: config.slowMode || false,
      stealthMode: config.stealthMode || false,
      keepAlive: config.keepAlive || false,
      autoChat: config.autoChat,
      debug: config.debug || false
    });
  } else if (config.stressMode) {
    await runStressTest({
      target: config.target,
      port: config.port,
      count: config.stressCount || '50',
      username: config.username || 'StressBot',
      duration: config.stressDuration || '60',
      delay: config.stressDelay || '100'
    });
  } else {
    await runBot({
      target: config.target,
      port: config.port,
      version: config.version || '1.20.4',
      username: config.username || 'ConfigBot',
      antiAfk: config.antiAFK || false,
      debug: config.debug || false
    });
  }
}