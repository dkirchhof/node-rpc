export interface IAPI<T extends any> {
    call: (options?: ICallBaseOptions) => CallFunction<T>;
    callCached: (options: ICallCachedOptions) => CallFunction<T>;
    callMaybe: (options: ICallCachedOptions) => CallFunction<T>;
}
export declare type CallFunction<T extends any> = <K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>) => Promise<ISuccess<ReturnType<T[K]>> | IFail | INoCall>;
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
export declare class API<T extends any> implements IAPI<T> {
    private readonly endpoint;
    private readonly cachedMaybes;
    private readonly cachedResponses;
    constructor(endpoint: string);
    call<K extends keyof T & string>(options?: ICallBaseOptions): (procedure: K, ...params: Parameters<T[K]>) => Promise<IFail | ISuccess<any>>;
    callCached<K extends keyof T & string>(options: ICallCachedOptions): (procedure: K, ...params: Parameters<T[K]>) => Promise<IFail | ISuccess<any>>;
    callMaybe<K extends keyof T & string>(options: ICallCachedOptions): (procedure: K, ...params: Parameters<T[K]>) => Promise<IFail | INoCall | ISuccess<any>>;
}
export {};
