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

export async function updateLocalWallet(vendorId, updateAmount) {

  try {
    const response = await localApi.put(`/updateWallet/${vendorId}/${updateAmount}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("local Redux Error : ", error);
    return {status: false, data: error.message};
  }
  
}

export async function getLocalWalletHistory(localId) {

  try {
    const response = await localApi.get(`/getWalletHistory/${localId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("local Redux Error : ", error);
    return {status: false, data: error.message};
  }
  
}