import { telecomApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllTelecomList() {
  try {
    const response = await telecomApi.get(`/getAllTelecomList`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("telecomRedux getAllTelecomList Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getTelecomById(telecomId) {
  try {
    const response = await telecomApi.get(`/getTelecomById/${telecomId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("telecomRedux getTelecomById Error : ", error);
    return {status: false, data: error.message};
  }
}