export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
export interface BotState {
    position: Vec3;
    yaw: number;
    pitch: number;
    health: number;
    food: number;
    inventory: ItemStack[];
    entities: Map<number, EntityInfo>;
    players: Map<string, PlayerInfo>;
    isConnected: boolean;
    lastPingTime: number;
}
export interface EntityInfo {
    id: number;
    type: string;
    position: Vec3;
    metadata?: any;
    spawnTime: number;
}
export interface PlayerInfo {
    username: string;
    uuid: string;
    ping: number;
    gameMode: number;
    position?: Vec3;
}
export interface ItemStack {
    slot: number;
    itemId: number;
    count: number;
    metadata?: number;
    nbt?: any;
}
export interface PacketStats {
    sent: number;
    received: number;
    latency: number[];
    packetTypes: Map<string, number>;
    bytesReceived: number;
    bytesSent: number;
}
export interface ServerMetrics {
    tps: number;
    avgLatency: number;
    playerCount: number;
    uptime: number;
}
//# sourceMappingURL=StateTypes.d.ts.map