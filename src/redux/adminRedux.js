import { userApi, adminApi } from "./api";

export async function createAdmin(admin) {
    console.log("Enter createAdmin function");
    console.log(admin);
    return await adminApi.post(`/createStaff`, admin)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        console.log('failure in adminRedux :: createAdmin')
        return {status: false, data: response.data};
      } else { // success
        console.log("success in adminRedux :: createAdmin");
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("adminRedux createAdmin Error : ", error);
    });
  }

export async function getAllAdmin() {
  console.log("Enter getAllAdmin function");
  return await adminApi.get(`/getAllAdmin`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: getAllAdmin')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: getAllAdmin");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("adminRedux getAllAdmin Error : ", error);
  });
}

export async function editProfile(edittedUser) {
  console.log("Enter editProfile function");
  return await adminApi.put(`/editProfile`, edittedUser)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: editProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: editProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("adminRedux editProfile Error : ", error);
  });
}

export async function editPassword(userId, oldPassword, newPassword) {
  console.log("Enter editPassword function");
  return await userApi.put(`/editPassword/${userId}/${oldPassword}/${newPassword}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: editPassword')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: editPassword");
      return {status: true, data: response.data};
    }
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
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        return { status: false, data: response.data };
      } else {
        return { status: true, data: response.data };
      }
    })
    .catch((error) => {
      console.error("AdminRedux passwordResetStageOne Error : ", error);
    });
}

export async function passwordResetStageTwo(email, otp) {
  return await adminApi.post(`/passwordResetStageTwo/${email}/${otp}`)
      .then((response) => {
          if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
              return { status: false, data: response.data };
          } else {
              return { status: true, data: response.data };
          }
      })
      .catch((error) => {
          console.error("AdminRedux passwordResetStageTwo Error : ", error);
      });
}

export async function passwordResetStageThree(email, password) {
  return await adminApi.post(`/passwordResetStageThree/${email}/${password}`)
      .then((response) => {
          if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
              return { status: false, data: response.data };
          } else {
              return { status: true, data: response.data };
          }
      })
      .catch((error) => {
          console.error("AdminRedux passwordResetStageThree Error : ", error);
      });
}