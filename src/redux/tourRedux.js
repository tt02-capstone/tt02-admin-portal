import { tourApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllTourTypesCreated() {
    try {
        const response = await tourApi.get(`/getAllTourTypesCreated`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("tourRedux getAllTourTypesCreated Error : ", error);
        return { status: false, data: error.message };
    }
}