import { useContext, useEffect, useMemo, useRef } from "react"

import AppConfigContext from "../contexts/appConfigContext"
import type { AppConfigContextType } from "../contexts/appConfigContext/appConfigType"

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';


const useAxios = (url: string | null = null) => {
    const appConfig: AppConfigContextType | null = useContext(AppConfigContext);

    const reqInterceptorId = useRef<number | null>(null);

    const api: AxiosInstance = useMemo(() => axios.create({
        baseURL: url ?? `${import.meta.env.VITE_API_URL}/api`
    }), [url]);

    useEffect(() => {
        reqInterceptorId.current = api.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
            const method: string = config.method ?? "";

            if (appConfig?.appEnvironmentVar?.workspace) {
                if (["get", "delete"].includes(method)) {
                    config.params = {
                        workspace: appConfig.appEnvironmentVar.workspace,
                        ...config.params
                    }
                }

                if (["post", "put", "patch"].includes(method)) {
                    if (config?.data) {
                        config.data = {
                            workspace: appConfig.appEnvironmentVar.workspace,
                            ...config.data
                        }
                    }
                }
            }

            return config;
        })

        return () => {
            if (reqInterceptorId.current) api.interceptors.request.eject(reqInterceptorId.current);
        }
    }, [api, appConfig]);

    return { api }
}

export default useAxios;