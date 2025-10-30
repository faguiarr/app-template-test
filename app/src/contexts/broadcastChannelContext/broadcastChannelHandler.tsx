import type { Message } from "./broadcastChannelType";

export class BroadcastChannelHandler {
    private _channel!: BroadcastChannel;
    private _listeners: Set<any> = new Set();

    constructor(name: string) {
        this._channel = new BroadcastChannel(name);

        this._channel.onmessage = (event: MessageEvent) => {
            console.info(event);
            this._listeners.forEach((callback: any) => {
                callback(event);
            });
        };
    }

    listen(callback: (msg: Message) => void): () => void {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    }

    sendMessage(message: Message): void {
        this._channel.postMessage(message);
    }

    close(): void {
        this._listeners.clear();
        this._channel.close();
    }
}