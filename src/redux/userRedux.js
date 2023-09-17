import { userApi } from "./api";

export async function toggleUserBlock(userId) {
    console.log("Enter toggleUserBlock function");
    return await userApi.put(`toggleBlock/${userId}`)
    .then((response) => {
      console.log(response);
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
        console.log('failure in userRedux :: toggleUserBlock')
        return {status: false, data: response.data};
      } else { // success
        console.log("success in userRedux :: toggleUserBlock");
        return {status: true, data: response.data};
      }
    })
    .catch((error) => {
      console.error("userRedux toggleUserBlock Error : ", error);
    });
}

export async function viewUserProfile(userId) {
  console.log("Enter viewUserProfile function");
  return await userApi.get(`/viewUserProfile/${userId}`)
  .then((response) => {
    console.log(response);
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in userRedux :: viewUserProfile')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in userRedux :: viewUserProfile");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("userRedux viewUserProfile Error : ", error);
  });
}