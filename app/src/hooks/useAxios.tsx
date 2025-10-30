import { useMemo } from "react";
import axios, { type AxiosInstance } from "axios";


const useAxios = (url: string | null = null) => {

    const baseURL = useMemo(() => {
        if (url) return url;
        return "/api";
    }, [url]);

    const api: AxiosInstance = useMemo(
        () => axios.create({ baseURL }),
        [baseURL]
    );

    return { api };
};

export default useAxios;
