import { userApi, touristApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllTourist() {
  console.log("Enter getAllTourist function");
  return await touristApi.get(`/getAllTourist`)
    .then((response) => {
      console.log('in touristRedux :: getAllTourist')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("touristRedux getAllTourist Error : ", error);
    });
}