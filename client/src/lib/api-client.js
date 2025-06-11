import axios from "axios";
import { HOST } from "@/utils/constants";

// eslint-disable-next-line no-unused-vars
export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true
})
    