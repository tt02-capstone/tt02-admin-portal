import { userApi, adminApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function createAdmin(admin) {
  console.log("Enter createAdmin function");
  console.log(admin);
  return await adminApi.post(`/createStaff`, admin)
    .then((response) => {
      console.log('in adminRedux :: createStaff')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("adminRedux createAdmin Error : ", error);
    });
}

export async function getAllAdmin() {
  console.log("Enter getAllAdmin function");
  return await adminApi.get(`/getAllAdmin`)
    .then((response) => {
      console.log('in adminRedux :: getAllAdmin')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("adminRedux getAllAdmin Error : ", error);
    });
}

export async function editProfile(edittedUser) {
  console.log("Enter editProfile function");
  return await adminApi.put(`/editProfile`, edittedUser)
    .then((response) => {
      console.log('in adminRedux :: editProfile')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("adminRedux editProfile Error : ", error);
    });
}

export async function editPassword(userId, oldPassword, newPassword) {
  console.log("Enter editPassword function");
  return await userApi.put(`/editPassword/${userId}/${oldPassword}/${newPassword}`)
    .then((response) => {
      console.log('in adminRedux :: editPassword')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("adminRedux editPassword Error : ", error);
    });
}

export async function getPendingApplications() {
  return await adminApi.get(`/getPendingApplications`)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
        return response.data.errorMessage
      } else {
        return response.data;
      }
    })
    .catch((error) => {
      console.error("AdminRedux getPendingApplications Error : ", error);
    });
}

export async function updateApplicationStatus(vendorId, applicationStatus) {
  return await adminApi.put(`/updateApplicationStatus/${vendorId}/${applicationStatus}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
      return response.data.errorMessage
    } else {
      return response.data;
    }
  })
    .catch((error) => {
      console.error("AdminRedux updateApplicationStatus Error : ", error);
    });
}

export async function passwordResetStageOne(email) {
  return await adminApi.post(`/passwordResetStageOne/${email}`)
    .then((response) => {
      console.log('in adminRedux :: passwordResetStageOne')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("AdminRedux passwordResetStageOne Error : ", error);
    });
}

export async function passwordResetStageTwo(email, otp) {
  return await adminApi.post(`/passwordResetStageTwo/${email}/${otp}`)
    .then((response) => {
      console.log('in adminRedux :: passwordResetStageTwo')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("AdminRedux passwordResetStageTwo Error : ", error);
    });
}

export async function passwordResetStageThree(email, password) {
  return await adminApi.post(`/passwordResetStageThree/${email}/${password}`)
    .then((response) => {
      console.log('in adminRedux :: passwordResetStageThree')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("AdminRedux passwordResetStageThree Error : ", error);
    });
}