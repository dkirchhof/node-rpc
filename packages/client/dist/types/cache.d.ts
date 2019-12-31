import { INoResponse, ISuccess } from "../types/response";
export declare type Cache = Map<number, {
    date: number;
    response: ISuccess | INoResponse;
}>;
