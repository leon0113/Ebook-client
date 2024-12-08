import axios from "axios";
// https://ebook-server-livid.vercel.app
//http://localhost:8001
const client = axios.create({
    baseURL: "https://ebook-server-livid.vercel.app",
});

client.interceptors.request.use(function (config) {
    config.withCredentials = true;
    return config;
}
)

export default client;