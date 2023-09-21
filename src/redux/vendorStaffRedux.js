import { userApi, vendorStaffApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getAllVendorStaff() {
  console.log("Enter getAllVendorStaff function");
  return await vendorStaffApi.get(`/getAllVendorStaff`)
    .then((response) => {
      console.log('in userRedux :: getAllVendorStaff')
      handleApiErrors(response);
    })
    .catch((error) => {
      console.error("vendorStaffRedux getAllVendorStaff Error : ", error);
    });
}