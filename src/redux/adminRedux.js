import axios from "axios";

const staffURL = "http://localhost:8080/staff";

export async function createAdmin(admin) {
  console.log(admin);
  await axios.post(`${staffURL}/createStaff`, admin)
    .then((response) => {
      if (response.data.httpStatusCode === 400) { // error
        console.log('fail')
        return false;
      } else { // success
        console.log("success in adminRedux");
        return true;
      }
    })
    .catch((error) => {
      console.error("AdminRedux createAdmin Error : ", error);
    });
}

export async function getPendingApplications() {
  return await axios.get(`${staffURL}/getPendingApplications`)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
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
  return await axios.put(`${staffURL}/updateApplicationStatus/${vendorId}/${applicationStatus}`)
    .then((response) => {
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
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
  return await axios.post(`${staffURL}/passwordResetStageOne/${email}`)
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
  return await axios.post(`${staffURL}/passwordResetStageTwo/${email}/${otp}`)
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
  return await axios.post(`${staffURL}/passwordResetStageThree/${email}/${password}`)
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