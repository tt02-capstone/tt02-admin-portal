import { attractionApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAttractionList() {
    try {
        const response = await attractionApi.get(`/getAllAttraction`);
        if (response.data != []) {
            // console.log('success', response.data);
            return response.data;
        }    
    } catch (error) {
        console.error("Retrieve attraction list error!");
        return {status: false, data: error.message};
    }
}

export async function getAllTicketListedByAttractionInTimeRange(attractionId, startDate, endDate) {
    try {
        const response = await attractionApi.get(`/getAllTicketListedByAttractionInTimeRange/${attractionId}/${startDate}/${endDate}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("attractionManageTicketRedux getAllTicketListedByAttractionInTimeRange Error : ", error);
        return {status: false, data: error.message};
    }
}