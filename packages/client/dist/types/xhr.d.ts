import { ProgressCallback } from "./progressCallback";
import { IFail, ISuccess } from "./response";
export interface IXHROptions {
    endpoint: string;
    procedure: string | number | symbol;
    data: string;
    contentType: string;
    onDownloadProgress: ProgressCallback;
    onUploadProgress: ProgressCallback;
}
export declare type XHRFunction = (options: IXHROptions) => Promise<ISuccess | IFail>;
