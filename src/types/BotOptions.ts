export interface AntiDetectionConfig {
  enabled: boolean;
  randomDelayBetweenPackets: boolean;
  randomUsernameSuffix: boolean;
  humanLikeTyping: boolean;
  randomMovement: boolean;
  spoofedBrand: boolean;
  connectionJitter: boolean;
  packetSpacingMin: number;
  packetSpacingMax: number;
  rotateProxyOnFail: boolean;
  useRandomVersion: boolean;
  mimicRealPlayer: boolean;
  slowMode: boolean;
  stealthMode: boolean;
}

export interface BotOptions {
  target: string;
  port: number;
  version: string;
  timeout: number;
  auth: AuthConfig;
  behavior: BehaviorConfig;
  proxy: ProxyConfig;
  performance: PerformanceConfig;
  antiDetection: AntiDetectionConfig;
  debug: boolean;
  osintMode: boolean;
  stressMode: boolean;
}

export interface AuthConfig {
  type: 'offline' | 'microsoft' | 'cracked';
  username: string;
  uuid: string | null;
}

export interface BehaviorConfig {
  autoReconnect: boolean;
  reconnectDelay: number;
  antiAFK: AntiAFKConfig;
  chatResponse: ChatResponseConfig;
}

export interface AntiAFKConfig {
  enabled: boolean;
  type: 'swing' | 'rotate' | 'walk';
  interval: number;
}

export interface ChatResponseConfig {
  enabled: boolean;
  prefix: string;
  allowlist: string[];
  responses?: Map<string, string | (() => string)>;
}

export interface ProxyConfig {
  enabled: boolean;
  host: string | null;
  port: number | null;
  type: 'socks4' | 'socks5' | 'http';
  list?: string[];
  rotateInterval?: number;
}

export interface PerformanceConfig {
  compressionThreshold: number;
  streamMode: 'low-latency' | 'balanced' | 'high-throughput';
  maxBatchPackets: number;
}