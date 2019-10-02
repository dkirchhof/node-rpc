```json
{
    "@types/micro": "^7.3.3",
    "@types/micro-cors": "^0.1.0",
    "micro": "^9.3.4",
    "micro-cors": "^0.1.1"
}
```

```ts
interface IApi {
    add: (a: number, b: number) => number;
    subtract: (a: number, b: number) => number;

    toUpperCase: (str: string) => string;
}
```

```ts
const api: Async<IApi> = {
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    
    toUpperCase: (str: string) => str.toUpperCase(),
};

const apiHandler = API(api);

const handler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'OPTIONS') {
        return send(res, 200, 'ok!');
    }

    try {
        return await apiHandler(req);
    } catch(e) {
        return await send(res, 500, e.message);
    }
};
```

```ts
import { API } from "../../client";
import { IApi } from "../common/IApi";

const api = API<IApi>("http://localhost:3000");

api.createRequest("subtract", 10, 4).call().then(r => { 
    if (r.type === "success") {
        console.log(r.data);
    }
});

api.call()("subtract", 10, 4).then(r => { 
    if (r.type === "success") {
        console.log(r.data);
    }
});

// api("subtract", 10, 4)
//     .onProgress(p => console.log("progress", p))
//     .onSuccess(r => console.log("success", r))
//     .onFailure(e => console.log("failure", e));

// api("toUpperCase", "hello world!")
//     .onSuccess(r => console.log(r))
    // .onFailure(e => console.log(e))
```
