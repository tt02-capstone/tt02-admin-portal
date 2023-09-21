import { userApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function uploadNewProfilePic(user) {
  console.log("Enter uploadNewProfilePic function");
  return await userApi.put(`/uploadNewProfilePic`, user)
    .then((response) => {
      console.log('in userRedux :: uploadNewProfilePic')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("userRedux uploadNewProfilePic Error : ", error);
    });
}

export async function toggleUserBlock(userId) {
  console.log("Enter toggleUserBlock function");
  return await userApi.put(`toggleBlock/${userId}`)
    .then((response) => {
      console.log('in userRedux :: toggleBlock')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("userRedux toggleUserBlock Error : ", error);
    });
}

export async function viewUserProfile(userId) {
  console.log("Enter viewUserProfile function");
  return await userApi.get(`/viewUserProfile/${userId}`)
    .then((response) => {
      console.log('in userRedux :: viewUserProfile')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("userRedux viewUserProfile Error : ", error);
    });
}