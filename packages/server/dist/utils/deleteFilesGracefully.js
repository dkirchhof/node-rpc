"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function deleteFilesGracefully(paths) {
    paths.forEach(path => fs_1.unlink(path, () => { }));
}
exports.deleteFilesGracefully = deleteFilesGracefully;
