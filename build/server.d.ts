/// <reference types="node" />
import { IncomingMessage } from "http";
declare type AsyncFunction<T> = T extends (...params: infer P) => infer R ? (...params: P) => R | Promise<R> : never;
export declare type Async<T> = {
    [K in keyof T]: AsyncFunction<T[K]>;
};
export declare function API<T extends {
    [s: string]: (...params: any[]) => any;
}>(api: T): (req: IncomingMessage) => Promise<any>;
export {};
