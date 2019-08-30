import axios, { AxiosRequestConfig } from "axios";

export interface IAPI<T extends any> {
    call: (options?: ICallBaseOptions) => CallFunction<T>;
    callCached: (options: ICallCachedOptions) => CallFunction<T>;
    callMaybe: (options: ICallCachedOptions) => CallFunction<T>;
}

export type CallFunction<T extends any> = <K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>) => Promise<ISuccess<ReturnType<T[K]>> | IFail | INoCall>;

export interface ICallBaseOptions {
    onProgress?: (progress: number) => any;
}

export interface ICallCachedOptions extends ICallBaseOptions {
    cacheTime: number;
}

interface ISuccess<T = any> {
    type: "success";
    code: number;
    data: T;
}

interface IFail {
    type: "fail";
    code: number;
    error: string;
}

interface INoCall {
    type: "noCall";
}

export class API<T extends any> implements IAPI<T> {
    private readonly cachedMaybes = new Map<number, { date: number; }>();
    private readonly cachedResponses = new Map<number, { date: number; response: ISuccess<any>; }>();

    constructor(private readonly endpoint: string) {

    }

    public call<K extends keyof T & string>(options?: ICallBaseOptions) {
        return async (procedure: K, ...params: Parameters<T[K]>) => {
            const data = toFormData(params);

            const requestConfig: AxiosRequestConfig = {
                url: this.endpoint,
                method: "post",
                headers: { "X-RPC-Procedure": procedure },
                data,
            }

            if(options && options.onProgress) {
                requestConfig.onUploadProgress = event => options.onProgress!(event.loaded / event.total);
            }

            const response = await request<ReturnType<T[K]>>(requestConfig);

            if(response.code < 400) {
                const result: ISuccess = { 
                    type: "success",
                    code: response.code,
                    data: response.data!,
                };
        
                return result;
            } else {
                const result: IFail = {
                    type: "fail",
                    code: response.code,
                    error: response.error!,
                };
                
                return result;
            }
        };
    }

    public callCached<K extends keyof T & string>(options: ICallCachedOptions) {
        return async (procedure: K, ...params: Parameters<T[K]>) => {
            const hash = createHash(JSON.stringify({ procedure, params }));

            const fromCache = this.cachedResponses.get(hash);
            const now = new Date().getTime();

            if(!fromCache || now - fromCache.date > options.cacheTime) {
                const response = await this.call(options)(procedure, ...params);
                
                if(response.type === "success") {
                    this.cachedResponses.set(hash, { date: now, response });
                }

                return response;
            } else {
                return fromCache.response;
            }
        };
    }

    public callMaybe<K extends keyof T & string>(options: ICallCachedOptions) {
        return async (procedure: K, ...params: Parameters<T[K]>) => {
            const hash = createHash(JSON.stringify({ procedure, params }));

            const fromCache = this.cachedMaybes.get(hash);
            const now = new Date().getTime();

            if(!fromCache || now - fromCache.date > options.cacheTime) {
                const response = await this.call(options)(procedure, ...params);
                
                if(response.type === "success") {
                    this.cachedMaybes.set(hash, { date: now });
                }

                return response;
            } else {
                const response: INoCall = {
                    type: "noCall",
                };

                return response;
            }
        };
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

async function request<T>(config: AxiosRequestConfig): Promise<{ code: number; data?: T; error?: string; }> {
    try {
        const result = await axios.request(config);

        return {
            code: result.status,
            data: result.data,
        }
    }
    catch(e) {
        if(e.response) {
            return {
                code: e.response.status,
                error: e.response.data,
            }
        } else {
            return {
                code: 500,
                error: e.message,
            }
        }
    }
}

function createHash(str: string) {
    let h = 5381;
    let i = str.length;
  
    while(i) {
        h = (h * 33) ^ str.charCodeAt(--i);
    }
  
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return h >>> 0;
}
