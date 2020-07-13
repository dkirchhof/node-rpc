import { ProgressCallback } from "./progressCallback";
import { IFail, ISuccess } from "./response";

export interface IXHROptions {
    endpoint: string;
    procedure: string | number | symbol;
    data: string;
    contentType: string;
    auth: string;

    onDownloadProgress: ProgressCallback;
    onUploadProgress: ProgressCallback;
}

export type XHRFunction = (options: IXHROptions) => Promise<ISuccess | IFail>;
