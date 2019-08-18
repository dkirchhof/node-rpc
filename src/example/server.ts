import { IncomingMessage, ServerResponse } from "http";
import { send } from "micro";
import cors from "micro-cors";

import { API } from "../server";

const apiHandler = API({
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    
    toUpperCase: (str: string) => str.toUpperCase(),
});

const handler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'OPTIONS') {
        return send(res, 200, 'ok!');
    }

    try {
        return await apiHandler(req);
    } catch(e) {
        return await send(res, 500, e.message);
    }
};

module.exports = cors({ allowHeaders: ["*"] })(handler);