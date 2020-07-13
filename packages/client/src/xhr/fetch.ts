import { XHRFunction } from "../types/xhr";

const getData = (response: Response) => {
    const contentType = response.headers.get("content-type");

    if (!contentType) {
        throw new Error("Can't determine content type.");
    }

    if (contentType.includes("text/html")) {
        return response.text();
    }

    if (contentType.includes("application/json")) {
        return response.json();
    }

    throw new Error(`Content type "${contentType}" not implemented.`);
};

export const fetchXHR: XHRFunction = async options => {
    const config: RequestInit = {
        method: "post",
        headers: {
            "X-RPC-Procedure": options.procedure.toString(),
            "Content-Type": options.contentType,
        },
        body: options.data,
    };

    try {
        const result = await fetch(options.endpoint, config);

        const data = await getData(result);

        if (!result.ok) {
            throw {
                data,
                status: result.status,
            }
        }

        return {
            type: "success",
            code: result.status,
            data,
        };
    }
    catch (e) {
        if (e.data) {
            return {
                type: "fail",
                code: e.status,
                error: e.data,
            };
        }

        // something went totally wrong
        return {
            type: "fail",
            code: 400,
            error: e.message,
        };
    }
};

