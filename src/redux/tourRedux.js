import { tourApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllTourTypesCreated() {
    try {
        const response = await tourApi.get(`/getAllTourTypesCreated`);
        console.log(response);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAllTourTypesCreated Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getTourTypeByTourTypeId(tourTypeId) {
    try {
        const response = await tourApi.get(`/getTourTypeByTourTypeId/${tourTypeId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getTourTypeByTourTypeId Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getAttractionForTourTypeId(tourTypeId) {
    try {
        const response = await tourApi.get(`/getAttractionForTourTypeId/${tourTypeId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAttractionForTourTypeId Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function adminUpdateTourType(tourTypeIdToUpdate, newPublishedStatus) {
    try {
        const response = await tourApi.put(`/adminUpdateTourType/${tourTypeIdToUpdate}/${newPublishedStatus}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux adminUpdateTourType Error : ", error);
        return { status: false, data: error.message };
    }
}