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

export async function updateVendorWallet(vendorId, updateAmount) {

  try {
    const response = await vendorApi.put(`/updateWallet/${vendorId}/${updateAmount}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorsRedux Error : ", error);
    return {status: false, data: error.message};
  }
  
}

export async function getVendorWalletHistory(vendorId) {

  try {
    const response = await vendorApi.get(`/getWalletHistory/${vendorId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorsRedux Error : ", error);
    return {status: false, data: error.message};
  }
  
}