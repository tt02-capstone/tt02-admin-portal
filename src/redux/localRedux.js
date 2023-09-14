import { userApi, localApi } from "./api";

export async function getAllLocal() {
  console.log("Enter getAllLocal function");
  return await localApi.get(`/getAllLocal`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in localRedux :: getAllLocal')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in localRedux :: getAllLocal");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("localRedux getAllLocal Error : ", error);
  });
}