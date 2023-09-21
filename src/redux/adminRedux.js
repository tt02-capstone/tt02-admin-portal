import { userApi, adminApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createAdmin(admin) {

  try {
    const response = await adminApi.post(`/createStaff`, admin);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function getAllAdmin() {

  try {
    const response = await adminApi.get(`/getAllAdmin`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function editProfile(editedUser) {

  try {
    const response = await adminApi.put(`/editProfile`, editedUser);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function editPassword(userId, oldPassword, newPassword) {

  try {
    const response = await userApi.put(`/editPassword/${userId}/${oldPassword}/${newPassword}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function getPendingApplications() {

  try {
    const response = await adminApi.get(`/getPendingApplications`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function updateApplicationStatus(vendorId, applicationStatus) {

  try {
    const response = await adminApi.put(`/updateApplicationStatus/${vendorId}/${applicationStatus}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function passwordResetStageOne(email) {
  try {
    const response = await adminApi.post(`/passwordResetStageOne/${email}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function passwordResetStageTwo(email, otp) {
  try {
    const response = await adminApi.post(`/passwordResetStageTwo/${email}/${otp}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }

}

export async function passwordResetStageThree(email, password) {

  try {
    const response = await adminApi.post(`/passwordResetStageThree/${email}/${password}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("vendorStaffRedux verifyEmail Error : ", error);
    return {status: false, data: error.message};
  }
}