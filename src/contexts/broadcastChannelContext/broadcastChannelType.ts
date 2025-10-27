import type { ReactNode } from "react";

export type Message<T = unknown> = { type: string; payload?: T };

export type BroadcastChannelContextType<T = unknown> = {
    post: (msg: Message<T>) => void;
    lastMessage: Message<T> | null;
    subscribe: (listener: (msg: Message<T>) => void) => () => void;
};

export type BroadcastChannelProviderProps = {
    children: ReactNode;
};
