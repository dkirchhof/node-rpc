import { createClient, createFallbackClient } from "@node-rpc/client";
import { jsonSerializer } from "@node-rpc/client/dist/serializers/jsonSerializer";
import { axiosXHR } from "@node-rpc/client/dist/xhr/axios";
import { IApi } from "./common";

const token = "secret";

const api = createClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
    getAuth: () => token, 
});

const fallbackApi = createFallbackClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
    getAuth: () => token, 
});

async function test() {
    console.log(await api.add(3, 4).call({ cache: { time: 60000, saveResponse: false } })); // 7
    console.log(await api.add(3, 4).call({ cache: { time: 60000, saveResponse: false } })); // no call

    console.log(await fallbackApi.createRequest("toUpperCase", "test").call({ cache: { time: 60000, saveResponse: false } })); // TEST
    console.log(await fallbackApi.createRequest("toUpperCase", "test").call({ cache: { time: 60000, saveResponse: false } })); // no call
}

test();
