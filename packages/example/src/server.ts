import { createServer, RPCFunctions } from "@node-rpc/server";
import { jsonDeserializer } from "@node-rpc/server/dist/deserializers/jsonDeserializer";
import { IncomingMessage, ServerResponse } from "http";

import { IApi } from "./common";

interface IContext {
    lang: string;
}

const api: RPCFunctions<IApi, IContext> = {
    add: (a, b) => () => a + b,
    subtract: (a, b) => () => a - b,
    
    toLocaleString: num => context => num.toLocaleString(context.lang), 
};

const rpcServer = createServer({
    api,
    deserializer: jsonDeserializer,
});

export default async function (req: IncomingMessage, res: ServerResponse) {
    const lang = req.headers["accept-language"]?.split(",")?.[0] || "en";

    const result = await rpcServer.handleAPIRequest(req, { lang });
    console.log(result);

    res.end(JSON.stringify(result));
};
