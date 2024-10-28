import axios from "axios";

export const serverClient = axios.create({
  baseURL: "https://port-0-nabi-backend-m29e62geab88e174.sel4.cloudtype.app/",
});
