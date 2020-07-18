import { IncomingMessage } from "http";

import { IServerOptions } from "../types/server";
import { deleteFilesGracefully } from "../utils/deleteFilesGracefully";

export function createServer<Context = unknown>(options: IServerOptions<Context>) {
    return {
        handleAPIRequest: async (req: IncomingMessage, context: Context) => {
            const procedureName = req.headers["x-rpc-procedure"] as any;
            const procedure = options.api[procedureName];

            const { params, filePaths } = await options.deserializer.deserialize(req);

            return Promise.resolve(procedure(...params)(context))
                .finally(() => deleteFilesGracefully(filePaths));
        },
    };
}
