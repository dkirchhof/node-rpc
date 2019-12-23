/// <reference types="node" />
import { IncomingMessage } from "http";
import { IServerOptions } from "../types/server";
export declare function createServer(options: IServerOptions): {
    handleAPIRequest: (req: IncomingMessage) => Promise<any>;
};
