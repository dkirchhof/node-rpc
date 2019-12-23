export interface ISerializer {
    contentType: string;
    serialize: (params: any[]) => any;
}
