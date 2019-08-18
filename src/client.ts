import axios, { AxiosResponse, AxiosError } from "axios";

export function API<T extends any>(endpoint: string) {
    return <K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>) => {
        return new RPC<ReturnType<T[K]>>(endpoint, procedure, params);
    }
}

class RPC<T> {
    private readonly progressCallbacks: Array<(progress: number) => any> = [];
    private readonly promise: Promise<AxiosResponse>;

    constructor(endpoint: string, procedure: string, params: any[]) {
        const data = toFormData(params);

        this.promise = axios.request({
            url: endpoint,
            method: "post",
            headers: { "X-RPC-Procedure": procedure },
            data,
            onUploadProgress: event => this.progressCallbacks.forEach(callback => callback(event.loaded / event.total)),
        });
    }

    onSuccess(callback: (result: T) => any) {
        this.promise
            .then((response: AxiosResponse) => callback(response.data))
            .catch(() => { });

        return this;
    }

    onFailure(callback: (error: string) => any) {
        this.promise.catch((error: AxiosError) => callback(error.response!.data));

        return this;
    }

    onProgress(callback: (progress: number) => any) {
        this.progressCallbacks.push(callback);

        return this;
    }
}

function toFormData(params: any[]) {
    const data = new FormData();

    const undefinedReplacer = (_: string, v: any) => v === undefined ? null : v;
    
    params.forEach((p, i) => {
        const key = i.toString();

        if (p instanceof FileList) {
            if(p.length === 0) {
                data.append(key, "null");
            } else {
                [...p].forEach(file => data.append(key, file));
            }
        }
        else if (p instanceof File) {
            data.append(key, p);
        }
        else {
            data.append(key, JSON.stringify(p, undefinedReplacer));
        }
    });

    return data;
}
