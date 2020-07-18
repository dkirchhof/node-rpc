/// <reference types="node" />
import { IncomingMessage } from "http";
import { IServerOptions } from "../types/server";
export declare function createServer<Context = unknown>(options: IServerOptions<Context>): {
    handleAPIRequest: (req: IncomingMessage, context: Context) => Promise<any>;
};
