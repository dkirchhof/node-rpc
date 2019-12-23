import { ISerializer } from "../types/serializer";


/**
 * Creates a form data object with param index as key and a json string or file / filelist as value.
 */
export const jsonFormDataSerializer: ISerializer = {
    contentType: "application/x-www-form-urlencoded",
    serialize: params => {
        const data = new FormData();

        const undefinedReplacer = (_: string, v: any) => v === undefined ? null : v;

        params.forEach((p, i) => {
            const key = i.toString();

            if (p instanceof FileList) {
                if (p.length === 0) {
                    data.append(key, "null");
                } else {
                    [...p].forEach(file => data.append(key, file));
                }
            }
            else if (p instanceof File) {
                data.append(key, p);
            }
            else {
                data.append(key, JSON.stringify(p, undefinedReplacer));
            }
        });

        return data;
    },
};
