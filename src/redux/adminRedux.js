import axios from "axios";

const staffURL = "http://localhost:8080/staff";

export async function createAdmin(admin) {
    console.log("Enter createAdmin function");
    console.log(admin);
    return await axios.post(`${staffURL}/createStaff`, admin)
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
      console.error("AdminRedux createAdmin Error : ", error);
    });
}

export async function getAllStaff() {
  console.log("Enter getAllStaff function");
  return await axios.get(`${staffURL}/getAllStaff`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: getAllStaff')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: getAllStaff");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("AdminRedux getAllStaff Error : ", error);
  });
}

export async function getAdminProfile(staffId) {
  console.log("Enter getAdminProfile function");
  return await axios.get(`${staffURL}/getStaffProfile/${staffId}`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: getAdminProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: getAdminProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("AdminRedux getAdminProfile Error : ", error);
  });
}

export async function editAdminProfile(editedStaffProfile) {
  console.log("Enter editAdminProfile function");
  return await axios.put(`${staffURL}/editStaffProfile`, editedStaffProfile)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: editAdminProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: editAdminProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("AdminRedux editAdminProfile Error : ", error);
  });
}

export async function editAdminPassword(staffId, oldPassword, newPassword) {
  console.log("Enter editAdminProfile function");
  return await axios.put(`${staffURL}/editUserPassword/${staffId}/${oldPassword}/${newPassword}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in adminRedux :: editAdminPassword')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in adminRedux :: editAdminPassword");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("AdminRedux editAdminProfile Error : ", error);
  });
}