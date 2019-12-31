import { axiosXHR, createClient, createFallbackClient, jsonSerializer } from "@node-rpc/client";
import { IApi } from "./common";

const api = createClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
});

const fallbackApi = createFallbackClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
});

async function test() {
    console.log(await api.add(3, 4).call({ cache: { time: 60000, saveResponse: false } })); // 7
    console.log(await api.add(3, 4).call({ cache: { time: 60000, saveResponse: false } })); // no call

    console.log(await fallbackApi.createRequest("toUpperCase", "test").call({ cache: { time: 60000, saveResponse: false } })); // TEST
    console.log(await fallbackApi.createRequest("toUpperCase", "test").call({ cache: { time: 60000, saveResponse: false } })); // no call
}

test();
