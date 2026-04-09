import { BotClient } from './client/BotClient';
import { BotOptions } from './types/BotOptions';
import { Logger, LogLevel } from './utils/Logger';

export { BotClient };
export * from './types/BotOptions';
export * from './types/StateTypes';
export * from './behaviors/AntiAFK';
export * from './behaviors/ChatResponder';
export * from './behaviors/StressTester';
export * from './modules/PacketSniffer';
export * from './modules/PlayerTracker';
export * from './utils/Logger';

export async function createBot(options: BotOptions): Promise<BotClient> {
  const bot = new BotClient(options);
  await bot.connect();
  return bot;
}

export function setLogLevel(level: LogLevel): void {
  Logger.getInstance().setLevel(level);
}

export default {
  BotClient,
  createBot,
  setLogLevel,
  LogLevel
};