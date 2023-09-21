import { userApi, localApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllLocal() {

  try {
    const response = await localApi.get(`/getAllLocal`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}