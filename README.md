# node-rpc
Communicate between your browser and a nodejs application in a typesafe way.

## Usage

### common

Define an interface for your api which is accessable in your client and server source code (e.g by using yarn workspaces):
```ts
interface IApi {
    add: (a: number, b: number) => number;
    subtract: (a: number, b: number) => number;

    toUpperCase: (str: string) => string;
}
```

### server

Create the implementation of the api interface on your server:
```ts
const api: IApi = {
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    
    toUpperCase: (str: string) => str.toUpperCase(),
};
```

Connect something like express with the rpc api wrapper:
```ts
import { handleAPIRequest } from "@node-rpc/server";

app.post("/rpc", aync (req, res) => {
    try {
        const result = await handleAPIRequest(req, api);
        res.send(result);
    } catch(e) {
        return await res.send(res, 500, e.message);
    }
});
```

### client

Create rpc api wrapper for your client:
```ts
import { API } from "@node-rpc/client";

const api = new API<IApi>("http://localhost:3000");
```

Call a remote procedure:
```ts
const result = await api.createRequest("subtract", 11, 4).call();

switch(result.type) {
    case "fail": {
        console.log("error", result.code, result.error);
        break;
    }
    case "success": {
        console.log("success", result.code, result.data);
        break;
    }
}
```

## Progress
If you want to show a progress bar during a request, just pass an onProgress callback.

## Supported data types
As the library will convert most of the params to JSON, it is only possible to use simple types like numbers, strings, booleans and arrays of them. Objects with these types are possible as well. Undefined values will be converted to null.  
It is also possible to send files / file lists to the server, but they must be passed as separate arguments. Example: 
```ts
const userData: { firstname: "John", lastname: "Doe" };
const userImage = document.getElementById("fileChooser").files[0];

api.createRequest("createUser", userData, userImage).call();
```

## Caching
The library includes some caching mechanisms to improve the overall performance of your app:

1. `api.createRequest(...).call()` wouldn't cache anything.

1. `api.createRequest(...).callCached({ cacheTime: 60_000 }` will save a successfull response. If the same procedure with the same params will be called within the next minute (60_000 ms), it will return the last response directly without sending a request to the server.

1. `api.createRequest(...).callMaybe({ cacheTime: 60_000 })` will only save the timestamp of a successfull response (no data). If the same procedure with the same params will be called within the next minute, it will do nothing. This is usefull, if you use your own store to save data.

:exclamation:
The callCached and callMaybe functions use their own cache. So don't be confused, if you mix both functions for the same remote procedure.
