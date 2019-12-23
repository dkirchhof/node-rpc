import { axiosXHR, createClient, createProxyClient, jsonSerializer } from "@node-rpc/client";
import { IApi } from "./common";

const proxyApi = createProxyClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
});

const nonproxyApi = createClient<IApi>({
    endpoint: "http://localhost:3000",
    serializer: jsonSerializer,
    xhr: axiosXHR,
});

async function test() {
    console.log(await proxyApi.add(3, 4).call({ cache: { time: 60000, saveResponse: false } })); // 7
    console.log(await proxyApi.add(3, 4).call({ cache: { time: 60000, saveResponse: false } })); // no call

    console.log(await nonproxyApi.createRequest("toUpperCase", "test").call({ cache: { time: 60000, saveResponse: false } })); // TEST
    console.log(await nonproxyApi.createRequest("toUpperCase", "test").call({ cache: { time: 60000, saveResponse: false } })); // no call
}

test();
