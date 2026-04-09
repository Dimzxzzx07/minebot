import { EventEmitter } from 'events';
import { PacketHandler } from '../client/PacketHandler';
import { ChatResponseConfig } from '../types/BotOptions';
export declare class ChatResponder extends EventEmitter {
    private packetHandler;
    private config;
    private logger;
    private customResponses;
    constructor(packetHandler: PacketHandler, config: ChatResponseConfig);
    private setupDefaultResponses;
    private registerChatListener;
    private processCommand;
    private getServerStatus;
    private getPosition;
    private getPing;
    private getHelp;
    addResponse(keyword: string, response: string | (() => string)): void;
    removeResponse(keyword: string): void;
    updateConfig(newConfig: Partial<ChatResponseConfig>): void;
}
//# sourceMappingURL=ChatResponder.d.ts.map