import { userApi, touristApi } from "./api";

export async function getAllTourist() {
  console.log("Enter getAllTourist function");
  return await touristApi.get(`/getAllTourist`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in touristRedux :: getAllTourist')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in touristRedux :: getAllTourist");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("touristRedux getAllTourist Error : ", error);
  });
}