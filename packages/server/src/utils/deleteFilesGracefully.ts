import { unlink } from "fs";

export function deleteFilesGracefully(paths: string[]) {
    paths.forEach(path => unlink(path, () => { }));
}
