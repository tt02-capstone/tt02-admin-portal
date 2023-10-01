import { accommodationApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const accommodationURL = "http://localhost:8080/accommodation";
export async function getLastAccommodationId() {
    try {
        const response = await accommodationApi.get(`${accommodationURL}/getLastAccommodationId`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux getLastAccommodationId Error: ", error);
        return { status: false, data: error.message };
    }
}

export async function getAllAccommodations() {
    try {
        const response = await accommodationApi.get(`getAllAccommodations`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux getLastAccommodationId Error: ", error);
        return { status: false, data: error.message };
    }
}

export async function createRoomListExistingAccommodation(accommodationId, roomList) {
    try {
        const response = await accommodationApi.post(`${accommodationURL}/createRoomListExistingAccommodation/${accommodationId}`, roomList);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux createRoomListExistingAccommodation Error : ", error);
        return {status: false, data: error.message};
    }
}


export async function createRoom(accommodationId, room) {
    try {
        const response = await accommodationApi.post(`${accommodationURL}/createRoom/${accommodationId}`, room);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux createRoom Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getRoomListByAccommodation(accommodationId) {
    try {
        const response = await accommodationApi.get(`${accommodationURL}/getRoomListByAccommodation/${accommodationId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux getRoomListByAccommodation Error: ", error);
        return { status: false, data: error.message };
    }
}

export async function getAccommodationById(accommodationId) {
    try {
        const response = await accommodationApi.get(`${accommodationURL}/getAccommodation/${accommodationId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux getAccommodation Error: ", error);
        return { status: false, data: error.message };
    }
}

export async function getNumOf0AvailableRoomsListOnDateRange(id, startDate, endDate) {
    try {
        const response = await accommodationApi.get(`/getNumOf0AvailableRoomsListOnDateRange/${id}/${startDate}/${endDate}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("accommodationRedux getNumOf0AvailableRoomsListOnDateRange Error: ", error);
        return { status: false, data: error.message };
    }
}