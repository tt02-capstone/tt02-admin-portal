import axios from "axios";

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

export const updateApiInstances = (token) => {
    const bearerToken = token?  `Bearer ${token}`: ``;
    console.log('Bearer Token', bearerToken)
    localApi.defaults.headers.common['Authorization'] = bearerToken
    adminApi.defaults.headers.common['Authorization'] = bearerToken
    bookingApi.defaults.headers.common['Authorization'] = bearerToken
    vendorStaffApi.defaults.headers.common['Authorization'] = bearerToken
    touristApi.defaults.headers.common['Authorization'] = bearerToken

}