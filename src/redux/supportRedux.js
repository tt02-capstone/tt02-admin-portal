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

export async function getAllSupportTicketsByAdmin(userId) {
    try {
        const response = await supportApi.get(`${supportTicketURL}/getAllSupportTicketsByAdmin/${userId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux getAllSupportTicketsByAdmin Error : ", error);
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

export async function updateSupportTicket(supportTicketId, supportTicketObj) {
    try {
        const response = await supportApi.put(`/updateSupportTicket/${supportTicketId}`, supportTicketObj);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux updateSupportTicket Error : ", error);
        return {status: false, data: error.message};
    };
}

export async function updateSupportTicketStatus(supportTicketId) {
    try {
        const response = await supportApi.put(`/updateSupportTicketStatus/${supportTicketId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux updateSupportTicketStatus Error : ", error);
        return {status: false, data: error.message};
    };
}

export async function getAllRepliesBySupportTicket(supportTicketId) {
    try {
        const response = await supportApi.get(`${supportTicketURL}/getAllRepliesBySupportTicket/${supportTicketId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux getAllRepliesBySupportTicket Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getReplyById(replyId) {
    try {
        const response = await supportApi.get(`${supportTicketURL}/getReplyById/${replyId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux getReplyById Error : ", error);
        return {status: false, data: error.message};
    };
}


export async function createReply(userId, supportTicketId, replyObj) {
    try {
        const response = await supportApi.post(`/createReply/${userId}/${supportTicketId}`, replyObj);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux createReply Error : ", error);
        return {status: false, data: error.message};
    };
}

export async function updateReply(replyId, replyObj) {
    try {
        const response = await supportApi.put(`/updateReply/${replyId}`, replyObj);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux updateReply Error : ", error);
        return {status: false, data: error.message};
    };
}

export async function deleteReply(supportTicketId, replyId) {
    try {
        const response = await supportApi.delete(`/deleteReply/${supportTicketId}/${replyId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux deleteReply Error : ", error);
        return {status: false, data: error.message};
    }
}

export async function getUserAvatarImage(userId) {
    try {
        const response = await supportApi.get(`${supportTicketURL}/getUserAvatarImage/${userId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("supportRedux getUserAvatarImage Error : ", error);
        return {status: false, data: error.message};
    };
}
