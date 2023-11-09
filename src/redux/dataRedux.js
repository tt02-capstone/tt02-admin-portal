import {dataApi} from "./api";
import {handleApiErrors} from "../helper/errorCatching";


export async function getData(vendor_id) {
    try {
        const response = await dataApi.get(`/getData/${vendor_id}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getPlatformData(data_usecase, start_date, end_date) {
    try {
        console.log(data_usecase, start_date, end_date)
        const requestBody = {
            'start_date': start_date,
            'end_date': end_date
        };
        const response = await dataApi.post(`/getPlatformData/${data_usecase}`, requestBody);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function subscribe(user_id, user_type, subscription_type, auto_renew) {
    try {
        const response = await dataApi.post(`/subscribe/${user_id}/${user_type}/${subscription_type}/${auto_renew}`);
        console.log(response)
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getSubscription(vendor_id, user_type) {
    try {
        const response = await dataApi.get(`/getSubscription/${vendor_id}/${user_type}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function renewSubscription(vendor_id, user_type, subscription_type, auto_renew) {
    try {
        const response = await dataApi.put(`/subscribe/${vendor_id}/${user_type}/${subscription_type}/${auto_renew}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function updateSubscription(vendor_id, user_type, subscription_type, auto_renew) {
    try {
        const response = await dataApi.put(`/subscribe/${vendor_id}/${user_type}/${subscription_type}/${auto_renew}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function unsubscribe(subscription_id) {
    try {
        const response = await dataApi.delete(`/cancelSubscription/${subscription_id}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}


export async function getSubscriptionStatuses(user_type) {
    try {
        const response = await dataApi.get(`/getSubscriptionStatuses/${user_type}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("Error : ", error);
        return {status: false, data: error.message};
    }
}