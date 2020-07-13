import Axios, { AxiosRequestConfig } from "axios";

import { XHRFunction } from "../types/xhr";
import { ProgressCallback } from "../types/progressCallback";

export const axiosXHR: XHRFunction = async options => {
    const onProgress = (callback: ProgressCallback) => (event: any) => callback(event.loaded / event.total);

    const config: AxiosRequestConfig = {
        url: options.endpoint,
        method: "post",
        headers: {
            "Authorization": options.auth,
            "Content-Type": options.contentType,
            "X-RPC-Procedure": options.procedure,
        },
        data: options.data,
        onDownloadProgress: onProgress(options.onDownloadProgress),
        onUploadProgress: onProgress(options.onUploadProgress),
    };

    try {
        const result = await Axios.request(config);

        return {
            type: "success",
            code: result.status,
            data: result.data,
        };
    }
    catch (e) {
        // error response
        if (e.response) {
            return {
                type: "fail",
                code: e.response.status,
                error: e.response.data,
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
