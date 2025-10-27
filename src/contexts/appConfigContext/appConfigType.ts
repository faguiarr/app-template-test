import type { ReactNode } from "react";
import type { DefaultObject } from "../../types/defaultObject";

declare global {
    interface Window {
        APP_ID: string;
        APP_CONFIG: { [key: string]: any };
    }
};

export type AppConfigContextType = {
    appId: string,
    appEnvironmentVar: DefaultObject
};

export type AppConfigProviderProps = {
    children: ReactNode;
};
