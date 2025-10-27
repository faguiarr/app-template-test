import { useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import AppConfigContext from ".";
import type { AppConfigContextType } from "./appConfigType";
import type { DefaultObject } from "../../types/defaultObject";
import { useBroadcastChannel } from "../broadcastChannelContext/broadcastChannelProvider";

export const AppConfigProvider = ({ children }: PropsWithChildren) => {
    const [appEnvironmentVar, setAppEnvironmentVar] = useState<DefaultObject | null>(null);

    const devEnvConfig = useMemo<Record<string, any> | null>(() => {
        if (import.meta.env.DEV) {
            const raw = import.meta.env.VITE_APP_CONFIG as string | undefined;
            if (!raw) {
                console.warn("Missing VITE_APP_CONFIG");
                return null;
            }

            try {
                return JSON.parse(raw);
            } catch (e) {
                console.error("Invalid VITE_APP_CONFIG value:", e);
                return null;
            }
        }
        return null;
    }, []);

    const value: AppConfigContextType = useMemo(() => {
        const base = (window.APP_CONFIG ?? {}) as Record<string, any>;

        const merged = {
            ...base,
            ...(appEnvironmentVar ?? {}),
            ...(devEnvConfig ?? {}),
        };

        const appConfig: AppConfigContextType = {
            appId: window.APP_ID ?? null,
            appEnvironmentVar: {
                ...merged,
            }
        };

        return appConfig;

    }, [appEnvironmentVar]);

    const { subscribe, post } = useBroadcastChannel();

    useEffect(() => {
        const unsubscribe = subscribe((message: any) => {
            const { type, payload } = message.data;
            if (type === 'SEND_ENV_VARS') setAppEnvironmentVar(payload);
        });

        post({ type: 'REQUEST_ENV_VARS' });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>
    );
}

export const useAppConfig = () => {
    const context = useContext(AppConfigContext);
    if (!context) throw new Error("useAppConfig deve ser usado dentro de <AppConfigProvider>.");
    return context;
}