import axios from "axios";
import {TOKEN_KEY} from "./AuthContext";

const HOST = 'localhost'
const HOST_WITH_PORT = `http://${HOST}:8080`

export const userApi = axios.create({
    baseURL: HOST_WITH_PORT + '/user'
})

export const adminApi = axios.create({
    baseURL: HOST_WITH_PORT + '/admin'
})

export const touristApi = axios.create({
    baseURL: HOST_WITH_PORT + '/tourist'
})

export const localApi = axios.create({
    baseURL: HOST_WITH_PORT + '/local'
})

export const vendorStaffApi = axios.create({
    baseURL: HOST_WITH_PORT + '/vendorStaff'
})

export const bookingApi = axios.create({
    baseURL: HOST_WITH_PORT + '/booking'
})

export const accommodationApi = axios.create({
    baseURL: HOST_WITH_PORT + '/accommodation'
})

export const telecomApi = axios.create({
    baseURL: HOST_WITH_PORT + '/telecom'
})

export const dealsApi = axios.create({
    baseURL: HOST_WITH_PORT + '/deal'
})

export const restaurantApi = axios.create({
    baseURL: HOST_WITH_PORT + '/restaurant'
})

export const tourApi = axios.create({
    baseURL: HOST_WITH_PORT + '/tour'
})

export const attractionApi = axios.create({
    baseURL: HOST_WITH_PORT + '/attraction'
})

export const categoryApi = axios.create({
    baseURL: HOST_WITH_PORT + '/category'
})

export const categoryItemApi = axios.create({
    baseURL: HOST_WITH_PORT + '/categoryItem'
})

export const postApi = axios.create({
    baseURL: HOST_WITH_PORT + '/post'
})

export const supportApi = axios.create({
    baseURL: HOST_WITH_PORT + '/supportTicket'
})

export const vendorApi = axios.create({
    baseURL: HOST_WITH_PORT + '/vendor'
})

export const commentApi = axios.create({
    baseURL: HOST_WITH_PORT + '/comment'
})

export const reportApi = axios.create({
    baseURL: HOST_WITH_PORT + '/report'
})

export const badgeApi = axios.create({
    baseURL: HOST_WITH_PORT + '/badge'
})


export const dataApi = axios.create({
    baseURL: HOST_WITH_PORT + '/data'
})

const instanceList = [userApi, localApi, adminApi, bookingApi, vendorStaffApi, touristApi, telecomApi, restaurantApi, dealsApi, tourApi, accommodationApi, attractionApi, categoryApi, categoryItemApi, postApi, supportApi, vendorApi, commentApi, reportApi, badgeApi, dataApi]


instanceList.map((api) => {
    api.interceptors.request.use( (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        console.log(token)
        config.headers.Authorization =  token ? `Bearer ${token}` : '';
        return config;
    });
})


const refreshToken = async () => {
    try {
        const resp = await userApi.get("/refreshToken");
        return resp.data;
    } catch (e) {
        console.log("Error",e);
    }
};

instanceList.map((api) => {
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
            //403 Network error does not return status code so -> using !error.status instead
            if (!error.status && !originalRequest._retry) {
                originalRequest._retry = true;
                const resp = await refreshToken();
                if (resp === undefined) {
                    return api(originalRequest);
                }
                const newToken = resp.refreshToken;
                console.log("Refresh token", newToken)

                localStorage.setItem(TOKEN_KEY, newToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                return api(originalRequest);
            }
            return Promise.reject(error);
        }
    );
})