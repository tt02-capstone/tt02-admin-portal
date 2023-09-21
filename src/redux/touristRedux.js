import { userApi, touristApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllTourist() {

  try {
    const response = await touristApi.get(`/getAllTourist`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}