export interface IAPI<T extends any> {
    call: (options?: ICallBaseOptions) => CallFunction<T>;
    callCached: (options: ICallCachedOptions) => CallFunction<T>;
    callMaybe: (options: ICallCachedOptions) => CallFunction<T>;
    createRequest: <K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>) => {
        call: (options?: ICallBaseOptions) => Promise<ISuccess<ReturnType<T[K]>> | IFail>;
        callCached: (options: ICallCachedOptions) => Promise<ISuccess<ReturnType<T[K]>> | IFail>;
        callMaybe: (options: ICallCachedOptions) => Promise<ISuccess<ReturnType<T[K]>> | IFail | INoCall>;
    };
}
export declare type CallFunction<T extends any> = <K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>) => Promise<CallResult<ReturnType<T[K]>>>;
export declare type CallResult<T> = ISuccess<T> | IFail | INoCall;
export interface ICallBaseOptions {
    onProgress?: (progress: number) => any;
}
export interface ICallCachedOptions extends ICallBaseOptions {
    cacheTime: number;
}
export interface ISuccess<T = any> {
    type: "success";
    code: number;
    data: T;
}
export interface IFail {
    type: "fail";
    code: number;
    error: string;
}
export interface INoCall {
    type: "noCall";
}
export declare class API<T extends any> implements IAPI<T> {
    private readonly endpoint;
    private readonly cachedMaybes;
    private readonly cachedResponses;
    constructor(endpoint: string);
    /**
     * @deprecated
     */
    call<K extends keyof T & string>(options?: ICallBaseOptions): (procedure: K, ...params: Parameters<T[K]>) => Promise<IFail | ISuccess<any>>;
    /**
     * @deprecated
     */
    callCached<K extends keyof T & string>(options: ICallCachedOptions): (procedure: K, ...params: Parameters<T[K]>) => Promise<IFail | ISuccess<any>>;
    /**
     * @deprecated
     */
    callMaybe<K extends keyof T & string>(options: ICallCachedOptions): (procedure: K, ...params: Parameters<T[K]>) => Promise<IFail | INoCall | ISuccess<any>>;
    createRequest<K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>): {
        call: (options?: ICallBaseOptions | undefined) => Promise<IFail | ISuccess<ReturnType<T[K]>>>;
        callCached: (options: ICallCachedOptions) => Promise<IFail | ISuccess<ReturnType<T[K]>>>;
        callMaybe: (options: ICallCachedOptions) => Promise<IFail | INoCall | ISuccess<ReturnType<T[K]>>>;
    };
}
