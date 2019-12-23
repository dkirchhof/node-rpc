export function createHash(str: string) {
    let h = 5381;
    let i = str.length;

    while (i) {
        h = (h * 33) ^ str.charCodeAt(--i);
    }

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return h >>> 0;
}
