import { userApi, vendorStaffApi } from "./api";

export async function getAllVendorStaff() {
  console.log("Enter getAllVendorStaff function");
  return await vendorStaffApi.get(`/getAllVendorStaff`)
  .then((response) => {
    if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 422) { // error
      console.log('failure in vendorStaffRedux :: getAllVendorStaff')
      return {status: false, data: response.data};
    } else { // success
      console.log("success in vendorStaffRedux :: getAllVendorStaff");
      return {status: true, data: response.data};
    }
  })
  .catch((error) => {
    console.error("vendorStaffRedux getAllVendorStaff Error : ", error);
  });
}