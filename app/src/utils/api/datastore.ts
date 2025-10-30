import { isAxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import type { DefaultObject } from "../../types/defaultObject";
import type { Datastore } from "../../types/datastore";

const baseUrl: string = "datastores";

export const getDatastore = async (api: AxiosInstance, id: string, workspace: string): Promise<Datastore> => {
    const params: DefaultObject = {
        workspace
    }

    try {
        const response: AxiosResponse<Datastore> = await api.get(`${baseUrl}/${id}`, params);
        return response.data;

    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data);
        }

        throw new Error(error);
    }

}

export const getDatastores = async (api: AxiosInstance, id?: string, workspace?: string, query?: string, withData: boolean = false): Promise<Datastore[]> => {
    const params: DefaultObject = {
        ...(workspace ? { workspace } : {}),
        ...(query ? { query } : {}),
        ...(withData ? { with_data: withData } : {}),
    }

    let url: string = baseUrl;
    if (id) url += `/${id}`;

    try {
        const response: AxiosResponse<Datastore[]> = await api.get(url, (!id) ? { params } : {});
        return response.data;

    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data);
        }

        throw new Error(error);
    }

}

export const postDatastore = async (api: AxiosInstance, data: Datastore): Promise<Datastore> => {
    try {
        const response: AxiosResponse<Datastore> = await api.post(baseUrl, data);
        return response.data;

    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data);
        }

        throw new Error(error);
    }
}


export const updateDatastore = async (api: AxiosInstance, id: string, data: Datastore): Promise<Datastore> => {
    try {
        const response: AxiosResponse<Datastore> = await api.put(`${baseUrl}/${id}`, data);
        return response.data;

    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data);
        }

        throw new Error(error);
    }
}

export const deleteDatastore = async (api: AxiosInstance, id: string, workspace: string): Promise<Datastore> => {
    const params: DefaultObject = {
        workspace,
    }

    try {
        const response: AxiosResponse<Datastore> = await api.delete(`${baseUrl}/${id}`, { params });
        return response.data;

    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data);
        }

        throw new Error(error);
    }
}

