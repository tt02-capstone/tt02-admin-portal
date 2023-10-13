import { supportApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const supportTicketURL = "http://localhost:8080/supportTicket";

export async function getAllSupportTickets() {
    try {
        const response = await supportApi.get(`${supportTicketURL}/getAllSupportTickets`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux getAllSupportTickets Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getSupportTicket(supportTicketId) { 
    try {
        const response = await supportApi.get(`${supportTicketURL}/getSupportTicket/${supportTicketId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux getSupportTicket Error : ", error);
        return { status: false, data: error.message };
    }
}