# node-rpc

> A typesafe xhr library for your browser and nodejs applications.
This library is splitted into two packages. One for the [client / sender](https://www.npmjs.com/package/@node-rpc/client) and one for the [server / receiver](https://www.npmjs.com/package/@node-rpc/server).

## Usage

### Common

1. Define an interface for your api which is accessable in your client and server source code (e.g. by using yarn workspaces).  
    ```ts
    interface IApi {
        add: (a: number, b: number) => number;
        subtract: (a: number, b: number) => number;

        toUpperCase: (str: string) => string;
    }
    ```

### Client

1. Install package:

    ```sh
    yarn add @node-rpc/client
    ```

1. Create the client instance with following options:

    - `endpoint`: Url of the server
    - `serializer`: A serializer, which will convert the function params into an xhr compatible format. The serializer should match the deserializer of the server. Please find more information [here](#serialization). 
    - `xhr`: A function, which will create and send the request. Please find more information [here](#sending-a-request).
    - `auth`: A function, which will inject a string to the authorization header.

    ```ts
    import { createClient } from "@node-rpc/client";
    import { jsonSerializer } from "@node-rpc/client/dist/serializers/jsonSerializer";
    import { axiosXHR } from "@node-rpc/client/dist/xhr/axios";
    import { IApi } from "./common.ts";

    const api = createClient<IApi>({
        endpoint: "http://localhost:3000",
        serializer: jsonSerializer,
        xhr: axiosXHR,
        auth: () => "secret",
    });
    ```

1. Call a remote procedure:

    ```ts
    const response = await api.subtract(11, 4).call();

    switch (response.type) {
        case "fail": {
            console.log("error", response.code, response.error);
            break;
        }
        case "noResponse": {
            console.log("no response");
            break;
        }
        case "success": {
            console.log("success", response.code, response.data);
            break;
        }
    }
    ```

    You can pass some options of the following shape:

    ```ts
    { 
        onDownloadProgress?: (progress: number) => void;
        onUploadProgress?: (progress: number) => void;
        cache?: {
            time: number;
            saveResponse: boolean;
        };
    }
    ```

    - `onDownloadProgress` / `onUploadProgress`: Use these callbacks to get the current progress as a number between 0 and 1.
    - `cache`: If you want to cache a successfull request, use the following options:
        - `time`: The time in ms, how long a request should be cached.
        - `saveResponse`: If you want to save the responses by yourself, set this option to false. A cached response will have the type `noResponse` instead of `success` or `failed`.

    The shape of a response depends on the successfulnes and the options of a request. Check the `type` first, to get a meaningful result:
    
    - `fail`: If a request fails, it will have an http status `code` and an `error` message.
    - `success`: A successful request will have an http status `code` and a `data` property. A cached request with the `saveResponse` option set to true will also return a response of this type.
    - `noResponse`: A cached request with `saveResponse` option set to false will return nothing else.

### :exclamation: Fallback client

The normal client uses es6 proxies, so it's not compatible with older browsers like internet explorer (https://caniuse.com/#feat=proxy). There is a fallback interface which doesn't rely on proxies. To use it, make following changes in your client code:

```diff
-import { axiosXHR, createClient, jsonSerializer } from "@node-rpc/client";
+import { axiosXHR, createFallbackClient, jsonSerializer } from "@node-rpc/client";
import { IApi } from "./common.ts";

-const api = createClient<IApi>({
+const api = createFallbackClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
});
```

```diff
-const response = await api.subtract(11, 4).call();
+const response = await api.createRequest("subtract", 11, 4).call();
```

### Server

1. Install package:

    ```sh
    yarn add @node-rpc/server
    ```

1. Create the implementation of the api interface on your server.  

    ```ts
    import { IApi } from "./common.ts";

    const api: IApi = {
        add: (a: number, b: number) => a + b,
        subtract: (a: number, b: number) => a - b,
        
        toUpperCase: (str: string) => str.toUpperCase(),
    };
    ```

1. Create the server instance with following options:

    - `api`: The api implementation 
    - `deserializer`: A deserializer, which will convert the request body to an array of params. Please find more information [here](#serialization).

    ```ts
    import { createServer } from "@node-rpc/server";
    import { jsonDeserializer } from "@node-rpc/server/dist/deserializers/jsonDeserializer";

    const rpcServer = createServer({
        api,
        deserializer: jsonDeserializer,
    });
    ```

1. Use the `handleAPIRequest` function of the server instance to map a request to the api function call:

    ```ts
    import { IncomingMessage, ServerResponse } from "http";

    const request = (req: IncominMessage, res: ServerResponse) => {
        try {
            // get the authorization token
            const token = req.headers.authorization;
            console.log(token);

            // call api function
            const result = await rpcServer.handleAPIRequest(req, api);

            // send the result back to the client
            res.send(result);
        } catch(e) {
            return await res.send(res, 500, e.message);
        }
    };

    // add it as a route in express
    // => app.post("/", request)

    // or export it as default function for micro
    // => export default request
    ```

## Serialization

To send data from the client to the server, all params will be serialized. So the deserializer must obviously match the serializer. There are two predefined serializers / deserializers in this library:

- `jsonSerializer` / `jsonDeserializer`: The params will be converted to an array and serialized to a JSON string. You have to install the [co-body](https://www.npmjs.com/package/co-body) package for the server to use it. 
- `jsonFormDataSerializer` / `jsonFormDataDeserializer`: The params will be wrapped in a FormData object with their index as the key and the real value if it's a File / FileList or a JSON string as the value. Files have to be passed as seperate params and shouldn't be nested into other objects. You have to install the [formidable](https://www.npmjs.com/package/formidable) package for the server to use it.

### Custom serializer

You can build your own serializers for example to support more complex data. Just create an object, which implements the `ISerializer` interface.

```ts
export interface ISerializer {
    contentType: string;
    serialize: (params: any[]) => any;
}
```

### Custom deserializer

You can build your own deserializers as well. Just create an object, which implements the `IDeserializer` interface.

```ts
export interface IDeserializer {
    deserialize: (req: IncomingMessage) => Promise<{ params: any[]; filePaths: string[]; }>;
}
```

## Sending a request

You have to tell the rpc client, how it should send a request to the server. It could use the old `XMLHttpRequest`, the new `Fetch API` or any other third party library. There are two implementations included:

- `fetchXHR`: This xhr function uses the native [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) api. It can't track the progress of a request.
- `axiosXHR`: This xhr function uses the [axios](https://www.npmjs.com/package/axios) package, so you have to install it for the client. It has the advantage over the native browser api, that it can track the download and upload progress.

### Custom xhr function

You can implement your own xhr functions, if you don't want to rely on the native fetch api or on axios. The `XHRFunction` type defines, how it should look like.

```ts
export interface IXHROptions {
    endpoint: string;
    procedure: string | number | symbol;
    data: string;
    contentType: string;

    onDownloadProgress: ProgressCallback;
    onUploadProgress: ProgressCallback;
}

export type XHRFunction = (options: IXHROptions) => Promise<ISuccess | IFail>;
```
