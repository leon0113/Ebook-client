import axios from "axios";
// https://ebook-server-livid.vercel.app
const client = axios.create({
    baseURL: "http://localhost:8001",
});

client.interceptors.request.use(function (config) {
    config.withCredentials = true;
    return config;
}
)

export default client;