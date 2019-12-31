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

export interface INoResponse {
    type: "noResponse";
}

export type Response<T = any> = ISuccess<T> | IFail | INoResponse;
