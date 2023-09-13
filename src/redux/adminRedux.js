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
  try {
    const response = await axios.get(`${staffURL}/getPendingApplications`);
    if (response.data != []) {
      return response.data;
    }
  } catch (error) {
    console.error("AdminRedux getPendingApplications Error : ", error);
  }
}

export async function updateApplicationStatus(vendorId, applicationStatus) {
  await axios.put(`${staffURL}/updateApplicationStatus/${vendorId}/${applicationStatus}`)
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