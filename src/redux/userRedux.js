import { userApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function uploadNewProfilePic(user) {

  try {
    const response = await userApi.put(`/uploadNewProfilePic`, user);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function toggleUserBlock(userId) {

  try {
    const response = await userApi.put(`toggleBlock/${userId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function viewUserProfile(userId) {

  try {
    const response = await userApi.get(`/viewUserProfile/${userId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}