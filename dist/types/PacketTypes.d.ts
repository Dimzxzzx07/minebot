export interface Packet {
    name: string;
    data: any;
    size: number;
    timestamp: number;
}
export interface SpawnEntityPacket {
    entityId: number;
    objectUUID: string;
    type: number;
    x: number;
    y: number;
    z: number;
    yaw: number;
    pitch: number;
    headPitch: number;
    velocityX: number;
    velocityY: number;
    velocityZ: number;
}
export interface SpawnPlayerPacket {
    entityId: number;
    playerUUID: string;
    x: number;
    y: number;
    z: number;
    yaw: number;
    pitch: number;
}
export interface ChatMessagePacket {
    message: string;
    position: number;
    sender?: string;
}
export interface PositionPacket {
    x: number;
    y: number;
    z: number;
    yaw: number;
    pitch: number;
    flags: number;
    teleportId: number;
}
export interface KeepAlivePacket {
    keepAliveId: number;
}
//# sourceMappingURL=PacketTypes.d.ts.map