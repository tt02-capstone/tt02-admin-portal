import { userApi, localApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllLocal() {
  console.log("Enter getAllLocal function");
  return await localApi.get(`/getAllLocal`)
    .then((response) => {
      console.log('in localRedux :: getAllLocal')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("localRedux getAllLocal Error : ", error);
    });
}