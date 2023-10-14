import { userApi, vendorApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllVendors() {

  try {
    const response = await vendorApi.get(`/getAllVendors`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorsRedux Error : ", error);
    return {status: false, data: error.message};
  }
  
}