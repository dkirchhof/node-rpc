export interface IAPI<T extends any> {
    call<K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>): Promise<ISuccess<ReturnType<T[K]>> | IFail>;
    callWithProgress<K extends keyof T & string>(onProgress: (progress: number) => any, procedure: K, ...params: Parameters<T[K]>): Promise<ISuccess<ReturnType<T[K]>> | IFail>;
    callCached<K extends keyof T & string>(cacheTime: number, procedure: K, ...params: Parameters<T[K]>): Promise<ISuccess<ReturnType<T[K]>> | IFail>;
    callMaybe<K extends keyof T & string>(cacheTime: number, procedure: K, ...params: Parameters<T[K]>): Promise<ISuccess<ReturnType<T[K]>> | IFail | INoCall>;
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
    call<K extends keyof T & string>(procedure: K, ...params: Parameters<T[K]>): Promise<IFail | ISuccess<any>>;
    callWithProgress<K extends keyof T & string>(onProgress: (progress: number) => any, procedure: K, ...params: Parameters<T[K]>): Promise<IFail | ISuccess<any>>;
    callMaybe<K extends keyof T & string>(cacheTime: number, procedure: K, ...params: Parameters<T[K]>): Promise<IFail | INoCall | ISuccess<any>>;
    callCached<K extends keyof T & string>(cacheTime: number, procedure: K, ...params: Parameters<T[K]>): Promise<IFail | ISuccess<any>>;
}
export {};
