import { useContext, useEffect, useMemo, useRef, useState } from "react";

import BroadcastChannelContext from ".";
import { BroadcastChannelHandler } from "./broadcastChannelHandler";
import type { BroadcastChannelContextType, BroadcastChannelProviderProps, Message } from "./broadcastChannelType";

export const BroadcastChannelProvider = ({ children }: BroadcastChannelProviderProps) => {
    const handlerRef = useRef<BroadcastChannelHandler | null>(null);
    const [lastMessage, setLastMessage] = useState<any | null>(null);

    const appId = window.APP_ID ?? "app_template";

    if (!handlerRef.current) {
        handlerRef.current = new BroadcastChannelHandler(appId);
    }

    useEffect(() => {
        const channel: BroadcastChannelHandler = new BroadcastChannelHandler(appId);
        handlerRef.current = channel;

        const unsubscribe: () => void = channel.listen((message: Message) => setLastMessage(message));

        return () => {
            unsubscribe();
            channel.close();
            handlerRef.current = null;
        }
    }, []);

    const value: BroadcastChannelContextType = useMemo(() => ({
        post: (message: Message) => handlerRef.current?.sendMessage(message),
        subscribe: (fn: (m: Message) => void) => handlerRef.current ? handlerRef.current.listen(fn) : () => { },
        lastMessage
    }), lastMessage);

    return (
        <BroadcastChannelContext.Provider value={value}>
            {children}
        </BroadcastChannelContext.Provider>
    );
}

export const useBroadcastChannel = () => {
    const context = useContext(BroadcastChannelContext);
    if (!context) throw new Error("useBroadcast deve ser usado dentro de <BroadcastProvider>.");
    return context;
}