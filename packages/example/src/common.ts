export interface IApi {
    add: (a: number, b: number) => number;
    subtract: (a: number, b: number) => number;

    toLocaleString: (num: number) => string;
}
