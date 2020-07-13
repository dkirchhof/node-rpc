import { createServer } from "@node-rpc/server";
import { jsonDeserializer } from "@node-rpc/server/dist/deserializers/jsonDeserializer";
import { IncomingMessage, ServerResponse } from "http";

import { IApi } from "./common";

const api: IApi = {
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    
    toUpperCase: (str: string) => str.toUpperCase(),    
};

const rpcServer = createServer({
    api,
    deserializer: jsonDeserializer,
});

export default async function (req: IncomingMessage, res: ServerResponse) {
    const result = await rpcServer.handleAPIRequest(req);
    console.log(result);

    res.end(JSON.stringify(result));
};
