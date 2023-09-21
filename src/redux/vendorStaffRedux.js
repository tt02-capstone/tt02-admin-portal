import { userApi, vendorStaffApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllVendorStaff() {

  try {
    const response = await vendorStaffApi.get(`/getAllVendorStaff`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
  
}