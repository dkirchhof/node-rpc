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
export declare type Response<T = any> = ISuccess<T> | IFail | INoCall;
