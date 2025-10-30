import { useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import AppConfigContext from ".";
import type { AppConfigContextType } from "./appConfigType";
import type { DefaultObject } from "../../types/defaultObject";
import { useBroadcastChannel } from "../broadcastChannelContext/broadcastChannelProvider";

export const AppConfigProvider = ({ children }: PropsWithChildren) => {
    const [appEnvironmentVar, setAppEnvironmentVar] = useState<DefaultObject | null>(null);

    const [devEnvConfig, setDevEnvConfig] = useState<Record<string, any> | null>(null);
    useEffect(() => {
        if (!import.meta.env.DEV) return;
        (async () => {
            try {
                const res = await fetch("/app-config.dev.json", { cache: "no-store" });
                if (res.ok) {
                    const json = await res.json();
                    setDevEnvConfig(json);
                } else {
                    console.warn("app-config.dev.json não encontrado ou inválido");
                }
            } catch (e) {
                console.warn("Falha ao carregar app-config.dev.json:", e);
            }
        })();
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

    }, [appEnvironmentVar, devEnvConfig]);

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
